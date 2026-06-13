import { useState } from "react";
import { Link } from "react-router-dom";
import AppIcon from "../../components/ui/AppIcon.jsx";
import Avatar from "../../components/ui/Avatar.jsx";
import { paths } from "../../routes/paths.js";

export default function ReviewPage({ booking, craftsman, addReview }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!booking || !craftsman) return null;

  function handleSubmit() {
    if (!rating) return;
    addReview(craftsman.id, {
      id: Date.now(),
      author: "Demo User",
      rating,
      date: "Just now",
      text: comment || "Great service and clear communication.",
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="narrow-container section">
        <div className="success-state">
          <span className="success-icon"><AppIcon name="ThumbsUp" size={38} /></span>
          <h1 className="page-title">Thank you</h1>
          <p className="page-copy">Your review helps other clients choose the right craftsman.</p>
          <div className="button-row" style={{ justifyContent: "center", marginTop: 24 }}>
            <Link className="btn-primary" to={paths.bookings}>Back to My Bookings</Link>
            <Link className="btn-secondary" to={paths.browse}>Browse More Pros</Link>
          </div>
        </div>
      </div>
    );
  }

  const label = ["Tap a star to rate", "Poor", "Fair", "Good", "Very good", "Excellent"][rating];

  return (
    <div className="narrow-container section">
      <Link className="back-button" to={paths.bookings}>
        <AppIcon name="ArrowLeft" size={16} />
        Back to bookings
      </Link>

      <h1 className="page-title">Rate your experience</h1>
      <p className="page-copy">How was your service with {craftsman.name}?</p>

      <section className="form-panel card profile-stack" style={{ marginTop: 24 }}>
        <div className="summary-box">
          <div className="person-line">
            <Avatar name={craftsman.name} size="sm" />
            <div>
              <strong>{craftsman.name}</strong>
              <div className="small-muted">{booking.service} · {booking.date}</div>
            </div>
          </div>
        </div>

        <div>
          <label className="field-label">Your Rating</label>
          <div style={{ display: "flex", gap: 6 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star-button ${star <= (hoverRating || rating) ? "active" : ""}`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                aria-label={`${star} stars`}
              >
                <AppIcon name="Star" size={38} fill={star <= (hoverRating || rating) ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          <p className="small-muted">{label}</p>
        </div>

        <div>
          <label className="field-label" htmlFor="reviewComment">Your Review (optional)</label>
          <textarea id="reviewComment" className="textarea" rows={5} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="What went well? What could be improved?" />
        </div>

        <button className="btn-primary" disabled={!rating} onClick={handleSubmit}>
          <AppIcon name="Send" size={16} />
          Submit Review
        </button>
      </section>
    </div>
  );
}
