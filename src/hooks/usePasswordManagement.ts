import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { generatePasswordFromEmail } from '../utils/passwordUtils';

interface GenerateCredentialsParams {
  email: string;
  userType: 'player' | 'staff';
  userId: string;
  name: string;
  clubName?: string;
}

interface Credentials {
  email: string;
  username: string;
  password: string;
  recipientName: string;
  userType: 'player' | 'staff';
  clubName?: string;
}

export function usePasswordManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Credentials | null>(null);

  const generatePlayerCredentials = async (params: GenerateCredentialsParams): Promise<Credentials> => {
    const { email, name, clubName } = params;

    // Generate username from email
    const { data: username, error: usernameError } = await supabase
      .rpc('generate_player_username', { email_param: email });

    if (usernameError) {
      console.error('Error generating username:', usernameError);
      throw new Error('Failed to generate username');
    }

    // Generate password from email
    const password = generatePasswordFromEmail(email);

    const creds: Credentials = {
      email,
      username: username || email.split('@')[0],
      password,
      recipientName: name,
      userType: 'player',
      clubName,
    };

    setCredentials(creds);
    return creds;
  };

  const generateStaffCredentials = async (params: GenerateCredentialsParams): Promise<Credentials> => {
    const { email, name, clubName } = params;

    // For staff, username is email
    const username = email;

    // Generate password from email
    const password = generatePasswordFromEmail(email);

    const creds: Credentials = {
      email,
      username,
      password,
      recipientName: name,
      userType: 'staff',
      clubName,
    };

    setCredentials(creds);
    return creds;
  };

  const resetPlayerPassword = async (
    playerId: string,
    email: string,
    name: string,
    clubName?: string
  ): Promise<Credentials> => {
    setLoading(true);
    setError(null);

    try {
      // Generate new password
      const password = generatePasswordFromEmail(email);

      // Update player password in database
      const { error: updateError } = await supabase
        .rpc('reset_player_password', {
          player_id_param: playerId,
          new_password_hash: password, // In production, this should be hashed
        });

      if (updateError) {
        throw new Error('Failed to reset password');
      }

      // Get username
      const { data: player } = await supabase
        .from('players')
        .select('username')
        .eq('id', playerId)
        .single();

      const creds: Credentials = {
        email,
        username: player?.username || email,
        password,
        recipientName: name,
        userType: 'player',
        clubName,
      };

      setCredentials(creds);
      return creds;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetStaffPassword = async (
    staffId: string,
    email: string,
    name: string,
    clubName?: string
  ): Promise<Credentials> => {
    setLoading(true);
    setError(null);

    try {
      // Generate new password
      const password = generatePasswordFromEmail(email);

      // Update staff password in database
      const { error: updateError } = await supabase
        .rpc('reset_staff_password', {
          staff_id_param: staffId,
          new_password_hash: password, // In production, this should be hashed
        });

      if (updateError) {
        throw new Error('Failed to reset password');
      }

      const creds: Credentials = {
        email,
        username: email, // Staff uses email as username
        password,
        recipientName: name,
        userType: 'staff',
        clubName,
      };

      setCredentials(creds);
      return creds;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCredentials = () => {
    setCredentials(null);
    setError(null);
  };

  return {
    loading,
    error,
    credentials,
    generatePlayerCredentials,
    generateStaffCredentials,
    resetPlayerPassword,
    resetStaffPassword,
    clearCredentials,
  };
}
