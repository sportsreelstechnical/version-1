/**
 * Network Performance Test for Supabase
 * Run this to test API response times
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testNetworkPerformance() {
  console.log('\n🔍 Testing Supabase Network Performance...\n');

  // Test 1: Simple query
  console.time('⏱️  Test 1: Simple profiles query');
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, user_type')
    .limit(1);
  console.timeEnd('⏱️  Test 1: Simple profiles query');

  if (profileError) {
    console.error('❌ Profile query failed:', profileError.message);
  } else {
    console.log('✅ Profile query succeeded');
  }

  // Test 2: Auth session check
  console.time('⏱️  Test 2: Auth session check');
  const { data: session } = await supabase.auth.getSession();
  console.timeEnd('⏱️  Test 2: Auth session check');
  console.log(session.session ? '✅ Session exists' : '⚠️  No active session');

  // Test 3: Multiple queries (simulating login)
  console.time('⏱️  Test 3: Sequential queries (login simulation)');
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('*')
    .limit(5);
  const { data: clubs } = await supabase
    .from('clubs')
    .select('club_name')
    .limit(5);
  console.timeEnd('⏱️  Test 3: Sequential queries (login simulation)');
  console.log('✅ Sequential queries completed');

  console.log('\n📊 Performance Summary:');
  console.log('- Simple queries should be <200ms');
  console.log('- Auth checks should be <100ms');
  console.log('- Sequential queries should be <500ms total');
  console.log('\nIf times are higher, check:');
  console.log('1. Internet connection speed');
  console.log('2. Geographic distance to Supabase server');
  console.log('3. Supabase project health dashboard');
}

testNetworkPerformance();
