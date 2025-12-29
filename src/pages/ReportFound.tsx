import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReportForm from "@/components/ReportForm";

const ReportFound = () => {
  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      <main className="pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
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
                Laporkan Barang Ditemukan
              </h1>
              <p className="text-muted-foreground">
                Isi formulir di bawah ini dengan detail barang yang Anda
                temukan.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-card/50 backdrop-blur-lg rounded-2xl border border-border p-6 md:p-8 shadow-soft">
              <ReportForm type="found" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReportFound;
