// import React from "react";
// import { Link } from "react-router-dom";
// import { Card, CardContent, CardTitle } from "@/components/ui/card";
// import comingSoonImage from "../assets/coming soon image 2.png"; // Assuming your coming soon image path

// const DepartmentProductCard = ({ department, arrival }) => {
//   if (!department) {
//     return null;
//   }

//   // Safely access the first product from the populated productId array
//   const firstProduct =
//     department.productId && department.productId.length > 0
//       ? department.productId[0]
//       : null;

//   // Destructure product details if a product exists, otherwise provide defaults
//   const {
//     _id,
//     name,
//     price,
//     originalPrice,
//     images,
//     isNew = false,
//     onSale = false,
//   } = firstProduct || {};

//   // Determine the image source based on arrival status
//   const imageSrc =
//     arrival === "comingSoon"
//       ? comingSoonImage
//       : images?.[0] || "https://placehold.co/400x400/333/FFF?text=No+Image";
//   const altText =
//     arrival === "comingSoon" ? "Coming Soon" : name || "Product Image";
//   const linkTo = arrival === "comingSoon" ? "#" : `/product/${_id}`;

//   return (
//     <Card className="group flex-shrink-0 w-56 bg-card/50 border-border/50 overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:cursor-pointer">
//       <Link
//         to={linkTo}
//         className={arrival === "comingSoon" ? "pointer-events-none" : ""}
//       >
//         <div className="relative overflow-hidden">
//           <img
//             src={imageSrc}
//             alt={altText}
//             className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
//           />
//           {arrival !== "comingSoon" && (
//             <div className="absolute top-2 left-2 flex flex-col gap-1">
//               {isNew && (
//                 <span className="bg-accent text-accent-foreground px-1.5 py-0.5 text-[0.7rem] font-semibold rounded">
//                   NEW
//                 </span>
//               )}
//               {onSale && (
//                 <span className="bg-destructive text-destructive-foreground px-1.5 py-0.5 text-[0.7rem] font-semibold rounded">
//                   SALE
//                 </span>
//               )}
//             </div>
//           )}
//         </div>
//         <CardContent className="p-3 space-y-1">
//           <CardTitle className="text-base font-bold text-foreground line-clamp-1">
//             {department.name}
//           </CardTitle>
//           <p className="text-sm text-muted-foreground line-clamp-1">
//             {arrival === "comingSoon" ? "Product Coming Soon" : name || "N/A"}
//           </p>
//           <div className="flex items-center gap-1">
//             <span className="text-base font-bold text-accent">
//               ₹{arrival === "comingSoon" ? "N/A" : price}
//             </span>
//             {originalPrice && arrival !== "comingSoon" && (
//               <span className="text-sm text-muted-foreground line-through">
//                 ₹{originalPrice}
//               </span>
//             )}
//           </div>
//         </CardContent>
//       </Link>
//     </Card>
//   );
// };

// export default DepartmentProductCard;
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import comingSoonImage from "../assets/coming soon image 2.png";

const DepartmentProductCard = ({ department, arrival }) => {
  if (!department) {
    return null;
  }

  // console.log(department);

  const firstProduct =
    department.productId && department.productId.length > 0
      ? department.productId[0]
      : null;

  // --- UPDATED: Destructuring logic to handle variants ---
  // Get top-level details from the product
  const {
    _id,
    name,
    images,
    isNew = false,
    onSale = false,
  } = firstProduct || {};

  // Get price details from the FIRST VARIANT of the product
  const price = firstProduct?.variants?.[0]?.price;
  const originalPrice = firstProduct?.variants?.[0]?.originalPrice;
  // ----------------------------------------------------
  // console.log(price, originalPrice);
  const imageSrc =
    arrival === "comingSoon"
      ? comingSoonImage
      : images?.[0] || "https://placehold.co/400x400/333/FFF?text=No+Image";
  const altText =
    arrival === "comingSoon" ? "Coming Soon" : name || "Product Image";
  const linkTo = arrival === "comingSoon" ? "#" : `/product/${_id}`;

  return (
    <Card className="group flex-shrink-0 w-56 bg-card/50 border-border/50 overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:cursor-pointer">
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
          <CardTitle className="text-base font-bold text-foreground line-clamp-1">
            {department.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {arrival === "comingSoon" ? "Product Coming Soon" : name || "N/A"}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-base font-bold text-accent">
              {/* This will now display the correct variant price */}₹
              {arrival === "comingSoon" || !price ? "N/A" : price.toFixed(2)}
            </span>
            {originalPrice && arrival !== "comingSoon" && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default DepartmentProductCard;
