// Test koneksi Supabase di browser console
// Jalankan di browser console setelah aplikasi load

console.log('🧪 Testing Supabase Connection...');

// Import supabase client
import('./src/lib/supabase.ts').then(({ supabase }) => {
  console.log('📡 Supabase client loaded');

  // 1. Test basic connection
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('❌ Auth connection failed:', error);
    } else {
      console.log('✅ Auth connection OK, session:', data.session);
    }
  });

  // 2. Test realtime
  const testChannel = supabase.channel('test-connection-' + Date.now());

  testChannel.subscribe((status) => {
    console.log('📡 Realtime status:', status);

    if (status === 'SUBSCRIBED') {
      console.log('✅ Realtime connected successfully');
    } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
      console.error('❌ Realtime connection failed');
    }
  });

  // 3. Test database
  supabase.from('messages').select('count', { count: 'exact', head: true }).then(({ count, error }) => {
    if (error) {
      console.error('❌ Database query failed:', error);
    } else {
      console.log('✅ Database connection OK, messages count:', count);
    }
  });

  // Cleanup after 10 seconds
  setTimeout(() => {
    testChannel.unsubscribe();
    console.log('🧹 Test completed');
  }, 10000);

}).catch(err => {
  console.error('❌ Failed to load supabase client:', err);
});