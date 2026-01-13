import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Package, Trash2, Eye, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useItems, useDeleteItem, useAuth, useProfile, useProfiles, useUpdateProfile, useActiveChats } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { Chat } from "@/components/Chat";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AdminDashboard = () => {
  const { data: session } = useAuth();
  const { data: profile } = useProfile(session?.user?.id);
  const { toast } = useToast();
  const { mutate: deleteItem } = useDeleteItem();
   const { data: profiles } = useProfiles();
   const { mutate: updateProfile } = useUpdateProfile();
   const { data: activeChats } = useActiveChats();
   const [activeTab, setActiveTab] = useState("overview");
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
   const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);
   const [selectedChat, setSelectedChat] = useState<{ itemId: string; itemTitle: string } | null>(null);

  // Get all items for stats
  const { data: lostItems } = useItems("lost");
  const { data: foundItems } = useItems("found");

  if (!session || profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-transparent">
        <Navbar />
        <main className="pt-24 pb-16 md:pt-28 md:pb-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Akses Ditolak
            </h1>
            <p className="text-muted-foreground mb-6">
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalItems = (lostItems?.length || 0) + (foundItems?.length || 0);

  const handleDelete = (id: string, title: string) => {
    setItemToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      deleteItem(itemToDelete.id);
      toast({
        title: "Item berhasil dihapus",
        description: "Item telah dihapus dari database.",
      });
    } catch (error) {
      toast({
        title: "Gagal menghapus item",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const ItemRow = ({ item }: { item: any }) => (
    <tr className="border-b border-border">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.title}
              className="w-10 h-10 rounded-lg object-cover"
            />
          )}
          <div>
            <p className="font-medium text-foreground">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.category}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground">
        {new Date(item.created_at).toLocaleDateString('id-ID')}
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-2">
          <Link to={`/item/${item.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(item.id, item.title)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      <main className="pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
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
                Dashboard Admin
              </h1>
              <p className="text-muted-foreground">
                Kelola laporan barang hilang dan ditemukan, serta pengguna aplikasi.
              </p>
            </div>

            {/* Dashboard Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                 <TabsTrigger value="overview" className="text-white">Ringkasan</TabsTrigger>
                 <TabsTrigger value="items" className="text-white">Kelola Item</TabsTrigger>
                 <TabsTrigger value="chat" className="text-white">Chat Aktif</TabsTrigger>
                 <TabsTrigger value="users" className="text-white">Kelola Pengguna</TabsTrigger>
               </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Item</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalItems}</div>
                      <p className="text-xs text-muted-foreground">
                        Barang hilang dan ditemukan
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Barang Hilang</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{lostItems?.length || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        Laporan barang hilang
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Barang Ditemukan</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{foundItems?.length || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        Laporan barang ditemukan
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="items" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Kelola Semua Item</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="lost" className="w-full">
                      <TabsList>
                        <TabsTrigger value="lost">Barang Hilang</TabsTrigger>
                        <TabsTrigger value="found">Barang Ditemukan</TabsTrigger>
                      </TabsList>
                      <TabsContent value="lost">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 font-medium">Item</th>
                                <th className="text-left py-3 px-4 font-medium">Tanggal</th>
                                <th className="text-left py-3 px-4 font-medium">Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lostItems?.map((item) => (
                                <ItemRow key={item.id} item={item} />
                              )) || (
                                <tr>
                                  <td colSpan={3} className="text-center py-8 text-muted-foreground">
                                    Tidak ada data barang hilang
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>
                      <TabsContent value="found">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 font-medium">Item</th>
                                <th className="text-left py-3 px-4 font-medium">Tanggal</th>
                                <th className="text-left py-3 px-4 font-medium">Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {foundItems?.map((item) => (
                                <ItemRow key={item.id} item={item} />
                              )) || (
                                <tr>
                                  <td colSpan={3} className="text-center py-8 text-muted-foreground">
                                    Tidak ada data barang ditemukan
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
               </TabsContent>

                <TabsContent value="chat" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Kelola Chat Aktif</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {activeChats && activeChats.length > 0 ? (
                        <div className="space-y-4">
                          {activeChats.map((chat) => (
                            <div
                              key={chat.itemId}
                              className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => setSelectedChat({ itemId: chat.itemId, itemTitle: chat.itemTitle })}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                  {chat.itemImage && (
                                    <img
                                      src={chat.itemImage}
                                      alt={chat.itemTitle}
                                      className="w-10 h-10 rounded-lg object-cover"
                                    />
                                  )}
                                  <div>
                                    <h4 className="font-medium text-foreground">{chat.itemTitle}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {chat.latestSender === 'user' ? 'User' : 'Admin'}: {chat.latestMessage}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {chat.latestTime.toLocaleString('id-ID')}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className={`px-2 py-1 text-xs rounded ${chat.itemType === 'lost' ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'}`}>
                                    {chat.itemType === 'lost' ? 'Hilang' : 'Ditemukan'}
                                  </span>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {chat.messageCount} pesan
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Belum ada chat aktif</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-6">
                 <Card>
                   <CardHeader>
                     <CardTitle>Kelola Pengguna</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="overflow-x-auto">
                       <table className="w-full">
                         <thead>
                           <tr className="border-b border-border">
                             <th className="text-left py-3 px-4 font-medium">Nama</th>
                             <th className="text-left py-3 px-4 font-medium">Email</th>
                             <th className="text-left py-3 px-4 font-medium">Role</th>
                             <th className="text-left py-3 px-4 font-medium">Bergabung</th>
                           </tr>
                         </thead>
                         <tbody>
                           {profiles?.map((user) => (
                             <tr key={user.id} className="border-b border-border">
                               <td className="py-3 px-4">{user.full_name || "N/A"}</td>
                               <td className="py-3 px-4">{user.email || "N/A"}</td>
                               <td className="py-3 px-4">
                                 <select
                                   value={user.role || "user"}
                                   onChange={(e) => updateProfile({ id: user.id, updates: { role: e.target.value } })}
                                   className="border border-border rounded px-2 py-1 text-sm"
                                 >
                                   <option value="user">User</option>
                                   <option value="admin">Admin</option>
                                 </select>
                               </td>
                               <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString("id-ID")}</td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                       {(!profiles || profiles.length === 0) && (
                         <div className="text-center py-8 text-muted-foreground">
                           <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                           <p>Tidak ada pengguna</p>
                         </div>
                       )}
                     </div>
                   </CardContent>
                 </Card>
               </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Item</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus item "{itemToDelete?.title}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Modal */}
      {selectedChat && (
        <Chat
          itemId={selectedChat.itemId}
          itemTitle={selectedChat.itemTitle}
          onClose={() => setSelectedChat(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;