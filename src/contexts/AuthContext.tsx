import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as AuthUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: 'club' | 'scout' | 'player' | 'staff') => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  signInWithGoogle: (role: 'club' | 'scout' | 'player') => Promise<void>;
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
    console.time('⏱️ [AUTH] checkSession - Total');
    try {
      console.time('⏱️ [AUTH] getSession');
      const { data: { session } } = await supabase.auth.getSession();
      console.timeEnd('⏱️ [AUTH] getSession');

      if (session) {
        await loadUserData(session.user);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
      console.timeEnd('⏱️ [AUTH] checkSession - Total');
    }
  };

  const loadUserData = async (authUser: AuthUser) => {
    console.time('⏱️ [AUTH] loadUserData - Total');
    try {
      console.time('⏱️ [AUTH] Query profiles table');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();
      console.timeEnd('⏱️ [AUTH] Query profiles table');

      if (profileError) throw profileError;

      if (profile) {
        console.log(`📊 [AUTH] User type detected: ${profile.user_type}`);
        let name = '';

        if (profile.user_type === 'club') {
          console.time('⏱️ [AUTH] Query clubs table');
          const { data: clubData } = await supabase
            .from('clubs')
            .select('club_name')
            .eq('profile_id', authUser.id)
            .maybeSingle();
          console.timeEnd('⏱️ [AUTH] Query clubs table');
          name = clubData?.club_name || 'Club User';
        } else if (profile.user_type === 'scout') {
          console.time('⏱️ [AUTH] Query scouts table');
          const { data: scoutData } = await supabase
            .from('scouts')
            .select('first_name, last_name')
            .eq('profile_id', authUser.id)
            .maybeSingle();
          console.timeEnd('⏱️ [AUTH] Query scouts table');
          name = scoutData ? `${scoutData.first_name} ${scoutData.last_name}` : 'Scout User';
        } else if (profile.user_type === 'player') {
          console.time('⏱️ [AUTH] Query players table');
          const { data: playerData } = await supabase
            .from('players')
            .select('first_name, last_name')
            .eq('profile_id', authUser.id)
            .maybeSingle();
          console.timeEnd('⏱️ [AUTH] Query players table');
          name = playerData ? `${playerData.first_name} ${playerData.last_name}` : 'Player User';
        } else if (profile.user_type === 'staff') {
          console.time('⏱️ [AUTH] Query club_staff table');
          const { data: staffData } = await supabase
            .from('club_staff')
            .select('staff_name, club_id')
            .eq('profile_id', authUser.id)
            .maybeSingle();
          console.timeEnd('⏱️ [AUTH] Query club_staff table');
          name = staffData?.staff_name || 'Staff User';

          const userData: User = {
            id: profile.id,
            role: 'staff',
            name,
            email: profile.email,
            phone: profile.phone || '',
            createdAt: profile.created_at,
            clubId: staffData?.club_id,
            isStaff: true,
          };
          console.log('✅ [AUTH] Staff user data loaded successfully');
          setUser(userData);
          console.timeEnd('⏱️ [AUTH] loadUserData - Total');
          return;
        }

        const userData: User = {
          id: profile.id,
          role: profile.user_type as 'club' | 'scout' | 'player' | 'staff',
          name,
          email: profile.email,
          phone: profile.phone || '',
          createdAt: profile.created_at
        };

        console.log('✅ [AUTH] User data loaded successfully');
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      console.timeEnd('⏱️ [AUTH] loadUserData - Total');
    }
  };

  const login = async (email: string, password: string, role: 'club' | 'scout' | 'player' | 'staff' = 'club'): Promise<boolean> => {
    console.time('⏱️ [AUTH] login - Total Flow');
    try {
      setLoading(true);

      console.time('⏱️ [AUTH] signInWithPassword');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      console.timeEnd('⏱️ [AUTH] signInWithPassword');

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      if (data.user) {
        console.time('⏱️ [AUTH] Role verification query');
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .maybeSingle();
        console.timeEnd('⏱️ [AUTH] Role verification query');

        if (profile && profile.user_type !== role) {
          console.time('⏱️ [AUTH] signOut (role mismatch)');
          await supabase.auth.signOut();
          console.timeEnd('⏱️ [AUTH] signOut (role mismatch)');
          alert(`This account is registered as a ${profile.user_type}. Please select the correct role.`);
          return false;
        }

        console.log(`🔐 [AUTH] Login successful for ${role} user`);
        await loadUserData(data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
      console.timeEnd('⏱️ [AUTH] login - Total Flow');
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

  const signInWithGoogle = async (role: 'club' | 'scout' | 'player') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'email profile'
        }
      });

      if (error) {
        console.error('Google sign-in error:', error.message);
        alert(`Google sign-in failed: ${error.message}`);
      }

      localStorage.setItem('pendingOAuthRole', role);
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('An error occurred during Google sign-in');
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, signInWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};