import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLogin, useRegister } from "@/hooks/useSupabase";

const AuthLanding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate: login, isPending: loginPending } = useLogin();
  const { mutate: register, isPending: registerPending } = useRegister();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>(
    {}
  );

  const validateLogin = () => {
    const errors: Record<string, string> = {};
    if (!loginData.email.trim()) errors.email = "Email wajib diisi";
    if (!loginData.password.trim()) errors.password = "Password wajib diisi";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (loginData.email && !emailRegex.test(loginData.email)) {
      errors.email = "Format email tidak valid";
    }
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = () => {
    const errors: Record<string, string> = {};
    if (!registerData.fullName.trim()) errors.fullName = "Nama lengkap wajib diisi";
    if (!registerData.email.trim()) errors.email = "Email wajib diisi";
    if (!registerData.password.trim()) errors.password = "Password wajib diisi";
    if (!registerData.confirmPassword.trim())
      errors.confirmPassword = "Konfirmasi password wajib diisi";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (registerData.email && !emailRegex.test(registerData.email)) {
      errors.email = "Format email tidak valid";
    }
    if (registerData.password && registerData.password.length < 6) {
      errors.password = "Password minimal 6 karakter";
    }
    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Password tidak cocok";
    }
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    try {
      await login(loginData);
      toast({
        title: "Login berhasil!",
        description: "Selamat datang.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Login gagal",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;
    try {
      await register({
        fullName: registerData.fullName,
        email: registerData.email,
        password: registerData.password,
      });
      toast({
        title: "Pendaftaran berhasil!",
        description: "Silakan periksa email Anda untuk verifikasi.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Pendaftaran gagal",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const handleLoginChange = (field: string, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
    if (loginErrors[field])
      setLoginErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleRegisterChange = (field: string, value: string) => {
    setRegisterData((prev) => ({ ...prev, [field]: value }));
    if (registerErrors[field])
      setRegisterErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-100 to-gray-200 grid place-items-center">
      <div className="max-w-md w-full mx-auto">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg mx-auto mb-4">
            <MapPin className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Lost<span className="text-primary">&</span>Found
          </h1>
          <p className="text-muted-foreground">
            Temukan barang hilang Anda atau bantu orang lain menemukannya
          </p>
        </div>

        {/* Auth Forms */}
        <div className="bg-card/80 backdrop-blur-lg rounded-2xl border border-border p-6 md:p-8 shadow-xl w-full">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10">
              <TabsTrigger
                value="login"
                className="text-white data-[state=active]:text-white data-[state=active]:bg-white/20"
              >
                Masuk
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="text-white data-[state=active]:text-white data-[state=active]:bg-white/20"
              >
                Daftar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => handleLoginChange("email", e.target.value)}
                    placeholder="nama@email.com"
                    className={`input-field ${
                      loginErrors.email ? "border-destructive" : ""
                    }`}
                  />
                  {loginErrors.email && (
                    <p className="text-destructive text-sm mt-1">
                      {loginErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) =>
                        handleLoginChange("password", e.target.value)
                      }
                      placeholder="Masukkan password"
                      className={`input-field pr-10 ${
                        loginErrors.password ? "border-destructive" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="text-destructive text-sm mt-1">
                      {loginErrors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={loginPending}
                >
                  {loginPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Masuk...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={registerData.fullName}
                    onChange={(e) =>
                      handleRegisterChange("fullName", e.target.value)
                    }
                    placeholder="Nama lengkap Anda"
                    className={`input-field ${
                      registerErrors.fullName ? "border-destructive" : ""
                    }`}
                  />
                  {registerErrors.fullName && (
                    <p className="text-destructive text-sm mt-1">
                      {registerErrors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) =>
                      handleRegisterChange("email", e.target.value)
                    }
                    placeholder="nama@email.com"
                    className={`input-field ${
                      registerErrors.email ? "border-destructive" : ""
                    }`}
                  />
                  {registerErrors.email && (
                    <p className="text-destructive text-sm mt-1">
                      {registerErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={(e) =>
                        handleRegisterChange("password", e.target.value)
                      }
                      placeholder="Minimal 6 karakter"
                      className={`input-field pr-10 ${
                        registerErrors.password ? "border-destructive" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {registerErrors.password && (
                    <p className="text-destructive text-sm mt-1">
                      {registerErrors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        handleRegisterChange("confirmPassword", e.target.value)
                      }
                      placeholder="Ulangi password"
                      className={`input-field pr-10 ${
                        registerErrors.confirmPassword
                          ? "border-destructive"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {registerErrors.confirmPassword && (
                    <p className="text-destructive text-sm mt-1">
                      {registerErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={registerPending}
                >
                  {registerPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Mendaftar...
                    </>
                  ) : (
                    "Daftar"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;
