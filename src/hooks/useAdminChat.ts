// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Message {
  id: string;
  item_id: string;
  text: string;
  sender: 'user' | 'admin';
  receiver_id?: string;
  timestamp: Date;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useAdminChat = () => {
  // Simplified hook - no longer supports real-time messaging
  const messages: Message[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sendMessage = async (_itemId: string, _text: string) => {
    // No-op - messaging removed
  };
  const isConnected = false;
  const isAdmin = false;

  return { messages, sendMessage, isConnected, isAdmin };
};