#!/usr/bin/env node
/**
 * Create Test Accounts for All User Roles
 *
 * This script creates fully functional test accounts for:
 * - Club Administrators (2 accounts)
 * - Scouts (2 accounts)
 * - Players (2 accounts)
 *
 * Uses Supabase Auth API to ensure proper authentication
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Test account configurations
const TEST_ACCOUNTS = {
  clubs: [
    {
      email: 'club@manchester.com',
      password: 'Club123!Test',
      role: 'club',
      data: {
        clubName: 'Manchester United FC',
        country: 'England',
        city: 'Manchester',
        league: 'Premier League',
        division: 'First Division',
        phone: '+44 161 868 8000',
        website: 'https://www.manutd.com',
        clubEmail: 'club@manchester.com',
        clubPhone: '+44 161 868 8000',
        foundedYear: 1878
      }
    },
    {
      email: 'club@madrid.com',
      password: 'Club123!Test',
      role: 'club',
      data: {
        clubName: 'Real Madrid CF',
        country: 'Spain',
        city: 'Madrid',
        league: 'La Liga',
        division: 'Primera División',
        phone: '+34 91 398 4300',
        website: 'https://www.realmadrid.com',
        clubEmail: 'club@madrid.com',
        clubPhone: '+34 91 398 4300',
        foundedYear: 1902
      }
    }
  ],
  scouts: [
    {
      email: 'scout@john.com',
      password: 'Scout123!Test',
      role: 'scout',
      data: {
        firstName: 'John',
        lastName: 'Thompson',
        country: 'England',
        city: 'London',
        phone: '+44 7700 900123',
        fifaLicenceNumber: 'FIFA-GB-2024-001',
        preferredLeague: 'Premier League'
      }
    },
    {
      email: 'scout@maria.com',
      password: 'Scout123!Test',
      role: 'scout',
      data: {
        firstName: 'Maria',
        lastName: 'Garcia',
        country: 'Spain',
        city: 'Barcelona',
        phone: '+34 600 123 456',
        fifaLicenceNumber: 'FIFA-ES-2024-002',
        preferredLeague: 'La Liga'
      }
    }
  ],
  players: [
    {
      email: 'player@david.com',
      password: 'Player123!Test',
      role: 'player',
      data: {
        firstName: 'David',
        lastName: 'Wilson',
        country: 'England',
        phone: '+44 7700 900456',
        dateOfBirth: '2000-03-15',
        position: 'ST',
        height: 185,
        weight: 78
      }
    },
    {
      email: 'player@carlos.com',
      password: 'Player123!Test',
      role: 'player',
      data: {
        firstName: 'Carlos',
        lastName: 'Rodriguez',
        country: 'Spain',
        phone: '+34 600 789 012',
        dateOfBirth: '1998-07-22',
        position: 'CM',
        height: 178,
        weight: 73
      }
    }
  ]
};

/**
 * Create a single user account with all role-specific data
 */
async function createAccount(accountConfig) {
  const { email, password, role, data } = accountConfig;

  console.log(`\n📝 Creating ${role}: ${email}`);

  try {
    // Step 1: Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: role,
          ...data
        }
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('   ⚠️  User already exists - skipping');
        return { success: false, reason: 'exists' };
      }
      console.log(`   ❌ Auth error: ${authError.message}`);
      return { success: false, reason: authError.message };
    }

    if (!authData.user) {
      console.log('   ❌ No user data returned');
      return { success: false, reason: 'no_user' };
    }

    const userId = authData.user.id;
    console.log(`   ✅ Auth user created: ${userId}`);

    // Step 2: Update profile with additional data
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        phone: data.phone,
        email: email,
        user_type: role
      })
      .eq('id', userId);

    if (profileError) {
      console.log(`   ⚠️  Profile update: ${profileError.message}`);
    }

    // Step 3: Create role-specific records
    if (role === 'club') {
      const { error: clubError } = await supabase
        .from('clubs')
        .insert({
          profile_id: userId,
          club_name: data.clubName,
          website: data.website,
          division: data.division,
          league: data.league,
          country: data.country,
          city: data.city,
          contact_email: data.clubEmail,
          contact_phone: data.clubPhone,
          founded_year: data.foundedYear,
          verified: true,
          plan_type: 'premium',
          player_limit: 50
        });

      if (clubError) {
        console.log(`   ⚠️  Club record: ${clubError.message}`);
      } else {
        console.log(`   ✅ Club profile created: ${data.clubName}`);
      }
    }
    else if (role === 'scout') {
      const { error: scoutError } = await supabase
        .from('scouts')
        .insert({
          profile_id: userId,
          first_name: data.firstName,
          last_name: data.lastName,
          fifa_licence_number: data.fifaLicenceNumber,
          country: data.country,
          city: data.city,
          preferred_leagues: [data.preferredLeague],
          verified: true,
          years_experience: 10
        });

      if (scoutError) {
        console.log(`   ⚠️  Scout record: ${scoutError.message}`);
      } else {
        console.log(`   ✅ Scout profile created: ${data.firstName} ${data.lastName}`);
      }
    }
    else if (role === 'player') {
      const { error: playerError } = await supabase
        .from('players')
        .insert({
          profile_id: userId,
          first_name: data.firstName,
          last_name: data.lastName,
          nationality: data.country,
          date_of_birth: data.dateOfBirth,
          position: data.position,
          height_cm: data.height,
          weight_kg: data.weight,
          preferred_foot: 'right',
          transfer_status: 'available',
          player_status: 'active'
        });

      if (playerError) {
        console.log(`   ⚠️  Player record: ${playerError.message}`);
      } else {
        console.log(`   ✅ Player profile created: ${data.firstName} ${data.lastName}`);
      }
    }

    // Sign out after creating the account
    await supabase.auth.signOut();

    console.log(`   ✅ Account completed: ${email}`);
    return { success: true, email, password, role };

  } catch (error) {
    console.log(`   ❌ Unexpected error: ${error.message}`);
    return { success: false, reason: error.message };
  }
}

/**
 * Main function to create all test accounts
 */
async function createAllAccounts() {
  console.log('\n🚀 ========================================');
  console.log('   CREATING TEST ACCOUNTS');
  console.log('   ========================================\n');

  const results = {
    created: [],
    skipped: [],
    failed: []
  };

  // Create club accounts
  console.log('\n📋 CREATING CLUB ACCOUNTS...');
  for (const club of TEST_ACCOUNTS.clubs) {
    const result = await createAccount(club);
    if (result.success) {
      results.created.push({ ...result, type: 'club' });
    } else if (result.reason === 'exists') {
      results.skipped.push({ email: club.email, role: club.role });
    } else {
      results.failed.push({ email: club.email, role: club.role, reason: result.reason });
    }
  }

  // Create scout accounts
  console.log('\n📋 CREATING SCOUT ACCOUNTS...');
  for (const scout of TEST_ACCOUNTS.scouts) {
    const result = await createAccount(scout);
    if (result.success) {
      results.created.push({ ...result, type: 'scout' });
    } else if (result.reason === 'exists') {
      results.skipped.push({ email: scout.email, role: scout.role });
    } else {
      results.failed.push({ email: scout.email, role: scout.role, reason: result.reason });
    }
  }

  // Create player accounts
  console.log('\n📋 CREATING PLAYER ACCOUNTS...');
  for (const player of TEST_ACCOUNTS.players) {
    const result = await createAccount(player);
    if (result.success) {
      results.created.push({ ...result, type: 'player' });
    } else if (result.reason === 'exists') {
      results.skipped.push({ email: player.email, role: player.role });
    } else {
      results.failed.push({ email: player.email, role: player.role, reason: result.reason });
    }
  }

  // Print summary
  console.log('\n\n🎉 ========================================');
  console.log('   SUMMARY');
  console.log('   ========================================\n');
  console.log(`   ✅ Created: ${results.created.length} accounts`);
  console.log(`   ⚠️  Skipped: ${results.skipped.length} accounts (already exist)`);
  console.log(`   ❌ Failed: ${results.failed.length} accounts`);

  if (results.created.length > 0) {
    console.log('\n\n📋 ========================================');
    console.log('   TEST CREDENTIALS');
    console.log('   ========================================\n');

    // Group by role
    const clubs = results.created.filter(r => r.type === 'club');
    const scouts = results.created.filter(r => r.type === 'scout');
    const players = results.created.filter(r => r.type === 'player');

    if (clubs.length > 0) {
      console.log('   🏢 CLUB ACCOUNTS:');
      clubs.forEach(c => {
        console.log(`      Email: ${c.email}`);
        console.log(`      Password: ${c.password}`);
        console.log('      ---');
      });
    }

    if (scouts.length > 0) {
      console.log('\n   🔍 SCOUT ACCOUNTS:');
      scouts.forEach(s => {
        console.log(`      Email: ${s.email}`);
        console.log(`      Password: ${s.password}`);
        console.log('      ---');
      });
    }

    if (players.length > 0) {
      console.log('\n   ⚽ PLAYER ACCOUNTS:');
      players.forEach(p => {
        console.log(`      Email: ${p.email}`);
        console.log(`      Password: ${p.password}`);
        console.log('      ---');
      });
    }
  }

  console.log('\n\n🎯 ========================================');
  console.log('   NEXT STEPS');
  console.log('   ========================================\n');
  console.log('   1. Start dev server: npm run dev');
  console.log('   2. Go to: http://localhost:5173/login');
  console.log('   3. Select role (Club/Scout/Player)');
  console.log('   4. Enter email and password from above');
  console.log('   5. Login → Auto-navigate to dashboard ✨');
  console.log('\n   ========================================\n');
}

// Run the script
createAllAccounts().catch(error => {
  console.error('\n❌ FATAL ERROR:', error);
  process.exit(1);
});
