import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailRequest {
  to: string;
  recipientName: string;
  username: string;
  password: string;
  userType: 'player' | 'staff';
  clubName?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { to, recipientName, username, password, userType, clubName }: EmailRequest = await req.json();

    // Validate required fields
    if (!to || !recipientName || !username || !password || !userType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate email content based on user type
    const subject = userType === 'player' 
      ? 'Your Player Account Credentials'
      : `Your ${clubName || 'Club'} Staff Account Credentials`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .credential-row { margin: 15px 0; }
            .label { font-weight: bold; color: #667eea; display: block; margin-bottom: 5px; }
            .value { font-size: 18px; font-family: monospace; background: #f3f4f6; padding: 10px; border-radius: 4px; display: block; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Sports Management Platform</h1>
              <p>Your login credentials are ready</p>
            </div>
            <div class="content">
              <p>Hello ${recipientName},</p>
              
              <p>${userType === 'player' 
                ? 'Your player account has been created. You can now log in to access your profile, view statistics, and manage your career information.'
                : `You have been added as a staff member for ${clubName || 'the club'}. You can now log in to access your assigned features and manage club operations.`
              }</p>

              <div class="credentials">
                <h3 style="margin-top: 0; color: #667eea;">🔐 Your Login Credentials</h3>
                <div class="credential-row">
                  <span class="label">Email / Username:</span>
                  <span class="value">${username}</span>
                </div>
                <div class="credential-row">
                  <span class="label">Temporary Password:</span>
                  <span class="value">${password}</span>
                </div>
              </div>

              <div class="warning">
                <strong>⚠️ Important Security Notice</strong>
                <p style="margin: 10px 0 0 0;">For your security, please change this password immediately after your first login. This is a temporary password that should not be shared with anyone.</p>
              </div>

              <p style="margin-top: 30px;">
                <strong>Next Steps:</strong>
              </p>
              <ol>
                <li>Visit the login page</li>
                <li>Enter your username/email and the temporary password above</li>
                <li>You'll be prompted to create a new secure password</li>
                <li>Complete your profile setup</li>
              </ol>

              ${userType === 'staff' ? `
                <p><strong>Your Access Level:</strong> You have been granted specific permissions to manage club operations. Please review your assigned features and responsibilities after logging in.</p>
              ` : ''}

              <p>If you have any questions or need assistance, please contact your ${userType === 'player' ? 'club administrator' : 'super administrator'}.</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; 2024 Sports Management Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
Welcome to Sports Management Platform

Hello ${recipientName},

${userType === 'player' 
  ? 'Your player account has been created.'
  : `You have been added as a staff member for ${clubName || 'the club'}.`
}

Your Login Credentials:
- Email/Username: ${username}
- Temporary Password: ${password}

IMPORTANT: Please change this password immediately after your first login.

Next Steps:
1. Visit the login page
2. Enter your username/email and the temporary password
3. Create a new secure password
4. Complete your profile setup

If you have any questions, please contact your administrator.

This is an automated message.
    `;

    // In a production environment, you would integrate with an email service provider
    // such as SendGrid, AWS SES, Resend, or Mailgun
    // For now, we'll log the email and return success
    
    console.log('Email would be sent to:', to);
    console.log('Subject:', subject);
    console.log('Username:', username);
    console.log('Password:', password);

    // Simulated email sending
    // TODO: Integrate with actual email service provider
    // Example with Resend:
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'noreply@yourdomain.com',
    //     to,
    //     subject,
    //     html: htmlContent,
    //     text: textContent,
    //   }),
    // });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Credentials email sent successfully',
        debug: {
          to,
          subject,
          note: 'Email sending is simulated. Integrate with actual email provider for production.'
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to send email',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
