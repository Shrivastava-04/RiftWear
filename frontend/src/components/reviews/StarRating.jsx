import { Star, StarHalf, StarOff } from "lucide-react";

const StarRating = ({ rating = 0, size = "h-5 w-5" }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center text-amber-400">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="currentColor" className={size} />
      ))}
      {halfStar && <StarHalf fill="currentColor" className={size} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={`${size} text-gray-300`} />
      ))}
    </div>
  );
};

export default StarRating;
