import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  ArrowRight,
  Shield,
  Users,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ItemCard from "@/components/ItemCard";
import { useItems } from "@/hooks/useSupabase";

const Index = () => {
  // Fetch recent items from database
  const { data: lostItems = [], isLoading: lostLoading } = useItems("lost");
  const { data: foundItems = [], isLoading: foundLoading } = useItems("found");

  // Get 3 most recent items from both categories
  const recentItems = useMemo(() => {
    const combined = [...lostItems, ...foundItems].map((item: any) => ({
      id: item.id,
      name: item.title,
      title: item.title,
      description: item.description,
      type: item.type,
      category: item.category || "Lainnya",
      location: item.location,
      date: item.created_at,
      contact: item.contact_phone,
      image: item.image_url,
      image_url: item.image_url,
    }));

    // Sort by created_at descending and get first 3
    return combined
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 3);
  }, [lostItems, foundItems]);

  const stats = [
    { icon: CheckCircle, value: "1,234", label: "Barang Dikembalikan" },
    { icon: Users, value: "5,678", label: "Pengguna Aktif" },
    { icon: Clock, value: "24/7", label: "Layanan Online" },
  ];

  const features = [
    {
      icon: Search,
      title: "Pencarian Mudah",
      description:
        "Cari barang hilang Anda dengan filter kategori, lokasi, dan tanggal yang lengkap.",
    },
    {
      icon: Shield,
      title: "Aman & Terpercaya",
      description:
        "Data Anda terlindungi dan proses klaim dilakukan dengan verifikasi yang aman.",
    },
    {
      icon: MapPin,
      title: "Jangkauan Luas",
      description:
        "Layanan tersedia di berbagai kota besar di seluruh Indonesia.",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 gradient-hero" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <MapPin className="w-4 h-4" />
              Platform Lost & Found Terpercaya di Indonesia
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Temukan Barang
              <span className="text-gradient block">Hilang Anda</span>
            </h1>

            <p
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Platform terpercaya untuk melaporkan barang hilang dan membantu
              mengembalikan barang temuan kepada pemiliknya yang sah.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Link to="/report-lost">
                <Button variant="default" size="lg">
                  Laporkan Barang Hilang
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/report-found">
                <Button variant="default" size="lg">
                  Laporkan Barang Ditemukan
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 p-5 bg-card/50 backdrop-blur-lg rounded-2xl border border-border shadow-soft animate-fade-in-up"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-card/50 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Platform Lost & Found yang mudah digunakan, aman, dan memiliki
              jangkauan luas di seluruh Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 md:p-8 bg-background/50 backdrop-blur-lg rounded-2xl border border-border card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Items Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Laporan Terbaru
              </h2>
              <p className="text-muted-foreground">
                Lihat barang yang baru saja dilaporkan hilang atau ditemukan.
              </p>
            </div>
            <Link to="/lost">
              <Button variant="outline">
                Lihat Semua
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Loading State */}
          {(lostLoading || foundLoading) && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Items Grid */}
          {!lostLoading && !foundLoading && recentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ItemCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            !lostLoading &&
            !foundLoading && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  Belum ada laporan barang. Jadilah yang pertama melaporkan!
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Kehilangan Barang Berharga?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Jangan khawatir! Segera laporkan barang Anda yang hilang dan biarkan
            komunitas kami membantu menemukannya.
          </p>
          <Link to="/report-lost">
            <Button
              variant="secondary"
              size="lg"
              className="text-primary font-semibold"
            >
              Buat Laporan Sekarang
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
