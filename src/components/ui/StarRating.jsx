import AppIcon from "./AppIcon.jsx";

export default function StarRating({ rating, size = 16, showValue = false }) {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1);

  return (
    <span className="rating" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {stars.map((star) => (
        <AppIcon
          key={star}
          name="Star"
          size={size}
          fill={star <= Math.round(rating) ? "currentColor" : "none"}
          className={star <= Math.round(rating) ? "" : "muted-star"}
        />
      ))}
      {showValue && <span className="rating-value">{rating.toFixed(1)}</span>}
    </span>
  );
}
