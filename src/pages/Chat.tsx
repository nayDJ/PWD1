import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useSupabase';
import { Chat } from '@/components/Chat';

interface ActiveChat {
  itemId: string;
  itemTitle: string;
  lastActivity: number;
}

const ChatPage = () => {
  const { data: session } = useAuth();
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<ActiveChat | null>(null);

  useEffect(() => {
    // Load active chats from localStorage
    const stored = localStorage.getItem('activeChats');
    if (stored) {
      try {
        const chats: ActiveChat[] = JSON.parse(stored);
        // Sort by last activity, most recent first
        chats.sort((a, b) => b.lastActivity - a.lastActivity);
        setActiveChats(chats);
      } catch (error) {
        console.error('Error parsing active chats:', error);
      }
    }
  }, []);

  const handleChatClick = (chat: ActiveChat) => {
    setSelectedChat(chat);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-transparent">
        <Navbar />
        <main className="pt-24 pb-16 md:pt-28 md:pb-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Akses Ditolak
            </h1>
            <p className="text-muted-foreground mb-6">
              Anda harus login untuk mengakses halaman chat.
            </p>
            <Link to="/login">
              <Button>Masuk</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      <main className="pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
              to="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Chat dengan Admin
              </h1>
              <p className="text-muted-foreground">
                Kelola percakapan Anda tentang barang hilang atau ditemukan
              </p>
            </div>

            {/* Content */}
            {activeChats.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Belum ada percakapan
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Mulai chat dengan admin dari halaman detail barang yang Anda minati.
                  </p>
                  <Link to="/lost">
                    <Button>Cari Barang Hilang</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Percakapan Aktif</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeChats.map((chat) => (
                      <div
                        key={chat.itemId}
                        className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleChatClick(chat)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-foreground">{chat.itemTitle}</h4>
                            <p className="text-sm text-muted-foreground">
                              Terakhir aktif: {new Date(chat.lastActivity).toLocaleString('id-ID')}
                            </p>
                          </div>
                          <Badge variant="secondary">Chat</Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Cara Menggunakan Chat:</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Klik tombol "Chat dengan Admin" di detail barang</li>
                          <li>• Pesan dikirim secara real-time</li>
                          <li>• Admin akan merespons segera mungkin</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Catatan:</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Percakapan bersifat sementara</li>
                          <li>• Riwayat hilang saat browser ditutup</li>
                          <li>• Pastikan koneksi internet stabil</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Chat Modal */}
      {selectedChat && (
        <Chat
          itemId={selectedChat.itemId}
          itemTitle={selectedChat.itemTitle}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
};

export default ChatPage;