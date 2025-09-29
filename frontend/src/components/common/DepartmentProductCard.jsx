import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

// The static import is now removed:
// import comingSoonImage from "../../assets/coming soon image 2.png";

const DepartmentProductCard = ({ department, product, comingSoonImage }) => {
  // --- Case 1: No product for this department, so render "Coming Soon" ---
  if (!product) {
    return (
      <Card className="group flex-shrink-0 w-56 bg-card/50 border-border/50 overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:cursor-default">
        <div className="relative overflow-hidden">
          {/* --- UPDATED: Uses the department image OR the dynamic comingSoonImage from props --- */}
          <img
            src={
              comingSoonImage ||
              "https://placehold.co/224x192/222/fff?text=Coming+Soon"
            }
            alt={`${department.name} Coming Soon`}
            className="h-48 w-full object-cover"
          />
        </div>
        <CardContent className="p-3 space-y-1">
          <CardTitle className="text-base font-bold text-foreground line-clamp-1">
            {department.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-1">
            Products Coming Soon
          </p>
          <div className="flex items-center gap-1">
            <span className="text-base font-bold text-accent">N/A</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- Case 2: A product was found, so render the full card (No changes needed here) ---
  const { _id, name, isNew, onSale, variants } = product;
  const defaultVariant = variants?.find(
    (variant) => variant.name === "Regular"
  );
  const defaultColor = defaultVariant?.colors?.find(
    (color) => color.name === "Black"
  );
  const price = defaultVariant?.price;
  const originalPrice = defaultVariant?.originalPrice;
  const imageSrc = defaultColor?.images?.[0];

  return (
    <Link to={`/product/${_id}`}>
      <Card className="group flex-shrink-0 w-56 bg-card/50 border-border/50 overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:cursor-pointer">
        <div className="relative overflow-hidden">
          <img
            src={imageSrc}
            alt={name}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && (
              <span className="bg-accent text-accent-foreground px-1.5 py-0.5 text-[0.7rem] font-semibold rounded">
                NEW
              </span>
            )}
            {onSale && (
              <span className="bg-destructive text-destructive-foreground px-1.5 py-0.5 text-[0.7rem] font-semibold rounded">
                SALE
              </span>
            )}
          </div>
        </div>
        <CardContent className="p-3 space-y-1">
          <CardTitle className="text-base font-bold text-foreground line-clamp-1">
            {department.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-1">{name}</p>
          <div className="flex items-center gap-1">
            <span className="text-base font-bold text-accent">
              ₹{price ? price.toFixed(2) : "N/A"}
            </span>
            {originalPrice && price < originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DepartmentProductCard;
