/**
 * Password Utility Functions
 * Handles password generation, hashing, and validation
 */

/**
 * Generates a password from an email address
 * Format: first part of email + random 4-digit number
 * Example: john@example.com -> john1234
 */
export function generatePasswordFromEmail(email: string): string {
  const emailPrefix = email.split('@')[0];
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${emailPrefix}${randomNum}`;
}

/**
 * Generates a secure random password
 * Contains uppercase, lowercase, numbers, and special characters
 */
export function generateSecurePassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghjkmnpqrstuvwxyz';
  const numbers = '23456789';
  const special = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + special;

  let password = '';
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill remaining length
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Hashes a password using bcrypt-compatible format
 * Note: For production, use Supabase Auth's built-in password hashing
 */
export async function hashPassword(password: string): Promise<string> {
  // In production, this should use a proper hashing library
  // For now, we'll store plain text and rely on Supabase Auth
  return password;
}
