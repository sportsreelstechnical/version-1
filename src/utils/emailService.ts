import { supabase } from '../lib/supabase';

interface SendCredentialsParams {
  to: string;
  recipientName: string;
  username: string;
  password: string;
  userType: 'player' | 'staff';
  clubName?: string;
}

/**
 * Sends login credentials via email using the edge function
 */
export async function sendCredentialsEmail(params: SendCredentialsParams): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-credentials-email`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send email');
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending credentials email:', error);
    throw error;
  }
}
