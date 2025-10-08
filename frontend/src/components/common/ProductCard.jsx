import { Link } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// The static import is now removed:
// import comingSoon from "../../assets/coming soon image 2.png";

const ProductCard = ({ product, comingSoonImage, comingSoonText, id }) => {
  // --- "Coming Soon" Card Logic ---
  // This section is now dynamic.
  if (!product) {
    return (
      <Card className="group product-card overflow-hidden border-border/50 bg-card/50 h-full w-full flex flex-col items-start justify-evenly">
        <div className="relative aspect-square overflow-hidden h-full w-full">
          {/* --- UPDATED: Uses the image URL from props --- */}
          <img
            src={
              comingSoonImage ||
              "https://placehold.co/400x400/222/fff?text=Coming+Soon"
            }
            alt="Product coming soon"
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground ">
              {comingSoonText || "Product Coming Soon"}{" "}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-accent">₹N/A</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- Real Product Card Logic (No changes needed here) ---
  const { name, isNew, onSale, price, originalPrice, image } = product;

  return (
    <Link to={`/product/${id}`}>
      <Card className="group product-card overflow-hidden border-border/50 bg-card/50 hover:cursor-pointer h-full w-full flex flex-col items-start justify-evenly">
        <div className="relative aspect-square overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
              <ImageIcon className="h-10 w-10" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <span className="bg-accent text-accent-foreground px-2 py-1 text-xs font-semibold rounded">
                NEW
              </span>
            )}
            {onSale && (
              <span className="bg-destructive text-destructive-foreground px-2 py-1 text-xs font-semibold rounded">
                SALE
              </span>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground hover:text-accent transition-colors line-clamp-2">
              {name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-accent">₹{price}</span>
              {originalPrice && price < originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
