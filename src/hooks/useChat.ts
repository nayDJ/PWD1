import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth, useProfile } from './useSupabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: Date;
}

export const useChat = (itemId: string) => {
  const { data: session } = useAuth();
  const { data: profile } = useProfile(session?.user?.id);
  const [isConnected, setIsConnected] = useState(false);
  const [channel, setChannel] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch messages from database
  const { data: dbMessages = [] } = useQuery({
    queryKey: ['messages', itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('item_id', itemId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender as 'user' | 'admin',
        timestamp: new Date(msg.created_at)
      }));
    },
    enabled: !!itemId
  });

  const [messages, setMessages] = useState<Message[]>(() => dbMessages);

  useEffect(() => {
    if (!itemId) return;

    const chatChannel = supabase.channel(`chat-${itemId}`);

    chatChannel.subscribe((status) => {
      setIsConnected(status === 'SUBSCRIBED');
    });

    chatChannel.on('broadcast', { event: 'message' }, ({ payload }) => {
      setMessages(prev => [...prev, payload]);
    });

    setChannel(chatChannel);

    return () => {
      if (chatChannel) {
        chatChannel.unsubscribe();
      }
    };
  }, [itemId, queryClient]);

  // Mutation to save message to database
  const saveMessageMutation = useMutation({
    mutationFn: async (message: Message) => {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          item_id: itemId,
          sender: message.sender,
          text: message.text
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', itemId] });
    }
  });

  const sendMessage = (text: string) => {
    if (!channel || !session) return;

    const message: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: profile?.role === 'admin' ? 'admin' : 'user',
      timestamp: new Date()
    };

    // Save to database
    saveMessageMutation.mutate(message);

    // Broadcast to real-time
    channel.send({
      type: 'broadcast',
      event: 'message',
      payload: message
    });

    // Optimistically add to local state
    setMessages(prev => [...prev, message]);
  };

  return { messages, sendMessage, isConnected };
};