-- SQL untuk membuat tabel profiles di Supabase
-- Jalankan ini di Supabase SQL Editor

-- Buat tabel profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktifkan Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Kebijakan untuk insert (user dapat membuat profil sendiri)
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Kebijakan untuk select (authenticated users dapat melihat profiles - handle role di aplikasi)
CREATE POLICY "Authenticated users can view profiles" ON profiles
  FOR SELECT TO authenticated USING (true);

-- Kebijakan untuk update (authenticated users dapat update profiles - handle role di aplikasi)
CREATE POLICY "Authenticated users can update profiles" ON profiles
  FOR UPDATE TO authenticated USING (true);

-- Fungsi untuk auto-create profile saat register
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger untuk auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Buat tabel items
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  location TEXT NOT NULL,
  date DATE NOT NULL,
  image_url TEXT,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktifkan Row Level Security untuk items
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Kebijakan untuk insert (authenticated users dapat insert items dengan user_id mereka)
CREATE POLICY "Users can insert their own items" ON items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kebijakan untuk select (authenticated users dapat melihat semua items)
CREATE POLICY "Authenticated users can view items" ON items
  FOR SELECT TO authenticated USING (true);

-- Kebijakan untuk update (users dapat update items mereka sendiri, admins dapat update semua)
CREATE POLICY "Users can update their own items or admins update all" ON items
  FOR UPDATE USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Kebijakan untuk delete (users dapat delete items mereka sendiri, admins dapat delete semua)
CREATE POLICY "Users can delete their own items or admins delete all" ON items
  FOR DELETE USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Buat storage bucket untuk images jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Kebijakan storage untuk images (authenticated users dapat upload)
CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Kebijakan untuk view images (public dapat melihat)
CREATE POLICY "Anyone can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Buat tabel messages untuk chat
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'admin')),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktifkan Row Level Security untuk messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Kebijakan untuk insert (authenticated users dapat insert messages untuk items mereka atau admins untuk semua)
CREATE POLICY "Users can insert messages for their items or admins for all" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM items WHERE id = item_id::bigint
    ) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Kebijakan untuk select (authenticated users dapat melihat messages untuk items mereka atau admins untuk semua)
CREATE POLICY "Users can view messages for their items or admins for all" ON messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM items WHERE id = item_id::bigint
    ) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
