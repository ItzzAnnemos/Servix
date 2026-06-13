import { Link } from "react-router-dom";
import { categories } from "../../data/mockData.js";
import { getCategory } from "../../utils/formatters.js";
import AppIcon from "../../components/ui/AppIcon.jsx";
import Avatar from "../../components/ui/Avatar.jsx";
import Badge from "../../components/ui/Badge.jsx";
import StarRating from "../../components/ui/StarRating.jsx";
import { paths } from "../../routes/paths.js";

function RatingBreakdown({ craftsman }) {
  const totalReviews = Object.values(craftsman.ratingBreakdown).reduce((sum, count) => sum + count, 0);

  return (
    <aside className="profile-panel card">
      <h3>Rating Breakdown</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <strong style={{ fontSize: 42, lineHeight: 1 }}>{craftsman.rating}</strong>
        <div>
          <StarRating rating={craftsman.rating} />
          <div className="small-muted">{craftsman.reviewCount} reviews</div>
        </div>
      </div>
      {[5, 4, 3, 2, 1].map((star) => {
        const count = craftsman.ratingBreakdown[star] ?? 0;
        const width = totalReviews ? `${(count / totalReviews) * 100}%` : "0%";
        return (
          <div key={star} className="rating-bar">
            <span>{star} star</span>
            <span className="bar-track"><span className="bar-fill" style={{ width }} /></span>
            <span>{count}</span>
          </div>
        );
      })}
    </aside>
  );
}

function Reviews({ reviews }) {
  return (
    <section className="profile-panel card">
      <h2>Recent Reviews</h2>
      {reviews.map((review) => (
        <article key={review.id} className="review-card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Avatar name={review.author} size="sm" />
              <div>
                <strong>{review.author}</strong>
                <div className="small-muted">{review.date}</div>
              </div>
            </div>
            <StarRating rating={review.rating} size={14} />
          </div>
          <p style={{ margin: 0, color: "var(--slate-600)", lineHeight: 1.6 }}>{review.text}</p>
        </article>
      ))}
    </section>
  );
}

function normalizeGalleryItem(item) {
  return typeof item === "string" ? { title: item, image: null } : item;
}

export default function CraftsmanProfilePage({ craftsman, backTo = paths.browse, backLabel = "Back to search", showBackLink = true, showBookingAction = true }) {
  if (!craftsman) {
    return (
      <div className="narrow-container section">
        {showBackLink && (
          <Link className="back-button" to={backTo}>
            <AppIcon name="ArrowLeft" size={16} />
            {backLabel}
          </Link>
        )}
        <div className="empty-state card">
          <h2>No craftsman selected</h2>
          <p className="page-copy">Choose a professional from browse to view their profile.</p>
        </div>
      </div>
    );
  }

  const category = getCategory(categories, craftsman.category);

  return (
    <div className="container section">
      {showBackLink && (
        <Link className="back-button" to={backTo}>
          <AppIcon name="ArrowLeft" size={16} />
          {backLabel}
        </Link>
      )}

      <section className="card">
        <div className="profile-cover" />
        <div className="profile-card-body">
          <div className="profile-heading">
            <div className="person-line">
              <Avatar name={craftsman.name} size="lg" />
              <div>
                <div className="profile-title-row">
                  <h1 className="page-title" style={{ margin: 0 }}>{craftsman.name}</h1>
                  <Badge color={craftsman.available ? "green" : "amber"}>{craftsman.availability}</Badge>
                </div>
                <div className="craftsman-meta" style={{ marginTop: 8 }}>
                  {category?.label} · {craftsman.location} · {craftsman.experience} years experience
                </div>
              </div>
            </div>
            {showBookingAction && (
              <Link className="btn-primary" to={paths.bookCraftsman(craftsman.id)}>
                <AppIcon name="Calendar" size={17} />
                Book Service
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="profile-main">
        <div className="profile-stack">
          <section className="profile-panel card">
            <h2>About</h2>
            <p style={{ margin: 0, color: "var(--slate-600)", lineHeight: 1.75 }}>{craftsman.bio}</p>
          </section>

          <section className="profile-panel card">
            <h2>Services Offered</h2>
            <div className="two-column-list">
              {craftsman.services.map((service) => (
                <div key={service} className="service-row">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                    <span className="icon-tile" style={{ width: 32, height: 32 }}>
                      <AppIcon name="Check" size={15} />
                    </span>
                    {service}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="profile-panel card">
            <h2>Work Gallery</h2>
            <div className="gallery-grid">
              {craftsman.gallery.map((entry) => {
                const item = normalizeGalleryItem(entry);

                return (
                  <figure key={item.title} className="gallery-item">
                    {item.image && <img className="gallery-image" src={item.image} alt={item.title} loading="lazy" />}
                    <figcaption>{item.title}</figcaption>
                  </figure>
                );
              })}
            </div>
          </section>

          <Reviews reviews={craftsman.reviews} />
        </div>

        <div className="profile-stack profile-sidebar">
          <RatingBreakdown craftsman={craftsman} />
          <section className="profile-panel card">
            <h3>Quick Stats</h3>
            <div className="profile-stack">
              <div className="stat-row"><span>Jobs Completed</span><strong>{craftsman.completedJobs}</strong></div>
              <div className="stat-row"><span>Rate</span><strong>{craftsman.priceRange}</strong></div>
              <div className="stat-row"><span>Response</span><strong>{craftsman.responseTime}</strong></div>
            </div>
          </section>
          <section className="profile-panel card">
            <h3>Contact</h3>
            <div className="profile-stack">
              <button className="btn-secondary">
                <AppIcon name="Phone" size={16} />
                (555) 123-4567
              </button>
              <button className="btn-secondary">
                <AppIcon name="Mail" size={16} />
                message@servix.app
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
