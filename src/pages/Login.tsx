import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLogin } from "@/hooks/useSupabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) newErrors.email = "Email wajib diisi";
    if (!formData.password.trim()) newErrors.password = "Password wajib diisi";

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Formulir tidak lengkap",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      });
      return;
    }

    try {
      await login(formData);
      toast({
        title: "Login berhasil!",
        description: "Selamat datang kembali.",
      });

      // Redirect to intended page or home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: "Login gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      <main className="pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Back Button */}
            <Link
              to="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>

            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Masuk
              </h1>
              <p className="text-muted-foreground">
                Masukkan email dan password Anda untuk melanjutkan.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-card/50 backdrop-blur-lg rounded-2xl border border-border p-6 md:p-8 shadow-soft">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email <span className="text-destructive">*</span>
                  </label>
                   <input
                     type="email"
                     value={formData.email}
                     onChange={(e) => handleInputChange("email", e.target.value)}
                     placeholder="nama@email.com"
                     className={`input-field ${errors.email ? "border-destructive focus:ring-destructive" : ""}`}
                   />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                     <input
                       type={showPassword ? "text" : "password"}
                       value={formData.password}
                       onChange={(e) => handleInputChange("password", e.target.value)}
                       placeholder="Masukkan password"
                        className={`input-field pr-10 ${errors.password ? "border-destructive focus:ring-destructive" : ""}`}
                     />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-destructive text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Masuk...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </form>

              {/* Register Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Belum punya akun?{" "}
                  <Link
                    to="/register"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Daftar di sini
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;