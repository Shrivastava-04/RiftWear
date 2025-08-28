import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Eye, Heart, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ProductCard = ({ product, arrival }) => {
  const navigate = useNavigate();

  if (!product) {
    return null;
  }

  const {
    _id,
    name,
    price,
    originalPrice,
    images,
    category,
    isNew = false,
    onSale = false,
  } = product;
  // console.log(product);
  const imageSrc = images && images.length > 0 ? images[0] : "";

  return (
    <Card className="group product-card overflow-hidden border-border/50 bg-card/50 hover:cursor-pointer">
      {arrival === "arrived" ? (
        <Link to={`/product/${_id}`}>
          <div className="relative aspect-square overflow-hidden">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
                <ImageIcon className="h-10 w-10" />
              </div>
            )}
            {/* Badges */}
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
                {originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{originalPrice}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Link>
      ) : (
        // "Coming Soon" card
        <>
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product.images[0]}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground hover:text-accent transition-colors line-clamp-2">
                Product Coming Soon
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-accent">₹N/A</span>
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default ProductCard;
