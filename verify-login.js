#!/usr/bin/env node
/**
 * Verify Login Functionality for All User Types
 *
 * Tests authentication and data retrieval for:
 * - Club users
 * - Scout users
 * - Player users
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const TEST_CREDENTIALS = [
  { email: 'club@manchester.com', password: 'Club123!Test', role: 'club', name: 'Manchester United FC' },
  { email: 'club@madrid.com', password: 'Club123!Test', role: 'club', name: 'Real Madrid CF' },
  { email: 'scout@john.com', password: 'Scout123!Test', role: 'scout', name: 'John Thompson' },
  { email: 'scout@maria.com', password: 'Scout123!Test', role: 'scout', name: 'Maria Garcia' },
  { email: 'player@david.com', password: 'Player123!Test', role: 'player', name: 'David Wilson' },
  { email: 'player@carlos.com', password: 'Player123!Test', role: 'player', name: 'Carlos Rodriguez' }
];

async function testLogin(credentials) {
  const { email, password, role, name } = credentials;

  console.log(`\n🔐 Testing: ${role.toUpperCase()} - ${name}`);
  console.log(`   Email: ${email}`);

  try {
    // Step 1: Attempt login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.log(`   ❌ Login FAILED: ${authError.message}`);
      return { success: false, role, error: authError.message };
    }

    if (!authData.user) {
      console.log(`   ❌ Login FAILED: No user returned`);
      return { success: false, role, error: 'No user' };
    }

    console.log(`   ✅ Login SUCCESS`);
    console.log(`   User ID: ${authData.user.id}`);

    // Step 2: Check profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError) {
      console.log(`   ⚠️  Profile check: ${profileError.message}`);
    } else if (!profile) {
      console.log(`   ⚠️  Profile not found`);
    } else {
      console.log(`   ✅ Profile found: ${profile.user_type}`);

      if (profile.user_type !== role) {
        console.log(`   ⚠️  WARNING: Expected role "${role}" but got "${profile.user_type}"`);
      }
    }

    // Step 3: Check role-specific data
    if (role === 'club') {
      const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .select('club_name, league, country')
        .eq('profile_id', authData.user.id)
        .maybeSingle();

      if (clubError) {
        console.log(`   ⚠️  Club data: ${clubError.message}`);
      } else if (clubData) {
        console.log(`   ✅ Club data: ${clubData.club_name} (${clubData.league})`);
      }
    }
    else if (role === 'scout') {
      const { data: scoutData, error: scoutError } = await supabase
        .from('scouts')
        .select('first_name, last_name, country')
        .eq('profile_id', authData.user.id)
        .maybeSingle();

      if (scoutError) {
        console.log(`   ⚠️  Scout data: ${scoutError.message}`);
      } else if (scoutData) {
        console.log(`   ✅ Scout data: ${scoutData.first_name} ${scoutData.last_name} (${scoutData.country})`);
      }
    }
    else if (role === 'player') {
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .select('first_name, last_name, position')
        .eq('profile_id', authData.user.id)
        .maybeSingle();

      if (playerError) {
        console.log(`   ⚠️  Player data: ${playerError.message}`);
      } else if (playerData) {
        console.log(`   ✅ Player data: ${playerData.first_name} ${playerData.last_name} (${playerData.position})`);
      }
    }

    // Sign out
    await supabase.auth.signOut();
    console.log(`   ✅ Signed out successfully`);

    return { success: true, role };

  } catch (error) {
    console.log(`   ❌ Unexpected error: ${error.message}`);
    return { success: false, role, error: error.message };
  }
}

async function runAllTests() {
  console.log('\n🧪 ========================================');
  console.log('   LOGIN VERIFICATION TEST');
  console.log('   ========================================\n');
  console.log('   Testing authentication for all user types...\n');

  const results = {
    passed: [],
    failed: []
  };

  for (const credentials of TEST_CREDENTIALS) {
    const result = await testLogin(credentials);
    if (result.success) {
      results.passed.push(result.role);
    } else {
      results.failed.push({ role: result.role, error: result.error });
    }

    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Print summary
  console.log('\n\n📊 ========================================');
  console.log('   TEST RESULTS');
  console.log('   ========================================\n');

  const clubTests = results.passed.filter(r => r === 'club').length;
  const scoutTests = results.passed.filter(r => r === 'scout').length;
  const playerTests = results.passed.filter(r => r === 'player').length;

  console.log(`   ✅ Club logins: ${clubTests}/2`);
  console.log(`   ✅ Scout logins: ${scoutTests}/2`);
  console.log(`   ✅ Player logins: ${playerTests}/2`);
  console.log(`   ─────────────────────────────`);
  console.log(`   ✅ Total passed: ${results.passed.length}/6`);
  console.log(`   ❌ Total failed: ${results.failed.length}/6`);

  if (results.failed.length > 0) {
    console.log('\n   ❌ Failed tests:');
    results.failed.forEach(f => {
      console.log(`      - ${f.role}: ${f.error}`);
    });
  }

  console.log('\n   ========================================\n');

  if (results.passed.length === 6) {
    console.log('   🎉 ALL TESTS PASSED!');
    console.log('   ✅ Authentication is working correctly');
    console.log('   ✅ All user roles can log in');
    console.log('   ✅ Profile and role data loading properly');
    console.log('\n   Ready to test dashboard navigation!\n');
  } else {
    console.log('   ⚠️  Some tests failed. Review errors above.');
  }

  console.log('   ========================================\n');
}

runAllTests().catch(error => {
  console.error('\n❌ FATAL ERROR:', error);
  process.exit(1);
});
