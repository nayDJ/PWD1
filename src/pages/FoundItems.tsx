import { useState, useMemo } from 'react';
import { Package, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ItemCard from '../components/ItemCard';
import SearchFilter from '../components/SearchFilter';
import { useItems } from '@/hooks/useSupabase';

const FoundItems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const { data: dbItems = [], isLoading, error } = useItems('found');

  // Map database items to component format
  const allItems = useMemo(() => {
    return dbItems.map((item: any) => ({
      id: item.id,
      name: item.title,
      title: item.title,
      description: item.description,
      type: item.type,
      category: item.category || 'Lainnya',
      location: item.location,
      date: item.created_at,
      contact: item.contact_phone,
      image: item.image_url,
      image_url: item.image_url,
    }));
  }, [dbItems]);

  const foundItems = useMemo(() => {
    return allItems
      .filter((item) => item.type === 'found')
      .filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || item.category === selectedCategory;
        const matchesLocation = !selectedLocation || item.location === selectedLocation;
        return matchesSearch && matchesCategory && matchesLocation;
      });
  }, [allItems, searchTerm, selectedCategory, selectedLocation]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      
      <main className="pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Barang Ditemukan
            </h1>
            <p className="text-muted-foreground">
              Daftar barang yang ditemukan dan menunggu pemiliknya.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="mb-8">
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              onClear={handleClearFilters}
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg mb-6">
              Terjadi kesalahan saat memuat data: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          )}

          {/* Results */}
          {!isLoading && foundItems.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Menampilkan {foundItems.length} barang ditemukan
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {foundItems.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ItemCard item={item} />
                  </div>
                ))}
              </div>
            </>
          ) : !isLoading && (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Tidak ada barang ditemukan
              </h3>
              <p className="text-muted-foreground">
                Coba ubah filter pencarian Anda
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FoundItems;
