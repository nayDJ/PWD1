import { X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatProps {
  itemId: string;
  itemTitle: string;
  onClose: () => void;
}

export const Chat = ({ itemId, itemTitle, onClose }: ChatProps) => {
  const handleWhatsApp = () => {
    const adminNumber = '6285828237071'; // Admin WhatsApp number
    const message = encodeURIComponent(
      `Halo Admin, saya ingin chat tentang item: "${itemTitle}" (ID: ${itemId})`
    );
    window.open(`https://wa.me/${adminNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-auto bg-card border border-border rounded-lg shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex justify-between items-center bg-primary/5">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold text-foreground text-sm">Chat dengan Admin</h3>
            <p className="text-xs text-muted-foreground truncate">{itemTitle}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-center mb-4">
          <p className="text-muted-foreground text-sm">
            Untuk chat dengan admin, silakan klik tombol di bawah ini untuk diarahkan ke WhatsApp.
          </p>
        </div>
        <Button
          onClick={handleWhatsApp}
          className="w-full"
          variant="default"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat via WhatsApp
        </Button>
      </div>
    </div>
  );
};