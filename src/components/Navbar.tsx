import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MapPin, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useProfile, useLogout } from "@/hooks/useSupabase";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { data: session } = useAuth();
  const { data: profile } = useProfile(session?.user?.id);
  const { mutateAsync: logout } = useLogout();

  const baseNavLinks = [
    { path: "/", label: "Beranda" },
    { path: "/lost", label: "Barang Hilang" },
    { path: "/found", label: "Barang Ditemukan" },
    { path: "/contact", label: "Bantuan" },
  ];

  const navLinks = session ? [
    ...baseNavLinks,
    { path: "/chat", label: "Chat" }
  ] : baseNavLinks;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/50 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow duration-300">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Lost<span className="text-primary">&</span>Found
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground">
                  Hai, {profile?.role === 'admin' ? 'Admin' : session.user.email?.split('@')[0]}
                </span>
                 {profile?.role === 'admin' && (
                   <Link to="/admin">
                     <Button variant="outline" size="sm" className="text-white">
                       Dashboard
                     </Button>
                   </Link>
                 )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await logout();
                    window.location.href = "/";
                  }}
                  className="text-white hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Keluar
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="default" className="text-white border-white hover:text-white">
                    Masuk
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="default">
                    Daftar
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
                {session ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-foreground text-center py-2">
                      Hai, {profile?.role === 'admin' ? 'Admin' : session.user.email?.split('@')[0]}
                    </div>
                     {profile?.role === 'admin' && (
                       <Link to="/admin" onClick={() => setIsOpen(false)}>
                         <Button variant="outline" className="w-full text-white">
                           Dashboard
                         </Button>
                       </Link>
                     )}
                    <Button
                      variant="ghost"
                      onClick={async () => {
                        await logout();
                        setIsOpen(false);
                        window.location.href = "/";
                      }}
                      className="w-full justify-start"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Keluar
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Masuk
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button variant="default" className="w-full">
                        Daftar
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
