import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as AuthUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: 'club' | 'scout' | 'player') => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await loadUserData(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await loadUserData(session.user);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (authUser: AuthUser) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profile) {
        let name = '';

        if (profile.user_type === 'club') {
          const { data: clubData } = await supabase
            .from('clubs')
            .select('club_name')
            .eq('profile_id', authUser.id)
            .maybeSingle();
          name = clubData?.club_name || 'Club User';
        } else if (profile.user_type === 'scout') {
          const { data: scoutData } = await supabase
            .from('scouts')
            .select('first_name, last_name')
            .eq('profile_id', authUser.id)
            .maybeSingle();
          name = scoutData ? `${scoutData.first_name} ${scoutData.last_name}` : 'Scout User';
        } else if (profile.user_type === 'player') {
          const { data: playerData } = await supabase
            .from('players')
            .select('first_name, last_name')
            .eq('profile_id', authUser.id)
            .maybeSingle();
          name = playerData ? `${playerData.first_name} ${playerData.last_name}` : 'Player User';
        }

        const userData: User = {
          id: profile.id,
          role: profile.user_type as 'club' | 'scout' | 'player',
          name,
          email: profile.email,
          phone: profile.phone || '',
          createdAt: profile.created_at
        };

        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const login = async (email: string, password: string, role: 'club' | 'scout' | 'player' = 'club'): Promise<boolean> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profile && profile.user_type !== role) {
          await supabase.auth.signOut();
          alert(`This account is registered as a ${profile.user_type}. Please select the correct role.`);
          return false;
        }

        await loadUserData(data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: any): Promise<boolean> => {
    try {
      setLoading(true);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            user_type: userData.role
          }
        }
      });

      if (authError) {
        console.error('Signup error:', authError.message);
        alert(`Signup failed: ${authError.message}`);
        return false;
      }

      if (!authData.user) {
        alert('Signup failed: No user returned');
        return false;
      }

      const userId = authData.user.id;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          phone: userData.phone,
          email: userData.email
        })
        .eq('id', userId);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      if (userData.role === 'club') {
        const { error: clubError } = await supabase
          .from('clubs')
          .insert({
            profile_id: userId,
            club_name: userData.clubName,
            website: userData.website || null,
            division: userData.division,
            league: userData.league,
            country: userData.country || 'Unknown',
            contact_email: userData.clubEmail || userData.email,
            contact_phone: userData.clubPhone || userData.phone,
            founded_year: userData.foundedYear || null
          });

        if (clubError) {
          console.error('Club creation error:', clubError.message);
          alert(`Failed to create club profile: ${clubError.message}`);
          return false;
        }
      } else if (userData.role === 'scout') {
        const { error: scoutError } = await supabase
          .from('scouts')
          .insert({
            profile_id: userId,
            first_name: userData.firstName,
            last_name: userData.lastName,
            fifa_licence_number: userData.fifaLicenceNumber || null,
            country: userData.country || 'Unknown',
            preferred_leagues: userData.preferredLeague ? [userData.preferredLeague] : []
          });

        if (scoutError) {
          console.error('Scout creation error:', scoutError.message);
          alert(`Failed to create scout profile: ${scoutError.message}`);
          return false;
        }
      }

      await loadUserData(authData.user);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      alert('An unexpected error occurred during signup');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};