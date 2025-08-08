import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import comingSoon from "../assets/coming soon image.png";

// Removed the interface ProductCardProps as it is TypeScript-specific.

const ProductCard = ({ product, arrival }) => {
  if (!product) {
    // console.error("ProductCard received an undefined or null product prop!");
    return null; // Don't render if product is bad
  }
  // console.log(arrival);
  // console.log(product);
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

  const userId = localStorage.getItem("userId")
    ? localStorage.getItem("userId").replaceAll(/"/g, "")
    : null;
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { toast } = useToast();

  const handleCartUpdate = async () => {
    if (!userId) {
      navigate("/login");
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/user/addToCart`, {
        userId,
        productId: _id,
      });
      console.log(response);
      if (response.statusText === "OK") {
        toast({
          title: "Success",
          description: "Item Added to Cart Successfully",
          varient: "success",
        });
        navigate("/cart");
      }
    } catch (error) {
      console.log(error);
      // if (response.status(400)) {
      toast({
        title: error.response.statusText,
        description: error.response.data.message,
        variant: "destructive",
      });
      navigate("/cart");
      // }
    }

    console.log("Add to cart");
  };

  // console.log(id, name, price, originalPrice, image, category, isNew, onSale);
  return (
    <Card className="group product-card overflow-hidden border-border/50 bg-card/50 hover:cursor-pointer">
      {arrival === "arrived" && (
        <Link to={`/product/${_id}`}>
          <div className="relative overflow-hidden">
            <img
              src={images[0]}
              alt={name}
              className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
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

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="ghost"
                size="icon"
                className="bg-background/80 hover:bg-background"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-background/80 hover:bg-background"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            {/* Add to Cart - Slides up on hover */}
            {/* <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            variant="cta"
            className="w-full rounded-none"
            onClick={() => handleCartUpdate()}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div> */}
          </div>

          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {category}
              </p>
              {/* <Link to={`/product/${_id}`}> */}
              <h3 className="font-semibold text-foreground hover:text-accent transition-colors line-clamp-2">
                {name}
              </h3>
              {/* </Link> */}
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
      )}
      {arrival === "comingSoon" && (
        // <Link to={`/product/${_id}`}>
        <>
          <div className="relative overflow-hidden">
            {arrival === "arrived" && (
              <img
                src={images[0]}
                alt={name}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )}
            {arrival === "comingSoon" && (
              <img
                src={comingSoon}
                alt={name}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
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

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="ghost"
                size="icon"
                className="bg-background/80 hover:bg-background"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-background/80 hover:bg-background"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            {/* Add to Cart - Slides up on hover */}
            {/* <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            variant="cta"
            className="w-full rounded-none"
            onClick={() => handleCartUpdate()}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div> */}
          </div>

          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {category}
              </p>
              {/* <Link to={`/product/${_id}`}> */}
              <h3 className="font-semibold text-foreground hover:text-accent transition-colors line-clamp-2">
                {name}
              </h3>
              {/* </Link> */}
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
          {/* // </Link> */}
        </>
      )}
    </Card>
  );
};

export default ProductCard;
