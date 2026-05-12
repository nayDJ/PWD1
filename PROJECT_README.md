# Deskripsi Proyek Lost and Found

## 1. Deskripsi Singkat Proyek
Inisiatif ini merupakan platform digital yang bertujuan untuk menangani pelaporan objek yang hilang dan yang telah diketemukan. Platform ini memberikan kemampuan bagi pengguna untuk menyampaikan laporan objek hilang, menyampaikan temuan objek, meninjau katalog objek, memeriksa rincian objek, serta berinteraksi dengan administrator lewat fungsi pesan. Selain itu, platform ini menyertakan mekanisme verifikasi identitas pengguna, pembagian role (pengguna/admin), serta panel kontrol administrator untuk administrasi.

## 2. Skema Database
Database menggunakan PostgreSQL melalui Supabase dengan skema berikut:

### Tabel `profiles`
- `id` (UUID, Primary Key, References auth.users.id)
- `role` (TEXT, Default 'user', Check: 'user' atau 'admin')
- `created_at` (TIMESTAMP WITH TIME ZONE, Default NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, Default NOW())

Tujuan: Menyimpan data profil pengguna beserta jabatan mereka.

### Tabel `items`
- `id` (UUID, Default gen_random_uuid(), Primary Key)
- `user_id` (UUID, References auth.users.id, ON DELETE CASCADE)
- `title` (TEXT, NOT NULL)
- `description` (TEXT, NOT NULL)
- `category` (TEXT, NOT NULL)
- `type` (TEXT, NOT NULL, Check: 'lost' atau 'found')
- `location` (TEXT, NOT NULL)
- `date` (DATE, NOT NULL)
- `image_url` (TEXT)
- `contact_name` (TEXT, NOT NULL)
- `contact_phone` (TEXT, NOT NULL)
- `contact_email` (TEXT)
- `created_at` (TIMESTAMP WITH TIME ZONE, Default NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, Default NOW())

Tujuan: Menyimpan informasi objek yang hilang atau telah ditemukan.

### Tabel `messages`
- `id` (UUID, Default gen_random_uuid(), Primary Key)
- `item_id` (TEXT, NOT NULL)
- `sender` (TEXT, NOT NULL, Check: 'user' atau 'admin')
- `receiver_id` (UUID, References auth.users.id) - Admin penerima
- `text` (TEXT, NOT NULL)
- `created_at` (TIMESTAMP WITH TIME ZONE, Default NOW())

Tujuan: Menyimpan komunikasi pesan antara pengguna dan administrator.

Setiap tabel mengadopsi Row Level Security (RLS) guna memastikan perlindungan data.

## 3. Tech Stack
### Front End
- **React 19**: Kerangka kerja JavaScript yang digunakan untuk mengembangkan antarmuka pengguna yang responsif. Dipilih berdasarkan jaringan ekosistemnya yang luas, komunitas yang dinamis, serta kemampuan dalam menciptakan elemen yang dapat digunakan ulang.
- **TypeScript**: Ekstensi JavaScript dengan sistem tipe tetap. Dipilih untuk memperkuat keamanan kode, memfasilitasi proses debugging, dan meningkatkan kualitas pengalaman pengembang.
- **Vite**: Alat pembangunan modern dengan kecepatan tinggi. Dipilih dikarenakan proses kompilasi yang sangat singkat, fitur hot module replacement (HMR), serta dukungan asli untuk TypeScript dan React.
- **TailwindCSS**: Kerangka kerja CSS yang berbasis utilitas. Dipilih untuk penataan gaya yang efisien, adaptif, dan seragam tanpa memerlukan penulisan CSS khusus.
- **Radix UI**: Elemen UI dasar yang mendukung aksesibilitas. Dipilih untuk antarmuka yang stabil, terjangkau, dan mudah disesuaikan melalui shadcn/ui.
- **React Router DOM**: Sistem routing untuk aplikasi React. Dipilih untuk navigasi sisi klien yang optimal.
- **TanStack Query (React Query)**: Pustaka untuk pengelolaan status server dan penyimpanan sementara. Dipilih untuk menangani data API dengan caching otomatis, penanganan kesalahan, serta pembaruan optimis.
- **React Hook Form**: Pustaka untuk pengelolaan formulir. Dipilih karena kinerja unggul dan integrasi sederhana dengan mekanisme validasi.
- **Zod**: Pustaka validasi skema. Dipilih untuk validasi yang aman terhadap tipe dan penanganan kesalahan yang efektif.
- **Lucide React**: Koleksi ikon. Dipilih untuk ikon yang seragam dan dapat diskalakan.

### Back End
- **Supabase**: Layanan Backend-as-a-Service (BaaS) yang menawarkan basis data, verifikasi identitas, penyimpanan, serta fitur real-time. Dipilih karena kemudahan konfigurasi, rangkaian fitur komprehensif (otentikasi, basis data, penyimpanan berkas), langganan real-time, serta kompatibilitas yang baik dengan React.

### Database
- **PostgreSQL**: Basis data relasional yang disediakan oleh Supabase. Dipilih karena tingkat keamanan yang tinggi, kepatuhan ACID, dukungan untuk JSON, serta kapasitas untuk kueri yang rumit. Supabase menambahkan lapisan perlindungan melalui Row Level Security (RLS).

Dasar pemilihan tumpukan teknologi secara menyeluruh: Gabungan ini mendukung pengembangan yang cepat, dapat diperluas, dan mudah dipelihara. Supabase meminimalkan kebutuhan untuk backend khusus, sehingga memungkinkan konsentrasi pada bagian front-end. Ekosistem React menyajikan alat-alat mutakhir untuk pengalaman pengguna yang optimal.

## 4. Penerapan Konsep Web Dinamis
### Form Validation
Validasi formulir dilakukan melalui pemeriksaan manual di sisi klien menggunakan ekspresi reguler JavaScript untuk alamat surel dan nomor telepon. Kesalahan ditunjukkan secara langsung ketika masukan dimodifikasi.

Potongan kode dari `src/components/ReportForm.tsx`:
```typescript
const validateForm = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.name.trim()) newErrors.name = "Nama barang wajib diisi";
  if (!formData.category) newErrors.category = "Pilih kategori";
  if (!formData.location) newErrors.location = "Pilih lokasi";
  if (!formData.date) newErrors.date = "Tanggal wajib diisi";
  if (!formData.description.trim())
    newErrors.description = "Deskripsi wajib diisi";
  if (!formData.contact.trim()) newErrors.contact = "Kontak wajib diisi";
  if (!formData.contactName.trim())
    newErrors.contactName = "Nama kontak wajib diisi";

  // Validate phone number
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
  if (
    formData.contact &&
    !phoneRegex.test(formData.contact.replace(/\s/g, ""))
  ) {
    newErrors.contact = "Format nomor telepon tidak valid";
  }

  // Validate email if provided
  if (
    formData.contactEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)
  ) {
    newErrors.contactEmail = "Format email tidak valid";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### Session Management
Sesi dikontrol melalui Supabase Auth, yang memanfaatkan token JWT yang disimpan secara otomatis dalam cookies/httpOnly. Sesi diverifikasi pada setiap permintaan ke API.

Potongan kode dari `src/hooks/useSupabase.ts`:
```typescript
export const useAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error);
          throw error;
        }
        return session;
      } catch (error) {
        console.error("Auth query error:", error);
        throw error;
      }
    },
    staleTime: 0, // No cache - always check current session
    gcTime: 0, // Don't cache in garbage collector
  });
};
```

### Cookies
Cookies dikelola secara otomatis oleh Supabase untuk menyimpan token sesi. Tidak terdapat pengaturan manual terhadap cookies dalam kode program.

### API (Web Service)
Panggilan API memanfaatkan klien Supabase yang terhubung dengan TanStack Query untuk penyimpanan sementara, penanganan kesalahan, serta pembaruan optimis. Data diambil dalam waktu nyata.

Potongan kode dari `src/hooks/useSupabase.ts`:
```typescript
export const useItems = (type: "lost" | "found") => {
  return useQuery({
    queryKey: ["items", type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("type", type)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
```</content>
<parameter name="filePath">D:\pwd-1\pwd-1\PROJECT_README.md