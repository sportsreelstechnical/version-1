# Authentication Troubleshooting Guide

## 📋 Issue Resolution for sinclairajoku@gmail.com

**Date**: January 20, 2026
**Status**: ✅ RESOLVED

---

## 🔍 Issues Reported

### Issue #1: Sign-up Fails with "Account Already Exists"
**Status**: ✅ RESOLVED

### Issue #2: Login Fails
**Status**: ✅ RESOLVED

### Issue #3: Google OAuth Not Working
**Status**: ⚠️ CONFIGURATION REQUIRED

---

## 🎯 Root Cause Analysis

### Issues #1 & #2: Incomplete Account Creation

**What Happened**:
- The signup process created the auth user and profile successfully
- However, the club record was never created in the database
- This caused a "partially created" account state

**Database State Found**:
```
✅ auth.users: EXISTS (ID: 2dbc766c-c3c6-499c-b0df-0fb5c5321012)
✅ profiles: EXISTS (user_type: 'club', status: 'active')
❌ clubs: MISSING
```

**Why Login Failed**:
The authentication system requires:
1. Valid auth credentials ✅
2. Profile record ✅
3. User-type specific record (club/scout/player) ❌

Without the club record, the `loadUserData()` function couldn't retrieve the club name, causing login to fail.

---

## ✅ RESOLUTION APPLIED

### Fix for sinclairajoku@gmail.com

Created the missing club record with default values:

```sql
INSERT INTO clubs (
  profile_id,
  club_name,
  league,
  country,
  contact_email,
  verified,
  plan_type,
  player_limit
) VALUES (
  '2dbc766c-c3c6-499c-b0df-0fb5c5321012',
  'Sinclair Club',
  'Unknown League',
  'Unknown',
  'sinclairajoku@gmail.com',
  false,
  'basic',
  25
);
```

**Current Account Status**:
```
✅ Email: sinclairajoku@gmail.com
✅ Password: chisom4you
✅ User Type: Club
✅ Club Name: Sinclair Club
✅ Status: Active
✅ Plan: Basic (25 player limit)
```

---

## 📝 USER INSTRUCTIONS

### How to Log In Now

1. **Go to Login Page**: Visit `/login`

2. **Select Role**: Click on "Club" (first option)

3. **Enter Credentials**:
   - Email: `sinclairajoku@gmail.com`
   - Password: `chisom4you`

4. **Click "Sign In"**: You should now successfully log in and be redirected to the dashboard

### After First Login

The club profile has been created with default/temporary information. Please update:

1. **Club Profile** → Settings
   - Update club name (currently: "Sinclair Club")
   - Add league information (currently: "Unknown League")
   - Add country (currently: "Unknown")
   - Add phone number
   - Add other club details

2. **Complete Your Profile**:
   - Add club logo
   - Add stadium information
   - Set up team rosters
   - Configure preferences

---

## 🔧 Issue #3: Google OAuth Configuration

### Current Status

Google OAuth is **implemented in the code** but requires **Supabase configuration** to function.

### Why Google OAuth Isn't Working

The Google Sign-In feature requires:
1. ✅ Frontend code (implemented)
2. ❌ Supabase Google provider enabled (not configured)
3. ❌ Google OAuth credentials (not configured)
4. ❌ Redirect URLs configured (not configured)

### How to Enable Google OAuth

#### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - Application name: "Sports Reels Platform"
   - User support email: Your email
   - Developer contact: Your email
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: "Sports Reels Auth"
   - Authorized redirect URIs:
     ```
     https://wtxbkaptcvkutdrcahhu.supabase.co/auth/v1/callback
     ```
7. Copy the **Client ID** and **Client Secret**

#### Step 2: Configure Supabase

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** in the list
5. Toggle **Enable Sign in with Google** to ON
6. Paste your Google credentials:
   - **Client ID**: (from Google Cloud Console)
   - **Client Secret**: (from Google Cloud Console)
7. Click **Save**

#### Step 3: Configure Redirect URLs

In Supabase Dashboard:
1. Go to **Authentication** → **URL Configuration**
2. Add redirect URLs:
   - Development: `http://localhost:5173/**`
   - Production: `https://yourdomain.com/**`
3. Set **Site URL** to your production domain

#### Step 4: Test Google OAuth

1. Go to login page
2. Select your role (Club/Scout/Player)
3. Click "Sign in with Google"
4. Authenticate with your Google account
5. You'll be redirected to the dashboard

---

## 🚨 Common Authentication Issues & Solutions

### Issue: "Account Already Exists" but Can't Log In

**Symptoms**:
- Signup shows "email already registered"
- Login fails with the same credentials
- No error message, just doesn't work

**Root Cause**:
Incomplete account creation - auth user exists but profile or role-specific record is missing.

**Solution** (Technical Support):
```sql
-- 1. Check what exists
SELECT * FROM auth.users WHERE email = 'user@example.com';
SELECT * FROM profiles WHERE email = 'user@example.com';
SELECT * FROM clubs WHERE profile_id = (SELECT id FROM profiles WHERE email = 'user@example.com');

-- 2. If club record is missing, create it
INSERT INTO clubs (profile_id, club_name, league, country, contact_email)
VALUES (
  (SELECT id FROM profiles WHERE email = 'user@example.com'),
  'Club Name',
  'League Name',
  'Country',
  'user@example.com'
);
```

### Issue: Wrong Role Selected at Login

**Symptoms**:
- Login shows error: "This account is registered as a [role]"
- User selected wrong role button

**Solution**:
1. Ask user which role they signed up as (Club/Scout/Player)
2. Ensure they select the correct role at login
3. The role selection buttons are at the top of the login form

**Prevention**:
The system automatically validates role on login and shows a clear error message.

### Issue: Email Not Verified

**Symptoms**:
- Can't log in
- Supabase email confirmation required

**Solution** (Development):
1. In Supabase Dashboard → Authentication → Email Templates
2. Disable email confirmation for development
3. Or implement email confirmation flow in production

**Solution** (User):
1. Check email inbox for confirmation link
2. Click the confirmation link
3. Try logging in again

### Issue: Password Forgotten

**Symptoms**:
- User can't remember password
- Need password reset

**Solution**:
The password reset feature is available but needs to be implemented. For now:

**Temporary Solution**:
```sql
-- Admin can verify account exists
SELECT email, created_at FROM auth.users WHERE email = 'user@example.com';

-- User should use "Forgot Password" link (if implemented)
-- Or contact support for manual password reset
```

### Issue: Google OAuth Redirect Loop

**Symptoms**:
- Clicks "Sign in with Google"
- Gets redirected to Google
- After authentication, redirected back but not logged in
- Keeps looping

**Root Cause**:
Incorrect redirect URL configuration in Google Cloud Console or Supabase.

**Solution**:
1. Verify redirect URL in Google Cloud Console matches Supabase:
   ```
   https://YOUR_PROJECT.supabase.co/auth/v1/callback
   ```
2. Ensure no trailing slashes
3. Check browser console for errors
4. Clear browser cache and cookies
5. Try incognito/private browsing mode

### Issue: Database Trigger Not Firing

**Symptoms**:
- User created in auth.users
- No profile record created
- Signup appears successful but login fails

**Root Cause**:
The `handle_new_user` trigger may have failed or is disabled.

**Solution** (Technical Support):
```sql
-- Check if trigger exists
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- If missing, recreate it
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Manually create missing profile
INSERT INTO profiles (id, email, user_type, email_verified, status)
VALUES (
  'user_id_from_auth_users',
  'user@example.com',
  'club',
  true,
  'active'
);
```

---

## 🔍 Diagnostic Commands

### Check Complete User State

```sql
-- Get full user information
SELECT
  au.id,
  au.email,
  au.created_at as auth_created,
  au.last_sign_in_at,
  p.user_type,
  p.status,
  c.club_name,
  c.league,
  c.country
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
LEFT JOIN clubs c ON c.profile_id = p.id
WHERE au.email = 'user@example.com';
```

### Check for Orphaned Auth Users

```sql
-- Find auth users without profiles
SELECT au.email, au.created_at
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE p.id IS NULL;
```

### Check for Incomplete Club Accounts

```sql
-- Find profiles without club records (for club users)
SELECT p.email, p.user_type, p.created_at
FROM profiles p
LEFT JOIN clubs c ON c.profile_id = p.id
WHERE p.user_type = 'club' AND c.id IS NULL;
```

### Verify RLS Policies

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'clubs', 'scouts', 'players');

-- List policies
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## 📞 Support Escalation Process

### Level 1: User Self-Service

**User Action**:
1. Verify correct email and password
2. Ensure correct role selected (Club/Scout/Player)
3. Try password reset if available
4. Clear browser cache
5. Try different browser or incognito mode

### Level 2: Technical Support

**Support Action**:
1. Verify account exists in database
2. Check for missing profile or role-specific record
3. Check recent error logs in Supabase
4. Verify RLS policies not blocking access
5. Create missing records if needed

### Level 3: Developer/Admin

**Admin Action**:
1. Check trigger functionality
2. Review authentication flow code
3. Check Supabase project configuration
4. Review OAuth configuration
5. Check for any system-wide issues

---

## ✅ Prevention Measures

### Prevent Incomplete Account Creation

**Code Enhancement Needed**:

Add transaction rollback on failure:

```typescript
const signup = async (userData: any): Promise<boolean> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({...});

    if (authError) throw authError;

    // Critical: Ensure profile is created
    const { error: profileError } = await supabase.from('profiles').update({...});
    if (profileError) {
      // Rollback: Delete auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    // Critical: Ensure club record is created
    if (userData.role === 'club') {
      const { error: clubError } = await supabase.from('clubs').insert({...});
      if (clubError) {
        // Rollback: Delete auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw clubError;
      }
    }

    return true;
  } catch (error) {
    // Show user-friendly error
    alert('Account creation failed. Please try again.');
    return false;
  }
};
```

### Add Data Validation

```typescript
// Validate required fields before submission
const validateClubData = (data: any): string[] => {
  const errors: string[] = [];

  if (!data.clubName) errors.push('Club name is required');
  if (!data.league) errors.push('League is required');
  if (!data.country) errors.push('Country is required');
  if (!data.email) errors.push('Email is required');
  if (!data.password || data.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  return errors;
};
```

### Add Better Error Messages

```typescript
// Current: Generic error
alert('Signup failed. Please try again.');

// Better: Specific error
if (error.message.includes('email')) {
  alert('This email is already registered. Please try logging in instead.');
} else if (error.message.includes('password')) {
  alert('Password must be at least 8 characters long.');
} else {
  alert(`Signup failed: ${error.message}`);
}
```

---

## 📊 Account Status Summary

### sinclairajoku@gmail.com

| Component | Status | Details |
|-----------|--------|---------|
| Auth User | ✅ Active | Created: 2026-01-20 11:37:47 |
| Profile | ✅ Active | Type: Club, Email Verified |
| Club Record | ✅ Created | Name: Sinclair Club |
| Login | ✅ Working | Password: chisom4you |
| Google OAuth | ⚠️ Not Configured | Requires Supabase setup |

**Action Required by User**:
1. ✅ Log in with email/password (now working)
2. ✅ Update club profile information
3. ⏳ Wait for Google OAuth configuration (admin task)

**Action Required by Admin**:
1. Configure Google OAuth in Supabase Dashboard
2. Add Google Cloud Console credentials
3. Set up redirect URLs
4. Test Google Sign-In functionality

---

## 🎯 Quick Reference

### Login Credentials
- **URL**: `/login`
- **Email**: `sinclairajoku@gmail.com`
- **Password**: `chisom4you`
- **Role**: Club (select first button)

### Test Accounts (For Reference)
- **Club**: admin@manchesterunited.com / ClubAdmin2024!
- **Scout**: john.thompson@scout.com / Scout2024!
- **Player**: david.wilson@player.com / Player2024!

### Support Contact
- **Email**: help@sportsreels.com
- **Documentation**: See AUTHENTICATION_COMPLETE_GUIDE.md
- **Quick Start**: See QUICK_START_AUTHENTICATION.md

---

**Last Updated**: January 20, 2026
**Issue Status**: ✅ RESOLVED
**Follow-up Required**: Google OAuth configuration
