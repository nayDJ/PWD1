export interface Item {
  id: string;
  name: string;
  type: "lost" | "found";
  category: string;
  location: string;
  date: string;
  description: string;
  contact: string;
  image: string;
}

export const categories = [
  "Elektronik",
  "Fashion",
  "Perhiasan",
  "Dokumen",
  "Kendaraan",
  "Lainnya",
];

export const locations = [
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Medan",
  "Semarang",
  "Makassar",
  "Palembang",
  "Tangerang",
  "Depok",
  "Bekasi",
  "Bogor",
  "Malang",
  "Padang",
  "Pekanbaru",
  "Banjarmasin",
];

export const mockItems: Item[] = [
  {
    id: "1",
    name: "iPhone 12 Pro",
    type: "lost",
    category: "Elektronik",
    location: "Jakarta",
    date: "2024-12-15",
    description: "Hilang di stasiun Gambir, warna biru, ada casing hitam",
    contact: "+6281234567890",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
  },
  {
    id: "2",
    name: "Dompet Kulit Hitam",
    type: "found",
    category: "Dompet",
    location: "Bandung",
    date: "2024-12-14",
    description: "Ditemukan di halte bus, berisi KTP dan kartu ATM",
    contact: "+6289876543210",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
  },
  {
    id: "3",
    name: "Kunci Mobil Toyota",
    type: "lost",
    category: "Kunci",
    location: "Surabaya",
    date: "2024-12-13",
    description: "Kunci mobil Avanza warna silver, hilang di parkiran mall",
    contact: "+6281122334455",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400",
  },
  {
    id: "4",
    name: "Tas Ransel Nike",
    type: "found",
    category: "Tas",
    location: "Medan",
    date: "2024-12-12",
    description: "Tas ransel hitam dengan logo Nike, ditemukan di kampus",
    contact: "+6285566677888",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
  },
  {
    id: "5",
    name: "KTM Hilang",
    type: "lost",
    category: "Dokumen",
    location: "Semarang",
    date: "2024-12-11",
    description: "Kartu Tanda Mahasiswa UNNES hilang di perpustakaan",
    contact: "+6287788990011",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
  },
  {
    id: "6",
    name: "Jaket Jeans Biru",
    type: "found",
    category: "Pakaian",
    location: "Makassar",
    date: "2024-12-10",
    description: "Jaket jeans ditemukan di kafe, ukuran M",
    contact: "+6289900112233",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
  },
];
