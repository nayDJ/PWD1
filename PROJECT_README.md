# Deskripsi Proyek Lost and Found

## 1. Deskripsi Singkat Proyek
Proyek ini adalah aplikasi web untuk mengelola laporan barang hilang dan ditemukan. Aplikasi memungkinkan pengguna untuk melaporkan barang hilang, melaporkan barang ditemukan, melihat daftar barang, melihat detail barang, dan berkomunikasi dengan admin melalui fitur chat. Aplikasi ini juga dilengkapi dengan sistem autentikasi pengguna, peran pengguna (user/admin), dan dashboard admin untuk pengelolaan.

## 2. Skema Database
Database menggunakan PostgreSQL melalui Supabase dengan skema berikut:

### Tabel `profiles`
- `id` (UUID, Primary Key, References auth.users.id)
- `role` (TEXT, Default 'user', Check: 'user' atau 'admin')
- `created_at` (TIMESTAMP WITH TIME ZONE, Default NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, Default NOW())

Fungsi: Menyimpan profil pengguna dengan peran mereka.

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

Fungsi: Menyimpan data barang hilang/ditemukan.

### Tabel `messages`
- `id` (UUID, Default gen_random_uuid(), Primary Key)
- `item_id` (TEXT, NOT NULL)
- `sender` (TEXT, NOT NULL, Check: 'user' atau 'admin')
- `receiver_id` (UUID, References auth.users.id) - Admin penerima
- `text` (TEXT, NOT NULL)
- `created_at` (TIMESTAMP WITH TIME ZONE, Default NOW())

Fungsi: Menyimpan pesan chat antara user dan admin.

Semua tabel menggunakan Row Level Security (RLS) untuk keamanan.

## 3. Tech Stack
### Front End
- **React 19**: Framework JavaScript untuk membangun UI interaktif. Dipilih karena ekosistemnya yang besar, komunitas aktif, dan kemampuan untuk membuat komponen reusable.
- **TypeScript**: Superset JavaScript dengan tipe statis. Dipilih untuk meningkatkan keamanan kode, debugging yang lebih baik, dan pengalaman developer yang lebih baik.
- **Vite**: Build tool modern yang cepat. Dipilih karena waktu build yang sangat cepat, hot module replacement (HMR), dan dukungan native untuk TypeScript dan React.
- **TailwindCSS**: Utility-first CSS framework. Dipilih untuk styling yang cepat, responsif, dan konsisten tanpa perlu menulis CSS custom.
- **Radix UI**: Komponen UI primitif yang dapat diakses. Dipilih untuk UI yang konsisten, dapat diakses, dan mudah dikustomisasi menggunakan shadcn/ui.
- **React Router DOM**: Routing untuk aplikasi React. Dipilih untuk navigasi client-side yang efisien.
- **TanStack Query (React Query)**: Library untuk state management server dan caching. Dipilih untuk mengelola data API dengan caching otomatis, error handling, dan optimis updates.
- **React Hook Form**: Library untuk form management. Dipilih untuk performa tinggi dan integrasi mudah dengan validasi.
- **Zod**: Schema validation library. Dipilih untuk validasi tipe-safe dan error handling yang baik.
- **Lucide React**: Icon library. Dipilih untuk ikon yang konsisten dan scalable.

### Back End
- **Supabase**: Backend-as-a-Service (BaaS) yang menyediakan database, autentikasi, storage, dan real-time features. Dipilih karena kemudahan setup, fitur lengkap (auth, database, file storage), real-time subscriptions, dan integrasi yang baik dengan React.

### Database
- **PostgreSQL**: Relational database melalui Supabase. Dipilih karena keamanan tinggi, ACID compliance, dukungan JSON, dan kemampuan untuk query kompleks. Supabase menyediakan layer keamanan dengan Row Level Security (RLS).

Alasan pemilihan tech stack secara keseluruhan: Kombinasi ini memungkinkan development yang cepat, scalable, dan maintainable. Supabase mengurangi kebutuhan backend custom, memungkinkan fokus pada front-end. React ecosystem menyediakan tools modern untuk UX yang baik.

## 4. Penerapan Konsep Web Dinamis
### Form Validation
Form validation menggunakan validasi manual di client-side dengan JavaScript regex untuk email dan nomor telepon. Error ditampilkan secara real-time saat input berubah.

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
Session dikelola menggunakan Supabase Auth, yang menggunakan JWT tokens yang disimpan dalam cookies/httpOnly secara otomatis. Session diperiksa pada setiap request ke API.

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
Cookies ditangani otomatis oleh Supabase untuk menyimpan session tokens. Tidak ada manipulasi manual cookies dalam kode aplikasi.

### API (Web Service)
API calls menggunakan Supabase client yang terintegrasi dengan TanStack Query untuk caching, error handling, dan optimistic updates. Data di-fetch secara real-time.

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