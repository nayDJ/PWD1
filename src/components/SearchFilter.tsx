import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories, locations } from "@/lib/mockData";

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  onClear: () => void;
}

const SearchFilter = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  onClear,
}: SearchFilterProps) => {
  const hasFilters = searchTerm || selectedCategory || selectedLocation;

  return (
    <div className="bg-card rounded-2xl border border-border p-4 md:p-6 shadow-soft">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari barang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12"
          />
        </div>

        {/* Category Select */}
        <div className="lg:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field appearance-none cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location Select */}
        <div className="lg:w-48">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="input-field appearance-none cursor-pointer"
          >
            <option value="">Semua Lokasi</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Button */}
        {hasFilters && (
          <Button variant="ghost" onClick={onClear} className="lg:w-auto">
            <X className="w-4 h-4 mr-2" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
