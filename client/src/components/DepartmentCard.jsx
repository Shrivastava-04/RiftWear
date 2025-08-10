import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import comingSoonImage from "../assets/coming soon image 2.png"; // Assuming your coming soon image path

const DepartmentProductCard = ({ department, arrival }) => {
  // Added 'arrival' prop
  // Ensure department exists. If product is not linked, it might still be a "coming soon" department.
  if (!department) {
    return null;
  }

  const product = department.productId; // The populated product object

  // Destructure product details if product exists, otherwise provide defaults for "coming soon"
  const {
    _id,
    name, // Product name
    price,
    originalPrice,
    images,
    isNew = false,
    onSale = false,
  } = product || {}; // Use empty object if product is null/undefined

  // Determine the image source based on arrival status
  const imageSrc =
    arrival === "comingSoon"
      ? comingSoonImage
      : images?.[0] || "https://placehold.co/400x400/333/FFF?text=No+Image";
  const altText =
    arrival === "comingSoon" ? "Coming Soon" : name || "Product Image";
  const linkTo = arrival === "comingSoon" ? "#" : `/product/${_id}`; // Link to # or product page

  return (
    <Card className="group flex-shrink-0 w-56 bg-card/50 border-border/50 overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:cursor-pointer">
      {/* Conditionally link based on arrival status */}
      <Link
        to={linkTo}
        className={arrival === "comingSoon" ? "pointer-events-none" : ""}
      >
        <div className="relative overflow-hidden">
          <img
            src={imageSrc}
            alt={altText}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Badges for product (optional, based on your design preference) */}
          {/* Only show badges if not 'comingSoon' or if you have specific badges for coming soon */}
          {arrival !== "comingSoon" && (
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
          )}
        </div>

        <CardContent className="p-3 space-y-1">
          {/* Department Name */}
          <CardTitle className="text-base font-bold text-foreground line-clamp-1">
            {department.name}
          </CardTitle>
          {/* Associated Product Name or placeholder for Coming Soon */}
          <p className="text-sm text-muted-foreground line-clamp-1">
            {arrival === "comingSoon" ? "Product Coming Soon" : name || "N/A"}
          </p>
          {/* Price Information (or placeholder for Coming Soon) */}
          <div className="flex items-center gap-1">
            <span className="text-base font-bold text-accent">
              ₹{arrival === "comingSoon" ? "N/A" : price}
            </span>
            {originalPrice && arrival !== "comingSoon" && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default DepartmentProductCard;
