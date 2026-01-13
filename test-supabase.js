#!/usr/bin/env node

/**
 * Debug Script: Test Supabase Insert & Fetch
 *
 * Gunakan script ini untuk test apakah data bisa di-insert dan di-fetch
 * dari database tanpa melalui React.
 *
 * CARA PAKAI:
 * npx node test-supabase.js
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ojhbvfzmqgenxwnszlrd.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qaGJ2ZnptcWdlbnh3bnN6bHJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMjg0MDksImV4cCI6MjA4MTkwNDQwOX0.iEiEyWQH_JMBDDdBsYB05yQmaXdKlW8lPUQxEpeXI9M";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log("🔍 Testing Supabase Connection...\n");

  try {
    // 1. Test auth
    console.log("1️⃣ Testing Authentication...");
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("❌ Auth Error:", authError);
      console.log("   Please login first in the app, then try again.\n");
      return;
    }

    if (!userData.user) {
      console.error("❌ Not authenticated");
      console.log("   Please login first in the app, then try again.\n");
      return;
    }

    console.log("✅ Authenticated as:", userData.user.email);
    console.log("   User ID:", userData.user.id, "\n");

    const userId = userData.user.id;

    // 2. Test fetch items
    console.log("2️⃣ Fetching all items...");
    const { data: items, error: fetchError } = await supabase
      .from("items")
      .select("*")
      .eq("user_id", userId);

    if (fetchError) {
      console.error("❌ Fetch Error:", fetchError);
      return;
    }

    console.log("✅ Found", items.length, "items for this user");
    if (items.length > 0) {
      console.log("   Latest item:", items[0].title || items[0].name);
    }
    console.log();

    // 3. Test insert
    console.log("3️⃣ Testing Insert Operation...");
    const testItem = {
      title: "Test Item - " + new Date().toISOString(),
      description: "This is a test item created at " + new Date(),
      category: "Testing",
      type: "lost",
      location: "Test Location",
      date: new Date().toISOString().split("T")[0],
      image_url: "",
      contact_name: "Test User",
      contact_phone: "081234567890",
      contact_email: "test@example.com",
      user_id: userId,
    };

    console.log("   Attempting to insert:", testItem.title);

    const { data: insertedData, error: insertError } = await supabase
      .from("items")
      .insert([testItem])
      .select();

    if (insertError) {
      console.error("❌ Insert Error:", insertError);
      console.log("   Details:", insertError.details);
      console.log("   Message:", insertError.message);
      console.log("   Hint:", insertError.hint);
      console.log("\n   This error usually means:");
      if (insertError.message.includes("row level security")) {
        console.log("   • RLS Policy is blocking the insert");
        console.log(
          "   • Check Supabase Dashboard > Authentication > Policies"
        );
      }
      if (insertError.message.includes("column")) {
        console.log("   • Database column doesn't exist or has wrong name");
        console.log("   • Check Supabase Dashboard > SQL Editor > items table");
      }
      return;
    }

    console.log("✅ Insert successful!");
    console.log("   New item ID:", insertedData[0].id);
    console.log();

    // 4. Verify it's there
    console.log("4️⃣ Verifying item was saved...");
    const { data: verifyItems, error: verifyError } = await supabase
      .from("items")
      .select("*")
      .eq("id", insertedData[0].id);

    if (verifyError) {
      console.error("❌ Verify Error:", verifyError);
      return;
    }

    if (verifyItems.length === 0) {
      console.error("❌ Item was not found after insert!");
      return;
    }

    console.log("✅ Item verified in database!");
    console.log("   Title:", verifyItems[0].title);
    console.log("   Created at:", verifyItems[0].created_at);
    console.log();

    // 5. Test fetch with type filter
    console.log("5️⃣ Testing fetch with type='lost'...");
    const { data: lostItems, error: lostError } = await supabase
      .from("items")
      .select("*")
      .eq("type", "lost");

    if (lostError) {
      console.error("❌ Lost Items Fetch Error:", lostError);
      return;
    }

    console.log("✅ Found", lostItems.length, "lost items total");
    console.log();

    // 6. Summary
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ ALL TESTS PASSED!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\nYour database and RLS policies are working correctly.\n");
    console.log("If items still don't show in the web interface:");
    console.log("1. Check browser console (F12) for error messages");
    console.log("2. Check React Query cache invalidation");
    console.log("3. Try hard refresh (Ctrl+F5) in browser");
    console.log("4. Check that useItems hook is being called\n");
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
  }
}

testSupabase();
