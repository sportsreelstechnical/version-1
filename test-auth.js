/**
 * Authentication Testing Script
 *
 * This script tests all authentication functionality with the test user accounts.
 * Run with: node test-auth.js
 *
 * Requirements: Node.js and @supabase/supabase-js installed
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test credentials
const TEST_USERS = {
  club1: {
    email: 'admin@manchesterunited.com',
    password: 'ClubAdmin2024!',
    expectedRole: 'club',
    name: 'Manchester United FC'
  },
  club2: {
    email: 'admin@realmadrid.com',
    password: 'RealMadrid2024!',
    expectedRole: 'club',
    name: 'Real Madrid CF'
  },
  scout1: {
    email: 'john.thompson@scout.com',
    password: 'Scout2024!',
    expectedRole: 'scout',
    name: 'John Thompson'
  },
  scout2: {
    email: 'maria.garcia@scout.com',
    password: 'ScoutMaria2024!',
    expectedRole: 'scout',
    name: 'Maria Garcia'
  },
  player1: {
    email: 'david.wilson@player.com',
    password: 'Player2024!',
    expectedRole: 'player',
    name: 'David Wilson'
  },
  player2: {
    email: 'carlos.rodriguez@player.com',
    password: 'CarlosPlayer2024!',
    expectedRole: 'player',
    name: 'Carlos Rodriguez'
  }
};

/**
 * Test user authentication
 */
async function testLogin(email, password, expectedRole, name) {
  console.log(`\n🔐 Testing login for: ${name} (${email})`);

  try {
    // Attempt login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error(`   ❌ Login failed: ${authError.message}`);
      return false;
    }

    if (!authData.user) {
      console.error(`   ❌ Login failed: No user data returned`);
      return false;
    }

    console.log(`   ✅ Authentication successful`);
    console.log(`   📧 User ID: ${authData.user.id}`);
    console.log(`   📧 Email: ${authData.user.email}`);

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error(`   ❌ Profile fetch failed: ${profileError.message}`);
      return false;
    }

    if (profile.user_type !== expectedRole) {
      console.error(`   ❌ Role mismatch: Expected ${expectedRole}, got ${profile.user_type}`);
      return false;
    }

    console.log(`   ✅ Profile loaded: ${profile.user_type} role`);
    console.log(`   📊 Status: ${profile.status}`);

    // Get role-specific data
    await testRoleSpecificData(authData.user.id, profile.user_type);

    // Sign out
    await supabase.auth.signOut();
    console.log(`   ✅ Sign out successful`);

    return true;
  } catch (error) {
    console.error(`   ❌ Unexpected error: ${error.message}`);
    return false;
  }
}

/**
 * Test role-specific data access
 */
async function testRoleSpecificData(userId, userType) {
  try {
    if (userType === 'club') {
      const { data, error } = await supabase
        .from('clubs')
        .select('club_name, country, league')
        .eq('profile_id', userId)
        .single();

      if (error) {
        console.error(`   ❌ Club data fetch failed: ${error.message}`);
        return;
      }

      console.log(`   ✅ Club data: ${data.club_name} (${data.country} - ${data.league})`);
    }

    if (userType === 'scout') {
      const { data, error } = await supabase
        .from('scouts')
        .select('first_name, last_name, fifa_licence_number, country')
        .eq('profile_id', userId)
        .single();

      if (error) {
        console.error(`   ❌ Scout data fetch failed: ${error.message}`);
        return;
      }

      console.log(`   ✅ Scout data: ${data.first_name} ${data.last_name} (${data.country})`);
      console.log(`   📜 License: ${data.fifa_licence_number}`);
    }

    if (userType === 'player') {
      const { data, error } = await supabase
        .from('players')
        .select('first_name, last_name, position, nationality')
        .eq('profile_id', userId)
        .single();

      if (error) {
        console.error(`   ❌ Player data fetch failed: ${error.message}`);
        return;
      }

      console.log(`   ✅ Player data: ${data.first_name} ${data.last_name} (${data.position})`);
      console.log(`   🌍 Nationality: ${data.nationality}`);
    }
  } catch (error) {
    console.error(`   ❌ Role-specific data error: ${error.message}`);
  }
}

/**
 * Test invalid login
 */
async function testInvalidLogin() {
  console.log(`\n🔐 Testing invalid credentials`);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'invalid@example.com',
    password: 'wrongpassword',
  });

  if (error) {
    console.log(`   ✅ Invalid login correctly rejected: ${error.message}`);
    return true;
  } else {
    console.error(`   ❌ Invalid login was incorrectly accepted`);
    return false;
  }
}

/**
 * Test database connectivity
 */
async function testDatabaseConnection() {
  console.log(`\n📊 Testing database connectivity`);

  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error(`   ❌ Database connection failed: ${error.message}`);
      return false;
    }

    console.log(`   ✅ Database connected successfully`);
    console.log(`   📈 Total profiles: ${count}`);
    return true;
  } catch (error) {
    console.error(`   ❌ Database connection error: ${error.message}`);
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🧪 AUTHENTICATION SYSTEM TEST SUITE');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`📅 Date: ${new Date().toLocaleString()}`);
  console.log(`🌐 Supabase URL: ${supabaseUrl}`);

  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };

  // Test database connectivity
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.error('\n❌ Database connection failed. Aborting tests.');
    process.exit(1);
  }

  // Test invalid login
  results.total++;
  if (await testInvalidLogin()) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test all user logins
  for (const [key, user] of Object.entries(TEST_USERS)) {
    results.total++;
    if (await testLogin(user.email, user.password, user.expectedRole, user.name)) {
      results.passed++;
    } else {
      results.failed++;
    }
  }

  // Print summary
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`✅ Passed: ${results.passed}/${results.total}`);
  console.log(`❌ Failed: ${results.failed}/${results.total}`);

  if (results.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✅ Authentication system is working correctly');
    process.exit(0);
  } else {
    console.log('\n⚠️  SOME TESTS FAILED');
    console.log('❌ Please review the errors above');
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('\n❌ Test suite error:', error);
  process.exit(1);
});
