import { Link } from "react-router-dom";
import { categories } from "../../data/mockData.js";
import { getCategory } from "../../utils/formatters.js";
import AppIcon from "../../components/ui/AppIcon.jsx";
import Avatar from "../../components/ui/Avatar.jsx";
import Badge from "../../components/ui/Badge.jsx";
import StarRating from "../../components/ui/StarRating.jsx";
import { paths } from "../../routes/paths.js";

export default function CraftsmanCard({ craftsman }) {
  const category = getCategory(categories, craftsman.category);

  return (
    <article className="craftsman-card card card-hover">
      <div className="craftsman-card-body">
        <div className="craftsman-card-top">
          <div className="person-line">
            <Avatar name={craftsman.name} size="md" />
            <div>
              <h3>{craftsman.name}</h3>
              <div className="craftsman-meta">{category?.label} · {craftsman.experience} yrs exp</div>
            </div>
          </div>
          <Badge color={craftsman.available ? "green" : "amber"}>{craftsman.available ? "Available" : "Limited"}</Badge>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <StarRating rating={craftsman.rating} size={15} showValue />
          <span className="small-muted">({craftsman.reviewCount} reviews)</span>
          <span className="small-muted">·</span>
          <span className="small-muted">{craftsman.location}</span>
        </div>

        <p className="craftsman-description">{craftsman.bio}</p>

        <div className="tag-list">
          {craftsman.services.slice(0, 3).map((service) => <span key={service} className="tag">{service}</span>)}
          {craftsman.services.length > 3 && <span className="tag">+{craftsman.services.length - 3} more</span>}
        </div>
      </div>

      <div className="card-footer">
        <span className="price">{craftsman.priceRange}</span>
        <div className="button-row">
          <Link className="btn-ghost" to={paths.craftsman(craftsman.id)}>View Profile</Link>
          <Link className="btn-primary" to={paths.bookCraftsman(craftsman.id)}>
            <AppIcon name="Calendar" size={16} />
            Book
          </Link>
        </div>
      </div>
    </article>
  );
}
