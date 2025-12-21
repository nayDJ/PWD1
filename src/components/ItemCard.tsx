import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag } from 'lucide-react';
import type { Item } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Link to={`/item/${item.id}`} className="block group">
      <article className="bg-card rounded-2xl overflow-hidden border border-border card-hover shadow-soft">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <Badge
              variant={item.type === 'lost' ? 'destructive' : 'default'}
              className={`${
                item.type === 'lost'
                  ? 'bg-destructive/90 text-destructive-foreground'
                  : 'bg-primary/90 text-primary-foreground'
              } backdrop-blur-sm`}
            >
              {item.type === 'lost' ? 'Hilang' : 'Ditemukan'}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {item.name}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {item.description}
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="w-4 h-4 text-primary" />
              <span>{item.category}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{formatDate(item.date)}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ItemCard;
