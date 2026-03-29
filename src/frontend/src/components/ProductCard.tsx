import { Button } from "@/components/ui/button";
import { HttpAgent } from "@icp-sdk/core/agent";
import { ShoppingBag, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { loadConfig } from "../config";
import type { Product } from "../types";
import { StorageClient } from "../utils/StorageClient";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  index: number;
}

function useProductImageUrl(imageId: string): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageId) return;
    loadConfig().then((config) => {
      const agent = new HttpAgent({ host: config.backend_host });
      const sc = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      sc.getDirectURL(imageId)
        .then(setUrl)
        .catch(() => setUrl(null));
    });
  }, [imageId]);

  return url;
}

export default function ProductCard({
  product,
  onAddToCart,
  index,
}: ProductCardProps) {
  const imageUrl = useProductImageUrl(product.imageId);
  const inStock = product.stock > 0n;
  const priceDisplay = (Number(product.price) / 100).toFixed(2);

  return (
    <div
      data-ocid={`product.item.${index}`}
      className="bg-card border border-border shadow-card flex flex-col overflow-hidden group rounded-sm"
    >
      {/* Image */}
      <div className="relative bg-muted h-52 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <ShoppingBag className="h-10 w-10 text-muted-foreground opacity-30" />
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
            <span className="bg-card text-foreground text-xs font-semibold px-3 py-1">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Stars */}
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="h-3 w-3 fill-primary text-primary" />
          ))}
        </div>

        <h3 className="font-serif font-semibold text-foreground text-sm leading-snug line-clamp-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-2">
          <span className="text-foreground font-bold text-base">
            ${priceDisplay}
          </span>
          {inStock && (
            <p className="text-xs text-muted-foreground">
              {product.stock.toString()} in stock
            </p>
          )}
        </div>

        <Button
          data-ocid={`product.primary_button.${index}`}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-xs tracking-[0.1em] uppercase font-medium h-9"
          disabled={!inStock}
          onClick={() => onAddToCart(product)}
        >
          <ShoppingBag className="h-3.5 w-3.5 mr-2" />
          {inStock ? "Add to Bag" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
}
