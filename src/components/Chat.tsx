import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useChat } from '@/hooks/useChat';

interface ChatProps {
  itemId: string;
  itemTitle: string;
  onClose: () => void;
}

export const Chat = ({ itemId, itemTitle, onClose }: ChatProps) => {
  const { messages, sendMessage, isConnected } = useChat(itemId);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && isConnected) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-card border border-border rounded-lg shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex justify-between items-center bg-primary/5">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold text-foreground text-sm">Chat dengan Admin</h3>
            <p className="text-xs text-muted-foreground truncate">{itemTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
            {isConnected ? "Online" : "Offline"}
          </Badge>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              Belum ada pesan. Mulai percakapan dengan admin.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg text-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p>{msg.text}</p>
                   <p className="text-xs opacity-70 mt-1">
                     {msg.timestamp instanceof Date ? msg.timestamp.toLocaleTimeString('id-ID', {
                       hour: '2-digit',
                       minute: '2-digit'
                     }) : 'N/A'}
                   </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isConnected ? "Ketik pesan..." : "Koneksi offline..."}
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || !isConnected}
            size="sm"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};