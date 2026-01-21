import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Fetch semua items (lost/found)
export const useItems = (type: "lost" | "found") => {
  return useQuery({
    queryKey: ["items", type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("type", type)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Fetch single item
export const useItem = (id: string) => {
  return useQuery({
    queryKey: ["item", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });
};

// Add new item
export const useAddItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItem: any) => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) {
          console.error("Auth error:", userError);
          throw new Error("Gagal mengambil user authentication");
        }
        if (!user)
          throw new Error(
            "User tidak terautentikasi. Silakan login terlebih dahulu."
          );

        const itemWithUser = { ...newItem, user_id: user.id };
        console.log("Submitting item:", itemWithUser);

        const { data, error } = await supabase
          .from("items")
          .insert([itemWithUser])
          .select();

        if (error) {
          console.error("Supabase insertion error:", error);
          console.error("Error details:", error.details, error.hint);
          throw new Error(error.message || "Gagal menyimpan laporan barang");
        }

        console.log("Item successfully inserted:", data);
        return data;
      } catch (error) {
        console.error("Complete error in mutationFn:", error);
        throw error;
      }
    },
    retry: false,
    onSuccess: () => {
      console.log("Mutation successful, invalidating queries");
      // Invalidate both lost and found item lists
      queryClient.invalidateQueries({ queryKey: ["items", "lost"] });
      queryClient.invalidateQueries({ queryKey: ["items", "found"] });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};

// Update item
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from("items")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      return data;
    },
    retry: 1,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", "lost"] });
      queryClient.invalidateQueries({ queryKey: ["items", "found"] });
      queryClient.invalidateQueries({ queryKey: ["item"] });
    },
  });
};

// Delete item
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("items").delete().eq("id", id);

      if (error) throw error;
    },
    retry: 1,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", "lost"] });
      queryClient.invalidateQueries({ queryKey: ["items", "found"] });
      queryClient.invalidateQueries({ queryKey: ["item"] });
    },
  });
};

// Auth hooks

export const useAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error);
          throw error;
        }
        return session;
      } catch (error) {
        console.error("Auth query error:", error);
        throw error;
      }
    },
    staleTime: 0, // No cache - always check current session
    gcTime: 0, // Don't cache in garbage collector
  });
};

export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useProfiles = () => {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      return data;
    },
    retry: 1,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    },
    retry: 1,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fullName,
      email,
      password,
    }: {
      fullName: string;
      email: string;
      password: string;
    }) => {
      // First, sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Create profile
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email,
            full_name: fullName,
          },
        ]);
        if (profileError) throw profileError;
      }

      // After successful sign up, immediately sign in with the same credentials
      // This ensures the user can login right away without waiting for email confirmation
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // If auto sign-in fails, don't throw error as signup was successful
        console.warn("Auto sign-in after registration failed:", signInError);
      }

      return data;
    },
    retry: 1,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.clear();
    },
  });
};

// Fetch active chats for admin (items with messages)
export const useActiveChats = () => {
  return useQuery({
    queryKey: ["activeChats"],
    queryFn: async () => {
      try {
        // Get distinct item_ids with latest message
        const { data: messages, error: msgError } = await supabase
          .from('messages')
          .select('item_id, text, sender, created_at')
          .order('created_at', { ascending: false });

        if (msgError) throw msgError;

        // Get unique item_ids
        const itemIds = [...new Set(messages?.map(m => m.item_id) || [])];

        // Get item details
        const { data: items, error: itemError } = await supabase
          .from('items')
          .select('id, title, type, image_url, contact_phone')
          .in('id', itemIds);

        if (itemError) throw itemError;

        // Create item map
        const itemMap = new Map(items?.map(item => [item.id, item]) || []);

        // Group messages by item_id
        const chatMap = new Map();
        messages?.forEach(msg => {
          if (!chatMap.has(msg.item_id)) {
            const item = itemMap.get(msg.item_id);
            if (item) { // Only include if item exists
              chatMap.set(msg.item_id, {
                itemId: msg.item_id,
                itemTitle: item.title || 'Unknown Item',
                itemType: item.type || 'unknown',
                itemImage: item.image_url,
                itemContact: item.contact_phone,
                latestMessage: msg.text,
                latestSender: msg.sender,
                latestTime: new Date(msg.created_at),
                messageCount: 1
              });
            }
          } else {
            chatMap.get(msg.item_id).messageCount += 1;
          }
        });

        return Array.from(chatMap.values()).sort((a, b) =>
          b.latestTime.getTime() - a.latestTime.getTime()
        );
      } catch (error) {
        console.error('Error in useActiveChats:', error);
        throw error;
      }
    },
  });
};
