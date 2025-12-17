# Authentication System Setup Guide

## Overview
This guide provides complete documentation for the authentication system in the Sports Club Management Platform. The system supports three distinct user roles: Club Administrators, Scouts, and Players.

---

## Table of Contents
1. [Database Architecture](#database-architecture)
2. [Test Credentials](#test-credentials)
3. [Testing Authentication](#testing-authentication)
4. [Integration Guide](#integration-guide)
5. [Security Features](#security-features)
6. [Troubleshooting](#troubleshooting)

---

## Database Architecture

### Authentication Flow
```
User Login → Supabase Auth (auth.users)
                ↓
            Profiles Table (public.profiles)
                ↓
       Role-Specific Tables
     (clubs / scouts / players)
```

### Tables Overview

#### 1. `auth.users` (Managed by Supabase)
- Primary authentication table
- Stores encrypted passwords (bcrypt)
- Handles sessions and tokens
- Managed entirely by Supabase Auth API

#### 2. `public.profiles`
Base profile table for all users.

```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  user_type text NOT NULL CHECK (user_type IN ('club', 'scout', 'player')),
  email text UNIQUE NOT NULL,
  phone text,
  avatar_url text,
  status text DEFAULT 'active',
  email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### 3. Role-Specific Tables

**Clubs Table:**
```sql
CREATE TABLE clubs (
  id uuid PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id) UNIQUE NOT NULL,
  club_name text NOT NULL,
  country text NOT NULL,
  league text NOT NULL,
  -- Additional club fields...
);
```

**Scouts Table:**
```sql
CREATE TABLE scouts (
  id uuid PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id) UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  fifa_licence_number text UNIQUE,
  country text NOT NULL,
  -- Additional scout fields...
);
```

**Players Table:**
```sql
CREATE TABLE players (
  id uuid PRIMARY KEY,
  profile_id uuid REFERENCES players(id) UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  position text NOT NULL,
  nationality text NOT NULL,
  -- Additional player fields...
);
```

---

## Test Credentials

### Quick Reference

| Role | Email | Password |
|------|-------|----------|
| Club Admin | admin@manchesterunited.com | ClubAdmin2024! |
| Club Admin | admin@realmadrid.com | RealMadrid2024! |
| Scout | john.thompson@scout.com | Scout2024! |
| Scout | maria.garcia@scout.com | ScoutMaria2024! |
| Player | david.wilson@player.com | Player2024! |
| Player | carlos.rodriguez@player.com | CarlosPlayer2024! |

For complete details on each test account, see [TEST_CREDENTIALS.md](./TEST_CREDENTIALS.md).

---

## Testing Authentication

### Method 1: Using the Test Script

Run the automated test suite to verify all authentication functionality:

```bash
# Install dependencies (if not already installed)
npm install

# Run authentication tests
npm run test:auth
```

The test script will:
- Test database connectivity
- Verify all 6 test accounts can log in
- Check role-specific data access
- Validate RLS policies
- Test invalid login rejection
- Display comprehensive test results

### Method 2: Manual Testing via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → **auth.users**
3. Verify the test accounts exist
4. Check **profiles** table for corresponding records
5. Verify role-specific tables (clubs, scouts, players)

### Method 3: Testing in Your Application

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Test login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@manchesterunited.com',
  password: 'ClubAdmin2024!',
});

if (data.user) {
  console.log('Login successful:', data.user);

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  console.log('User role:', profile.user_type);
}
```

---

## Integration Guide

### Frontend Integration

#### 1. Login Component

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Authenticate user
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      // Get user profile with role
      const { data: profile, error: profileError } =
        await supabase
          .from('profiles')
          .select('user_type, status')
          .eq('id', authData.user.id)
          .single();

      if (profileError) throw profileError;

      // Check account status
      if (profile.status !== 'active') {
        throw new Error('Account is not active');
      }

      // Redirect based on role
      switch (profile.user_type) {
        case 'club':
          navigate('/dashboard');
          break;
        case 'scout':
          navigate('/scout-dashboard');
          break;
        case 'player':
          navigate('/player-profile');
          break;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

#### 2. Auth Context Provider

```tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

interface AuthContextType {
  user: any;
  profile: any;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data);
    }
    setLoading(false);
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### 3. Protected Routes

```tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute({
  children,
  allowedRoles
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(profile?.user_type)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}

// Usage:
<Route
  path="/dashboard"
  element={
    <ProtectedRoute allowedRoles={['club']}>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

**Profiles:**
- Users can only view and update their own profile
- Users can insert their own profile on signup

**Clubs:**
- Clubs can only view and manage their own data
- Scouts can view all clubs (read-only)

**Scouts:**
- Scouts can only view and manage their own data
- Clubs can view all scouts (read-only)

**Players:**
- Players can only view and manage their own data
- Clubs can view and manage their players
- Scouts can view all players (read-only)

### Session Management
- Sessions are automatically managed by Supabase
- Tokens are automatically refreshed
- Sessions expire after inactivity
- Multi-device support with session tracking

---

## Troubleshooting

### Common Issues

#### Issue 1: Login Fails with "Invalid credentials"
**Solution:**
- Verify email and password are correct (check TEST_CREDENTIALS.md)
- Check if account exists in auth.users table
- Verify Supabase connection in .env file

#### Issue 2: Profile Not Found After Login
**Solution:**
- Check if profile exists in profiles table
- Verify the trigger function is working:
```sql
SELECT * FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

#### Issue 3: RLS Policy Denies Access
**Solution:**
- Verify user is authenticated
- Check if user_type matches the policy requirements
- Test with service role key (bypass RLS) to isolate issue

#### Issue 4: Test Script Fails
**Solution:**
```bash
# Verify .env file exists with correct values
cat .env

# Check node version (requires Node 18+)
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Run with verbose logging
DEBUG=* npm run test:auth
```

### Verification Queries

Check if test users exist:
```sql
SELECT email, created_at
FROM auth.users
WHERE email LIKE '%@manchesterunited.com'
   OR email LIKE '%@scout.com'
   OR email LIKE '%@player.com';
```

Check profiles are linked:
```sql
SELECT u.email, p.user_type, p.status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email IN (
  'admin@manchesterunited.com',
  'john.thompson@scout.com',
  'david.wilson@player.com'
);
```

Check role-specific data:
```sql
-- Clubs
SELECT c.club_name, p.email
FROM clubs c
JOIN profiles p ON c.profile_id = p.id;

-- Scouts
SELECT s.first_name, s.last_name, p.email
FROM scouts s
JOIN profiles p ON s.profile_id = p.id;

-- Players
SELECT pl.first_name, pl.last_name, pl.position, p.email
FROM players pl
JOIN profiles p ON pl.profile_id = p.id;
```

---

## Additional Resources

- **Test Credentials:** See [TEST_CREDENTIALS.md](./TEST_CREDENTIALS.md)
- **Database Schema:** See [supabase/migrations/](./supabase/migrations/)
- **Supabase Docs:** https://supabase.com/docs/guides/auth
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security

---

## Support

For authentication issues:
1. Check this guide and TEST_CREDENTIALS.md
2. Run `npm run test:auth` to diagnose issues
3. Verify database migrations are applied
4. Check Supabase project logs in dashboard

---

**Last Updated:** December 17, 2025
