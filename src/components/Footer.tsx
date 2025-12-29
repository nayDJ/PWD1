import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card/50 backdrop-blur-lg border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Lost<span className="text-primary">&</span>Found
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Platform terpercaya untuk membantu Anda menemukan barang hilang
              dan mengembalikan barang temuan kepada pemiliknya.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Navigasi</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/lost"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Barang Hilang
                </Link>
              </li>
              <li>
                <Link
                  to="/found"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Barang Ditemukan
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Bantuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Report Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Laporkan</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/report-lost"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Lapor Barang Hilang
                </Link>
              </li>
              <li>
                <Link
                  to="/report-found"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Lapor Barang Ditemukan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4" />
                <span>Nayaka-Rudhy@lostandfound.id</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4" />
                <span>+62 21 1234 5678</span>
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/nayakaadj"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6">
          <p className="text-center text-muted-foreground text-sm">
            © 2024 Lost&Found Indonesia. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
