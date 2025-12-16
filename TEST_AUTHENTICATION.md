# Authentication Testing Guide

## Quick Test Script

### 1. Test Club Registration

**Steps:**
1. Open browser to `http://localhost:5173/club-signup`
2. Fill in the form:
   ```
   Admin Name: Test Admin
   Email: testclub@example.com
   Phone: +1234567890
   Club Name: Test FC
   Club Email: club@testfc.com
   Division: Professional
   League: Premier League
   Password: TestPass123!
   Confirm Password: TestPass123!
   ```
3. Click "Create Club Account"
4. Should redirect to `/dashboard`
5. User should be logged in

**Verify in Database:**
```sql
-- Check auth user
SELECT id, email FROM auth.users WHERE email = 'testclub@example.com';

-- Check profile
SELECT * FROM profiles WHERE email = 'testclub@example.com';

-- Check club record
SELECT * FROM clubs WHERE contact_email = 'club@testfc.com';
```

### 2. Test Scout Registration

**Steps:**
1. Open browser to `http://localhost:5173/scout-signup`
2. Fill in the form:
   ```
   First Name: John
   Last Name: Scout
   FIFA Licence: FIF123456
   Email: testscout@example.com
   Phone: +1234567890
   Country: United Kingdom
   Preferred League: Premier League
   Password: TestPass123!
   Confirm Password: TestPass123!
   ```
3. Click "Create Scout Account"
4. Should redirect to `/dashboard`
5. User should be logged in

**Verify in Database:**
```sql
-- Check auth user
SELECT id, email FROM auth.users WHERE email = 'testscout@example.com';

-- Check profile
SELECT * FROM profiles WHERE email = 'testscout@example.com';

-- Check scout record
SELECT * FROM scouts WHERE first_name = 'John' AND last_name = 'Scout';
```

### 3. Test Login - Club

**Steps:**
1. Logout if logged in
2. Navigate to `/login`
3. Select "Club" role
4. Enter credentials:
   ```
   Email: testclub@example.com
   Password: TestPass123!
   ```
5. Click "Sign In as Club"
6. Should redirect to `/dashboard`
7. Should load club name in header

### 4. Test Login - Scout

**Steps:**
1. Logout if logged in
2. Navigate to `/login`
3. Select "Scout" role
4. Enter credentials:
   ```
   Email: testscout@example.com
   Password: TestPass123!
   ```
5. Click "Sign In as Scout"
6. Should redirect to `/dashboard`
7. Should load scout name in header

### 5. Test Role Validation

**Steps:**
1. Logout if logged in
2. Navigate to `/login`
3. Select "Scout" role
4. Enter **club** credentials:
   ```
   Email: testclub@example.com
   Password: TestPass123!
   ```
5. Click "Sign In as Scout"
6. Should show error: "This account is registered as a club. Please select the correct role."
7. Should NOT log in

### 6. Test Session Persistence

**Steps:**
1. Login as club or scout
2. Refresh the page
3. User should remain logged in
4. Data should load correctly

### 7. Test Logout

**Steps:**
1. Login as any user
2. Click logout button
3. Should redirect to landing/login
4. Refresh page
5. Should remain logged out

## Common Test Scenarios

### Duplicate Email Registration
1. Try to register with existing email
2. Should show: "User already registered"

### Password Mismatch
1. Enter different passwords in signup form
2. Should show: "Passwords do not match"

### Invalid Email Format
1. Enter invalid email (e.g., "notanemail")
2. HTML5 validation should prevent submission

### Missing Required Fields
1. Leave required fields empty
2. HTML5 validation should prevent submission

### Wrong Password on Login
1. Enter correct email but wrong password
2. Should show: "Login failed. Please check your credentials."

## Browser Console Checks

### Successful Signup
```
// Should see in console:
✓ No errors
✓ Redirect to /dashboard
```

### Successful Login
```
// Should see in console:
✓ No errors
✓ User data loaded
✓ Redirect to /dashboard
```

### Failed Operations
```
// Should see descriptive error messages
✗ Login error: Invalid login credentials
✗ Signup error: User already registered
```

## Database Verification Queries

### Check All Profiles
```sql
SELECT
  p.id,
  p.email,
  p.user_type,
  p.phone,
  p.created_at,
  CASE
    WHEN p.user_type = 'club' THEN c.club_name
    WHEN p.user_type = 'scout' THEN s.first_name || ' ' || s.last_name
  END as name
FROM profiles p
LEFT JOIN clubs c ON c.profile_id = p.id
LEFT JOIN scouts s ON s.profile_id = p.id
ORDER BY p.created_at DESC;
```

### Check Auth Users
```sql
SELECT
  id,
  email,
  created_at,
  email_confirmed_at,
  raw_user_meta_data->>'user_type' as user_type
FROM auth.users
ORDER BY created_at DESC;
```

### Check RLS Policies Work
```sql
-- Should only return current user's data when authenticated
SELECT * FROM profiles;
SELECT * FROM clubs;
SELECT * FROM scouts;
```

## Performance Checks

### Page Load Time
- Initial page load: < 2s
- Login/signup: < 2s
- Dashboard load: < 1s

### Database Queries
- Profile load: 1 query
- Club/Scout data: 1 additional query
- Total: 2 queries per login

## Security Checks

### Password Storage
- Passwords should NEVER appear in:
  - Browser console
  - Network tab
  - Database (only hash in auth.users)

### Session Tokens
- Should be httpOnly cookies
- Should expire appropriately
- Should refresh automatically

### RLS Verification
Test that users can only access their own data:
1. Login as Club A
2. Try to access Club B's data via API
3. Should be blocked by RLS

## Troubleshooting

### Issue: Build fails
**Check:**
- @supabase/supabase-js is installed
- Environment variables are set
- No TypeScript errors

### Issue: Cannot connect to Supabase
**Check:**
- VITE_SUPABASE_URL is correct
- VITE_SUPABASE_ANON_KEY is correct
- Network connection
- Supabase project is active

### Issue: Profile not created
**Check:**
- Trigger `on_auth_user_created` exists
- Function `handle_new_user()` exists
- Check Supabase logs for errors

### Issue: Cannot insert club/scout data
**Check:**
- RLS policies allow INSERT
- All required fields are provided
- Foreign key constraints are satisfied

### Issue: Login fails after signup
**Check:**
- User exists in auth.users
- Profile exists in profiles table
- Role-specific record exists (clubs/scouts)
- Email/password are correct

## Success Criteria

- [x] Club registration creates user in database
- [x] Scout registration creates user in database
- [x] Login works with registered credentials
- [x] Role validation prevents wrong role access
- [x] Session persists across page refreshes
- [x] Logout clears session properly
- [x] Error messages are clear and helpful
- [x] No sensitive data exposed in console
- [x] RLS policies enforce data isolation
- [x] Build completes without errors