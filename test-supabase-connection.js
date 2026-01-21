// Test script untuk cek koneksi Supabase dan realtime
import { supabase } from './src/lib/supabase.ts';

console.log('🧪 Testing Supabase Connection...');

// 1. Test basic connection
try {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('❌ Auth connection failed:', error);
  } else {
    console.log('✅ Auth connection OK');
  }
} catch (err) {
  console.error('❌ Supabase connection error:', err);
}

// 2. Test realtime subscription
console.log('🔌 Testing Realtime Connection...');

const testChannel = supabase.channel('test-connection');

testChannel.subscribe((status) => {
  console.log('📡 Realtime status:', status);

  if (status === 'SUBSCRIBED') {
    console.log('✅ Realtime connected successfully');

    // Test sending a message
    testChannel.send({
      type: 'broadcast',
      event: 'test',
      payload: { message: 'Hello from test' }
    });

  } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
    console.error('❌ Realtime connection failed');
  }
});

// Listen for our test message
testChannel.on('broadcast', { event: 'test' }, ({ payload }) => {
  console.log('📨 Received test message:', payload);
});

// 3. Test database query
try {
  const { data, error } = await supabase
    .from('messages')
    .select('count')
    .limit(1);

  if (error) {
    console.error('❌ Database query failed:', error);
  } else {
    console.log('✅ Database connection OK');
  }
} catch (err) {
  console.error('❌ Database connection error:', err);
}

// Cleanup
setTimeout(() => {
  testChannel.unsubscribe();
  console.log('🧹 Test completed, channel unsubscribed');
}, 10000);