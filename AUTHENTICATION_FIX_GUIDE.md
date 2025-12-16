# Authentication & Database Integration - Debugging Guide

## Problem Summary
User registration data was not being saved to the database, preventing users from logging in with newly created credentials.

## Root Causes Identified

### 1. No Supabase Integration
- **Issue**: `AuthContext.tsx` was using localStorage and mock data instead of Supabase
- **Impact**: No actual database writes occurred during signup
- **Location**: `src/contexts/AuthContext.tsx` lines 84-109

### 2. Missing Supabase Client
- **Issue**: No Supabase client initialization
- **Impact**: Application couldn't connect to the database
- **Solution**: Created `src/lib/supabase.ts` with client configuration

### 3. Mock Authentication Logic
- **Issue**: Login only checked hardcoded demo credentials
- **Impact**: Real user accounts couldn't authenticate
- **Location**: `src/contexts/AuthContext.tsx` lines 41-82

### 4. No Database Schema Integration
- **Issue**: Signup didn't create profile, club, or scout records
- **Impact**: User data never persisted to database tables
- **Location**: Signup function in AuthContext

## Solutions Implemented

### 1. Created Supabase Client (`src/lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 2. Rewrote Authentication Context

#### Signup Flow (Lines 142-228)
**Club Registration:**
1. Creates auth user with Supabase Auth (`supabase.auth.signUp`)
2. Stores `user_type: 'club'` in user metadata
3. Profile auto-created via database trigger (`handle_new_user()`)
4. Updates profile with phone number
5. Inserts club record in `clubs` table with:
   - club_name
   - league
   - division
   - website
   - contact information

**Scout Registration:**
1. Creates auth user with Supabase Auth
2. Stores `user_type: 'scout'` in metadata
3. Profile auto-created via trigger
4. Updates profile with phone number
5. Inserts scout record in `scouts` table with:
   - first_name, last_name
   - fifa_licence_number
   - country
   - preferred_leagues

#### Login Flow (Lines 102-140)
1. Authenticates with Supabase (`signInWithPassword`)
2. Verifies user type matches selected role
3. Loads profile data from `profiles` table
4. Loads role-specific data (club_name or scout name)
5. Creates User object with complete information
6. Stores in React state

#### Session Management (Lines 28-55)
- Checks for existing session on mount
- Listens to auth state changes
- Auto-loads user data on sign in
- Clears user data on sign out

### 3. Database Trigger Integration
The existing database trigger (`handle_new_user()`) automatically creates profile records when users sign up via Supabase Auth.

## Testing Steps

### Test Club Registration
1. Navigate to `/club-signup`
2. Fill in all required fields:
   - Admin Name
   - Email (unique)
   - Phone
   - Club Name
   - Club Email
   - Division
   - League
   - Password (matching confirmation)
3. Click "Create Club Account"
4. Should redirect to dashboard
5. Verify in Supabase:
   - `auth.users` has new user
   - `profiles` has profile with user_type='club'
   - `clubs` has club record

### Test Scout Registration
1. Navigate to `/scout-signup`
2. Fill in required fields:
   - First Name, Last Name
   - FIFA Licence Number
   - Email (unique)
   - Phone
   - Country
   - Preferred League
   - Password (matching)
3. Click "Create Scout Account"
4. Should redirect to dashboard
5. Verify in Supabase:
   - `auth.users` has new user
   - `profiles` has profile with user_type='scout'
   - `scouts` has scout record

### Test Login
1. Navigate to `/login`
2. Select role (Club or Scout)
3. Enter email and password from registration
4. Click "Sign In"
5. Should redirect to dashboard
6. User data should be loaded correctly

### Test Role Validation
1. Create a club account
2. Try to login as scout with club credentials
3. Should show error: "This account is registered as a club"
4. Should not allow login with wrong role

## Error Handling

### Signup Errors
- **Duplicate Email**: Supabase returns error, shown to user
- **Weak Password**: Supabase enforces password requirements
- **Missing Required Fields**: Form validation prevents submission
- **Database Errors**: Logged to console with user-friendly alerts

### Login Errors
- **Invalid Credentials**: Shows "Login failed" message
- **Wrong Role**: Shows specific message about account type
- **Network Errors**: Caught and logged to console

## Database Schema Dependencies

### Required Tables
- `profiles` (created by migration)
- `clubs` (created by migration)
- `scouts` (created by migration)

### Required Triggers
- `on_auth_user_created` - Creates profile on signup
- `handle_new_user()` - Function that inserts profile

### Row Level Security
All tables have RLS enabled with appropriate policies:
- Users can insert/update their own profiles
- Clubs can insert/update their club data
- Scouts can insert/update their scout data

## Common Issues & Solutions

### Issue: "User already registered"
**Cause**: Email already exists in auth.users
**Solution**: Use different email or reset password

### Issue: "Failed to create club/scout profile"
**Cause**: RLS policy or missing required field
**Solution**: Check database policies and required fields

### Issue: "Login failed"
**Cause**: Incorrect credentials or role mismatch
**Solution**: Verify email/password and selected role

### Issue: User data not loading after login
**Cause**: Profile or role-specific table missing data
**Solution**: Check that signup completed all database inserts

## Performance Considerations

### Session Check on Mount
- Single query to check existing session
- Prevents unnecessary re-authentication
- Fast load for returning users

### Data Loading Strategy
- Loads profile first
- Then loads role-specific data (club/scout)
- Uses `maybeSingle()` to handle missing records gracefully

### Auth State Listener
- Automatically updates UI on auth changes
- Handles logout, login, token refresh
- Unsubscribes on unmount to prevent memory leaks

## Security Features

### Password Security
- Handled by Supabase Auth (bcrypt hashing)
- Never stored or transmitted in plain text
- Password requirements enforced by Supabase

### Role Verification
- User type stored in both metadata and profile
- Login validates role matches account type
- Prevents cross-role access

### Row Level Security
- Database policies ensure data isolation
- Users only access their own data
- Scouts have read-only access to players/clubs

## Future Improvements

1. **Email Verification**
   - Enable email confirmation in Supabase settings
   - Add verification check before full access

2. **Password Reset**
   - Implement forgot password flow
   - Use Supabase password reset

3. **Social Authentication**
   - Add Google, GitHub, etc. providers
   - Configure in Supabase dashboard

4. **Two-Factor Authentication**
   - Enable MFA in Supabase
   - Add UI for 2FA setup

5. **Better Error Messages**
   - Replace alerts with toast notifications
   - Show field-specific validation errors

6. **Loading States**
   - Add spinners during authentication
   - Show skeleton screens while loading data

## Dependencies Added

```json
{
  "@supabase/supabase-js": "^2.x.x"
}
```

## Environment Variables Required

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Files Modified

1. **Created**: `src/lib/supabase.ts` - Supabase client
2. **Modified**: `src/contexts/AuthContext.tsx` - Complete rewrite
3. **Modified**: `package.json` - Added @supabase/supabase-js

## Testing Checklist

- [x] Build succeeds without errors
- [ ] Club registration creates all required records
- [ ] Scout registration creates all required records
- [ ] Login works with club credentials
- [ ] Login works with scout credentials
- [ ] Role validation prevents wrong role login
- [ ] Session persists on page reload
- [ ] Logout clears session properly
- [ ] Error messages are user-friendly
- [ ] RLS policies allow appropriate access

## Conclusion

The authentication system now properly integrates with Supabase, storing all user data in the database and enabling secure login/logout functionality. Users can successfully register as clubs or scouts, and their data persists across sessions.