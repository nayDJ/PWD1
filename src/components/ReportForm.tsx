import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories, locations } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { useAddItem } from '@/hooks/useSupabase';

interface ReportFormProps {
  type: 'lost' | 'found';
}

const ReportForm = ({ type }: ReportFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate: addItem, isPending } = useAddItem();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    date: '',
    description: '',
    contact: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Ukuran file terlalu besar",
          description: "Maksimal ukuran gambar adalah 5MB",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nama barang wajib diisi';
    if (!formData.category) newErrors.category = 'Pilih kategori';
    if (!formData.location) newErrors.location = 'Pilih lokasi';
    if (!formData.date) newErrors.date = 'Tanggal wajib diisi';
    if (!formData.description.trim()) newErrors.description = 'Deskripsi wajib diisi';
    if (!formData.contact.trim()) newErrors.contact = 'Kontak wajib diisi';
    
    // Validate phone number
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
    if (formData.contact && !phoneRegex.test(formData.contact.replace(/\s/g, ''))) {
      newErrors.contact = 'Format nomor telepon tidak valid';
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

    // Prepare data for Supabase
    const dataToSubmit = {
      title: formData.name,
      description: formData.description,
      category: formData.category,
      type: type,
      location: formData.location,
      image_url: imagePreview,
      contact_name: formData.name,
      contact_phone: formData.contact,
      contact_email: '',
    };

    try {
      await addItem(dataToSubmit);
      toast({
        title: "Laporan berhasil dikirim!",
        description: `Laporan barang ${type === 'lost' ? 'hilang' : 'ditemukan'} Anda telah tersimpan.`,
      });
      navigate(type === 'lost' ? '/lost' : '/found');
    } catch (error) {
      toast({
        title: "Gagal mengirim laporan",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Foto Barang
        </label>
        {!imagePreview ? (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-200">
            <Upload className="w-10 h-10 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">
              Klik untuk upload gambar
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              PNG, JPG hingga 5MB
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative w-full h-48 rounded-xl overflow-hidden">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Item Name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Nama Barang <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Contoh: iPhone 14 Pro Max"
          className={`input-field ${errors.name ? 'border-destructive focus:ring-destructive' : ''}`}
          maxLength={100}
        />
        {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Category & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Kategori <span className="text-destructive">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`input-field appearance-none cursor-pointer ${errors.category ? 'border-destructive' : ''}`}
          >
            <option value="">Pilih kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="text-destructive text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Lokasi <span className="text-destructive">*</span>
          </label>
          <select
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className={`input-field appearance-none cursor-pointer ${errors.location ? 'border-destructive' : ''}`}
          >
            <option value="">Pilih lokasi</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          {errors.location && <p className="text-destructive text-sm mt-1">{errors.location}</p>}
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Tanggal {type === 'lost' ? 'Hilang' : 'Ditemukan'} <span className="text-destructive">*</span>
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className={`input-field ${errors.date ? 'border-destructive' : ''}`}
        />
        {errors.date && <p className="text-destructive text-sm mt-1">{errors.date}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Deskripsi <span className="text-destructive">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Jelaskan ciri-ciri barang secara detail..."
          rows={4}
          className={`input-field resize-none ${errors.description ? 'border-destructive' : ''}`}
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground mt-1">{formData.description.length}/1000 karakter</p>
        {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Contact */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Nomor WhatsApp <span className="text-destructive">*</span>
        </label>
        <input
          type="tel"
          value={formData.contact}
          onChange={(e) => handleInputChange('contact', e.target.value)}
          placeholder="Contoh: 081234567890"
          className={`input-field ${errors.contact ? 'border-destructive' : ''}`}
        />
        {errors.contact && <p className="text-destructive text-sm mt-1">{errors.contact}</p>}
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
            Mengirim...
          </>
        ) : (
          `Kirim Laporan ${type === 'lost' ? 'Barang Hilang' : 'Barang Ditemukan'}`
        )}
      </Button>
    </form>
  );
};

export default ReportForm;
