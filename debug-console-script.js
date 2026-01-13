/**
 * ACTUAL DEBUGGING - Run this to see EXACT errors
 *
 * Cara pakai:
 * 1. Buka browser di aplikasi
 * 2. Login
 * 3. Buka DevTools (F12)
 * 4. Pergi ke Console tab
 * 5. Copy paste script ini
 * 6. Tekan Enter
 * 7. Catat semua output
 *
 * Atau:
 * Buat file .js dengan isi ini, lalu copy ke browser console
 */

console.log("🔍 DEBUGGING: Data Tidak Muncul Issue\n");
console.log("================================\n");

// 1. Check localStorage untuk session
console.log("1️⃣ Checking Session in LocalStorage...");
const authToken = localStorage.getItem("sb-ojhbvfzmqgenxwnszlrd-auth-token");
if (authToken) {
  try {
    const parsed = JSON.parse(authToken);
    console.log("✅ Session found");
    console.log("   User ID:", parsed.user?.id);
    console.log("   Email:", parsed.user?.email);
    console.log("   Expires at:", new Date(parsed.expires_at * 1000));
  } catch (e) {
    console.error("❌ Error parsing session:", e);
  }
} else {
  console.error("❌ No session found. User might not be logged in.");
}
console.log();

// 2. Check React Query cache
console.log("2️⃣ Checking React Query Cache...");
const queryClientStr = localStorage.getItem("REACT_QUERY_OFFLINE_CACHE");
if (queryClientStr) {
  console.log("✅ React Query cache exists");
  try {
    const cache = JSON.parse(queryClientStr);
    console.log("   Keys in cache:", Object.keys(cache));
  } catch (e) {
    console.error("❌ Error parsing cache:", e);
  }
} else {
  console.log("ℹ️ React Query cache not found (might be normal)");
}
console.log();

// 3. Test Supabase connection (if window.supabase exists)
console.log("3️⃣ Testing Supabase Connection...");
if (window.__supabaseClient) {
  console.log("✅ Supabase client available");
  // Try to get current user
  window.__supabaseClient.auth.getUser().then((result) => {
    if (result.error) {
      console.error("❌ Auth error:", result.error.message);
    } else if (!result.data.user) {
      console.error("❌ Not authenticated");
    } else {
      console.log("✅ Authenticated as:", result.data.user.email);
      console.log("   User ID:", result.data.user.id);

      // Try to fetch items
      console.log("\n4️⃣ Attempting to fetch items from database...");
      window.__supabaseClient
        .from("items")
        .select("*")
        .limit(5)
        .then((result) => {
          if (result.error) {
            console.error("❌ Fetch error:", result.error);
            console.log("   This error might help:");
            if (result.error.message.includes("row level security")) {
              console.log("   ▪️ RLS policy is blocking the select");
            }
            if (result.error.message.includes("does not exist")) {
              console.log("   ▪️ Table doesn't exist");
            }
          } else {
            console.log("✅ Successfully fetched items");
            console.log("   Found:", result.data.length, "items");
            if (result.data.length > 0) {
              console.log("   First item:", result.data[0].title);
              console.log("   First item user_id:", result.data[0].user_id);
              console.log("   Your user ID:", result.data.user?.id);
              if (result.data[0].user_id === result.data.user?.id) {
                console.log("   ✅ Your items match your user ID");
              } else {
                console.log("   ℹ️ Item belongs to different user");
              }
            }
          }
        });
    }
  });
} else {
  console.log("ℹ️ Supabase client not available in window scope");
  console.log(
    "   Try to submit a form first, or check if app initialized correctly"
  );
}
console.log();

console.log("================================");
console.log("Debugging output complete.");
console.log("Check the output above for any ❌ errors.\n");
console.log("Next steps:");
console.log("1. Check browser Console for the ❌ errors above");
console.log("2. Go to Supabase Dashboard > SQL Editor");
console.log("3. Run: SELECT * FROM items LIMIT 10;");
console.log("4. Check if data actually exists in database");
