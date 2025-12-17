# Test User Credentials - Sports Club Management Platform

## Overview
This document contains all test login credentials for the three user roles in the sports club management platform. All accounts are fully functional and ready for testing.

---

## Test Accounts

### 🏆 CLUB ADMINISTRATORS (2 accounts)

#### 1. Manchester United FC
```
Role:           Club Administrator
Email:          admin@manchesterunited.com
Password:       ClubAdmin2024!
Club Name:      Manchester United FC
Country:        England
League:         Premier League
Stadium:        Old Trafford
Founded:        1878
Plan Type:      Premium
Status:         Active & Verified
```

#### 2. Real Madrid CF
```
Role:           Club Administrator
Email:          admin@realmadrid.com
Password:       RealMadrid2024!
Club Name:      Real Madrid CF
Country:        Spain
League:         La Liga
Stadium:        Santiago Bernabéu
Founded:        1902
Plan Type:      Premium
Status:         Active & Verified
```

---

### 🔍 SCOUTS (2 accounts)

#### 3. John Thompson
```
Role:           Scout
Email:          john.thompson@scout.com
Password:       Scout2024!
Name:           John Thompson
FIFA License:   FIFA-GB-2024-001
Country:        England
City:           London
Experience:     12 years
Specialization: Strikers, Center Forwards, Wingers
Preferred:      Premier League, Championship, Bundesliga
Status:         Active & Verified
```

#### 4. Maria Garcia
```
Role:           Scout
Email:          maria.garcia@scout.com
Password:       ScoutMaria2024!
Name:           Maria Garcia
FIFA License:   FIFA-ES-2024-002
Country:        Spain
City:           Barcelona
Experience:     8 years
Specialization: Central Midfielders, Defensive Midfielders, Defenders
Preferred:      La Liga, Serie A, Ligue 1
Status:         Active & Verified
```

---

### ⚽ PLAYERS (2 accounts)

#### 5. David Wilson
```
Role:           Player
Email:          david.wilson@player.com
Password:       Player2024!
Name:           David Wilson
FIFA ID:        FIFA-ENG-2000-001
Position:       ST (Striker)
Secondary:      CF (Center Forward)
Nationality:    England
Date of Birth:  March 15, 2000 (24 years old)
Height:         185 cm
Weight:         78 kg
Foot:           Right
Jersey:         #9
Market Value:   €2,500,000
Status:         Active & Available for Transfer
Agent:          James Anderson (james.anderson@agents.com)
```

#### 6. Carlos Rodriguez
```
Role:           Player
Email:          carlos.rodriguez@player.com
Password:       CarlosPlayer2024!
Name:           Carlos Rodriguez
FIFA ID:        FIFA-ESP-1998-002
Position:       CM (Central Midfielder)
Secondary:      CAM (Attacking Midfielder)
Nationality:    Spain
Date of Birth:  July 22, 1998 (26 years old)
Height:         178 cm
Weight:         73 kg
Foot:           Left
Jersey:         #8
Market Value:   €3,500,000
Status:         Active & Available for Transfer
Agent:          Elena Martinez (elena.martinez@agents.com)
```

---

## Quick Reference Table

| # | Email | Password | Role | Name/Club |
|---|-------|----------|------|-----------|
| 1 | admin@manchesterunited.com | ClubAdmin2024! | Club | Manchester United FC |
| 2 | admin@realmadrid.com | RealMadrid2024! | Club | Real Madrid CF |
| 3 | john.thompson@scout.com | Scout2024! | Scout | John Thompson |
| 4 | maria.garcia@scout.com | ScoutMaria2024! | Scout | Maria Garcia |
| 5 | david.wilson@player.com | Player2024! | Player | David Wilson |
| 6 | carlos.rodriguez@player.com | CarlosPlayer2024! | Player | Carlos Rodriguez |

---

## Database Schema

### Tables Structure

#### 1. Authentication (auth.users)
- Managed by Supabase Auth
- Passwords are bcrypt hashed
- Email verification enabled
- All test accounts have confirmed emails

#### 2. Profiles (public.profiles)
```sql
- id (uuid) - References auth.users.id
- user_type (text) - 'club', 'scout', or 'player'
- email (text)
- phone (text)
- status (text) - 'active', 'inactive', or 'suspended'
- email_verified (boolean)
- created_at, updated_at (timestamp)
```

#### 3. Role-Specific Tables
- **clubs** - Club information and management
- **scouts** - Scout credentials and specializations
- **players** - Player profiles and statistics

---

## SQL Authentication Queries

### 1. Basic Authentication Query
```sql
-- Verify user credentials and get user type
SELECT
  u.id,
  u.email,
  p.user_type,
  p.status
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@manchesterunited.com'
  AND p.status = 'active';
```

### 2. Get Club Administrator Details
```sql
-- Retrieve complete club admin profile
SELECT
  p.id,
  p.email,
  p.user_type,
  c.club_name,
  c.country,
  c.league,
  c.stadium_name,
  c.plan_type,
  c.verified
FROM public.profiles p
JOIN public.clubs c ON p.id = c.profile_id
WHERE p.email = 'admin@manchesterunited.com'
  AND p.user_type = 'club';
```

### 3. Get Scout Details
```sql
-- Retrieve complete scout profile
SELECT
  p.id,
  p.email,
  s.first_name,
  s.last_name,
  s.fifa_licence_number,
  s.country,
  s.specialization,
  s.years_experience,
  s.verified
FROM public.profiles p
JOIN public.scouts s ON p.id = s.profile_id
WHERE p.email = 'john.thompson@scout.com'
  AND p.user_type = 'scout';
```

### 4. Get Player Details
```sql
-- Retrieve complete player profile
SELECT
  p.id,
  p.email,
  pl.first_name,
  pl.last_name,
  pl.position,
  pl.nationality,
  pl.date_of_birth,
  pl.market_value_eur,
  pl.transfer_status,
  pl.player_status
FROM public.profiles p
JOIN public.players pl ON p.id = pl.profile_id
WHERE p.email = 'david.wilson@player.com'
  AND p.user_type = 'player';
```

### 5. Authentication with Role Check
```sql
-- Complete authentication check with role-based data
SELECT
  u.id as user_id,
  u.email,
  p.user_type,
  p.status,
  CASE
    WHEN p.user_type = 'club' THEN (SELECT club_name FROM clubs WHERE profile_id = u.id)
    WHEN p.user_type = 'scout' THEN (SELECT first_name || ' ' || last_name FROM scouts WHERE profile_id = u.id)
    WHEN p.user_type = 'player' THEN (SELECT first_name || ' ' || last_name FROM players WHERE profile_id = u.id)
  END as display_name
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email = $1  -- Email parameter
  AND p.status = 'active';
```

### 6. Check User Permissions by Role
```sql
-- Get user with their role-specific permissions
SELECT
  p.id,
  p.email,
  p.user_type,
  CASE p.user_type
    WHEN 'club' THEN jsonb_build_object(
      'can_manage_players', true,
      'can_upload_matches', true,
      'can_view_scouts', true,
      'can_manage_staff', true
    )
    WHEN 'scout' THEN jsonb_build_object(
      'can_view_players', true,
      'can_view_matches', true,
      'can_create_reports', true,
      'can_contact_clubs', true
    )
    WHEN 'player' THEN jsonb_build_object(
      'can_view_own_stats', true,
      'can_update_profile', true,
      'can_view_own_reports', true
    )
  END as permissions
FROM public.profiles p
WHERE p.id = $1;  -- User ID parameter
```

### 7. List All Test Users
```sql
-- Get all test accounts with their details
SELECT
  u.email,
  p.user_type,
  p.status,
  u.email_confirmed_at IS NOT NULL as email_verified,
  u.created_at
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email IN (
  'admin@manchesterunited.com',
  'admin@realmadrid.com',
  'john.thompson@scout.com',
  'maria.garcia@scout.com',
  'david.wilson@player.com',
  'carlos.rodriguez@player.com'
)
ORDER BY p.user_type, u.email;
```

---

## Using Supabase Client for Authentication

### JavaScript/TypeScript Example

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Sign in with test credentials
async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login failed:', error.message);
    return null;
  }

  // Get user profile with role information
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  return {
    user: data.user,
    profile,
    session: data.session,
  };
}

// Example: Sign in as club admin
const clubAdmin = await signIn('admin@manchesterunited.com', 'ClubAdmin2024!');

// Example: Sign in as scout
const scout = await signIn('john.thompson@scout.com', 'Scout2024!');

// Example: Sign in as player
const player = await signIn('david.wilson@player.com', 'Player2024!');
```

---

## Security Features

### Password Security
- All passwords are hashed using bcrypt (Supabase default)
- Salt rounds: 10 (bcrypt default)
- Passwords meet complexity requirements:
  - Minimum 8 characters
  - Contains uppercase and lowercase letters
  - Contains numbers
  - Contains special characters

### Account Security
- Email verification: ✅ Enabled (pre-verified for testing)
- Row Level Security (RLS): ✅ Enabled on all tables
- Account status tracking: ✅ Active monitoring
- Session management: ✅ Handled by Supabase Auth

### Data Protection
- Each user can only access their own data
- Scouts have read-only access to players and clubs
- Clubs can manage their own players only
- Cross-role data access is restricted by RLS policies

---

## Testing Scenarios

### Scenario 1: Club Administrator Workflow
1. Login as: admin@manchesterunited.com
2. Access: Club dashboard, player management, match uploads
3. Test: Adding players, uploading match videos, viewing statistics

### Scenario 2: Scout Workflow
1. Login as: john.thompson@scout.com
2. Access: Player database, match videos, scouting reports
3. Test: Creating scouting reports, searching players, contacting clubs

### Scenario 3: Player Workflow
1. Login as: david.wilson@player.com
2. Access: Personal profile, statistics, career history
3. Test: Updating profile, viewing own statistics, managing availability

---

## Important Notes

⚠️ **TESTING ONLY**: These credentials are for development and testing purposes only. DO NOT use in production environments.

⚠️ **PASSWORD SECURITY**: All passwords are examples. In production, users should create their own secure passwords.

⚠️ **DATA RESET**: These test accounts can be deleted and recreated as needed during development.

✅ **VERIFICATION**: All test accounts are pre-verified to streamline testing workflows.

✅ **COMPLETE DATA**: Each account has complete profile information including role-specific details.

---

## Support

For issues with test credentials or authentication:
1. Check database connection in `.env` file
2. Verify Supabase project is running
3. Check RLS policies are correctly configured
4. Review migration logs for any errors

---

**Last Updated**: December 17, 2025
**Migration File**: `supabase/migrations/create_test_users_with_credentials.sql`
