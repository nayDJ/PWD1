import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

/**
 * DEBUG COMPONENT - Insert this temporarily into your app to debug the issue
 *
 * Usage:
 * 1. Add this component to App.tsx
 * 2. Run the app
 * 3. Click the buttons and watch the console
 * 4. Take screenshots of any errors
 *
 * Example:
 * import DebugPanel from "./DebugPanel";
 *
 * In App.tsx, add:
 * <DebugPanel />
 */

export default function DebugPanel() {
  const [user, setUser] = useState<any>(null);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Get current user on mount
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    setStatus("");
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setStatus("❌ Auth Error: " + error.message);
      } else if (!data.user) {
        setStatus("❌ Not authenticated");
      } else {
        setStatus("✅ Authenticated as: " + data.user.email);
        setUser(data.user);
      }
    } catch (error: any) {
      setStatus("❌ Error: " + error.message);
    }
    setLoading(false);
  };

  const testFetch = async () => {
    setLoading(true);
    setStatus("Fetching all items...");
    try {
      console.log("🔍 Fetching items...");
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .limit(10);

      if (error) {
        console.error("❌ Fetch Error:", error);
        setStatus(
          "❌ Fetch Error: " + (error.message || JSON.stringify(error))
        );
      } else {
        console.log("✅ Fetched items:", data);
        setAllItems(data || []);
        setStatus("✅ Successfully fetched " + (data?.length || 0) + " items");
      }
    } catch (error: any) {
      console.error("❌ Exception:", error);
      setStatus("❌ Exception: " + error.message);
    }
    setLoading(false);
  };

  const testLostFetch = async () => {
    setLoading(true);
    setStatus("Fetching lost items...");
    try {
      console.log("🔍 Fetching lost items...");
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("type", "lost");

      if (error) {
        console.error("❌ Fetch Error:", error);
        setStatus(
          "❌ Fetch Error: " + (error.message || JSON.stringify(error))
        );
      } else {
        console.log("✅ Fetched lost items:", data);
        setAllItems(data || []);
        setStatus(
          "✅ Successfully fetched " + (data?.length || 0) + " lost items"
        );
      }
    } catch (error: any) {
      console.error("❌ Exception:", error);
      setStatus("❌ Exception: " + error.message);
    }
    setLoading(false);
  };

  const testInsert = async () => {
    setLoading(true);
    setStatus("Testing insert...");
    try {
      if (!user) {
        setStatus("❌ Not authenticated");
        setLoading(false);
        return;
      }

      const testItem = {
        title: "Debug Test Item - " + new Date().toLocaleString(),
        description: "This is a test insert from debug panel",
        category: "Testing",
        type: "lost",
        location: "Test Location",
        date: new Date().toISOString().split("T")[0],
        image_url: "",
        contact_name: "Test User",
        contact_phone: "081234567890",
        contact_email: "test@example.com",
        user_id: user.id,
      };

      console.log("🔍 Attempting insert:", testItem);

      const { data, error } = await supabase
        .from("items")
        .insert([testItem])
        .select();

      if (error) {
        console.error("❌ Insert Error:", error);
        setStatus(
          "❌ Insert Error: " +
            (error.message || JSON.stringify(error)) +
            " | Details: " +
            (error.details || "none")
        );
      } else {
        console.log("✅ Insert successful:", data);
        setStatus("✅ Insert successful! Check database.");
      }
    } catch (error: any) {
      console.error("❌ Exception:", error);
      setStatus("❌ Exception: " + error.message);
    }
    setLoading(false);
  };

  const checkRLS = async () => {
    setLoading(true);
    setStatus("Checking RLS policies...");
    try {
      console.log("🔍 Checking RLS...");
      const { error } = await supabase
        .from("items")
        .select("count()", { count: "exact" });

      if (error) {
        console.error("❌ RLS Check Error:", error);
        if (error.message.includes("row level security")) {
          setStatus(
            "❌ RLS BLOCKING: " +
              error.message +
              "\nCheck RLS policies in Supabase"
          );
        } else {
          setStatus("❌ Error: " + error.message);
        }
      } else {
        console.log("✅ RLS working fine");
        setStatus("✅ RLS policies are working");
      }
    } catch (error: any) {
      console.error("❌ Exception:", error);
      setStatus("❌ Exception: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "400px",
        zIndex: 9999,
        fontSize: "12px",
        fontFamily: "monospace",
        maxHeight: "60vh",
        overflow: "auto",
      }}
    >
      <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
        🔍 DEBUG PANEL
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Current User:</strong> {user?.email || "Not authenticated"}
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Status:</strong> {status}
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Items Found:</strong> {allItems.length}
      </div>

      {allItems.length > 0 && (
        <div
          style={{
            marginBottom: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "10px",
            borderRadius: "4px",
            maxHeight: "150px",
            overflow: "auto",
          }}
        >
          <strong>Sample Item:</strong>
          <pre style={{ fontSize: "10px", margin: "5px 0" }}>
            {JSON.stringify(allItems[0], null, 2).substring(0, 200)}...
          </pre>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Button
          size="sm"
          onClick={checkAuth}
          disabled={loading}
          variant="outline"
          style={{ fontSize: "11px" }}
        >
          Check Auth
        </Button>
        <Button
          size="sm"
          onClick={checkRLS}
          disabled={loading}
          variant="outline"
          style={{ fontSize: "11px" }}
        >
          Check RLS
        </Button>
        <Button
          size="sm"
          onClick={testFetch}
          disabled={loading}
          variant="outline"
          style={{ fontSize: "11px" }}
        >
          Fetch All Items
        </Button>
        <Button
          size="sm"
          onClick={testLostFetch}
          disabled={loading}
          variant="outline"
          style={{ fontSize: "11px" }}
        >
          Fetch Lost Items
        </Button>
        <Button
          size="sm"
          onClick={testInsert}
          disabled={loading || !user}
          variant="outline"
          style={{ fontSize: "11px" }}
        >
          Test Insert
        </Button>
      </div>

      <div style={{ marginTop: "10px", fontSize: "10px", opacity: 0.7 }}>
        📌 Check browser console for detailed logs
      </div>
    </div>
  );
}
