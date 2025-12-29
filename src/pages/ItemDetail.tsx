import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  Phone,
  Share2,
  MessageCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useItem, useUpdateItem } from "@/hooks/useSupabase";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  // Fetch from Supabase database
  const { data: dbItem, isLoading } = useItem(id || "");
  const { mutate: updateItem } = useUpdateItem();

  const item = dbItem
    ? {
        id: dbItem.id,
        name: dbItem.title,
        description: dbItem.description,
        type: dbItem.type,
        category: dbItem.category || "Lainnya",
        location: dbItem.location,
        date: dbItem.created_at,
        contact: dbItem.contact_phone,
        image:
          dbItem.image_url ||
          "https://via.placeholder.com/400x300?text=No+Image",
      }
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent">
        <Navbar />
        <main className="pt-24 pb-16 md:pt-28 md:pb-24">
          <div className="container mx-auto px-4 flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-transparent">
        <Navbar />
        <main className="pt-24 pb-16 md:pt-28 md:pb-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Barang tidak ditemukan
            </h1>
            <p className="text-muted-foreground mb-6">
              Maaf, barang yang Anda cari tidak tersedia.
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleContact = () => {
    const message = encodeURIComponent(
      `Halo, saya tertarik dengan laporan "${item.name}" di Lost&Found. Apakah masih tersedia?`,
    );
    window.open(
      `https://wa.me/${item.contact.replace(/^0/, "62")}?text=${message}`,
      "_blank",
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: item.description,
          url: window.location.href,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link disalin!",
        description: "Link telah disalin ke clipboard",
      });
    }
  };

  const handleChangeStatus = async () => {
    if (!dbItem) {
      toast({
        title: "Tidak dapat mengubah status",
        description: "Hanya barang dari database yang dapat diubah statusnya",
        variant: "destructive",
      });
      return;
    }

    setIsChangingStatus(true);
    const newType = item.type === "lost" ? "found" : "lost";

    try {
      await updateItem(
        { id: String(dbItem.id), updates: { type: newType } },
        {
          onSuccess: () => {
            toast({
              title: "Status diperbarui!",
              description: `Barang telah diubah menjadi "${newType === "lost" ? "Hilang" : "Ditemukan"}"`,
            });
            setIsChangingStatus(false);
            navigate(newType === "lost" ? "/lost" : "/found");
          },
          onError: (error) => {
            toast({
              title: "Gagal mengubah status",
              description:
                error instanceof Error ? error.message : "Terjadi kesalahan",
              variant: "destructive",
            });
            setIsChangingStatus(false);
          },
        },
      );
    } catch (error) {
      toast({
        title: "Gagal mengubah status",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
      setIsChangingStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      <main className="pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            to={item.type === "lost" ? "/lost" : "/found"}
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke daftar
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="animate-fade-in">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    variant={item.type === "lost" ? "destructive" : "default"}
                    className={`${
                      item.type === "lost"
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-primary text-primary-foreground"
                    } text-sm px-3 py-1`}
                  >
                    {item.type === "lost" ? "Hilang" : "Ditemukan"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="animate-slide-in-right">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {item.name}
              </h1>

              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Tag className="w-5 h-5 text-primary" />
                  <span>{item.category}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{formatDate(item.date)}</span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  Deskripsi
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Contact Section */}
              <div className="bg-card/50 backdrop-blur-lg rounded-2xl border border-border p-6 mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Informasi Kontak
                </h2>
                <div className="flex items-center gap-3 text-muted-foreground mb-4">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>{item.contact}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={handleContact}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Hubungi via WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    className="text-foreground hover:text-primary"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                    Bagikan
                  </Button>
                </div>
              </div>

              {/* Status Change Section - Only show for DB items */}
              {dbItem && (
                <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 mb-6">
                  <h2 className="text-lg font-semibold text-foreground mb-3">
                    Perbarui Status
                  </h2>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {item.type === "lost"
                      ? "Apakah barang ini sudah ditemukan?"
                      : "Apakah barang ini belum diklaim?"}
                  </p>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={handleChangeStatus}
                    disabled={isChangingStatus}
                  >
                    {isChangingStatus ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Mengubah status...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Ubah menjadi{" "}
                        {item.type === "lost" ? "Ditemukan" : "Hilang"}
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Tips */}
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                <h3 className="font-semibold text-foreground mb-2">
                  Tips Keamanan
                </h3>
                <ul className="text-sm text-foreground space-y-1">
                  <li>
                    • Selalu verifikasi identitas pemilik sebelum menyerahkan
                    barang
                  </li>
                  <li>
                    • Minta bukti kepemilikan seperti foto atau nota pembelian
                  </li>
                  <li>• Bertemu di tempat umum yang aman</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ItemDetail;
