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
      console.log("Sending data to Supabase:", newItem);

      const { data, error } = await supabase
        .from("items")
        .insert([newItem])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
      }

      console.log("Data saved:", data);
      return data;
    },
    onSuccess: () => {
      console.log("Mutation success, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["items"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};
