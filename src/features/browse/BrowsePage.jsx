import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "../../data/mockData.js";
import AppIcon from "../../components/ui/AppIcon.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import CraftsmanCard from "./CraftsmanCard.jsx";
import { paths } from "../../routes/paths.js";

export default function BrowsePage({ craftsmen }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("rating");
  const [availableOnly, setAvailableOnly] = useState(false);

  const filteredCraftsmen = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...craftsmen]
      .filter((craftsman) => {
        const matchesSearch = !query ||
          craftsman.name.toLowerCase().includes(query) ||
          craftsman.bio.toLowerCase().includes(query) ||
          craftsman.services.some((service) => service.toLowerCase().includes(query));
        const matchesCategory = activeCategory === "all" || craftsman.category === activeCategory;
        const matchesRating = craftsman.rating >= minRating;
        const matchesAvailability = !availableOnly || craftsman.available;
        return matchesSearch && matchesCategory && matchesRating && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === "experience") return b.experience - a.experience;
        if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
        if (sortBy === "distance") return Number.parseFloat(a.location.match(/[\d.]+/)?.[0] ?? "99") - Number.parseFloat(b.location.match(/[\d.]+/)?.[0] ?? "99");
        return b.rating - a.rating;
      });
  }, [activeCategory, availableOnly, craftsmen, minRating, search, sortBy]);

  return (
    <div className="container section">
      <div className="page-header">
        <div>
          <h1 className="page-title">Find a craftsman</h1>
          <p className="page-copy">Browse {craftsmen.length} verified professionals, compare strengths, and book with clear expectations.</p>
        </div>
        <Link className="btn-secondary" to={paths.bookings}>
          <AppIcon name="Clipboard" size={17} />
          My Bookings
        </Link>
      </div>

      <div className="browse-layout">
        <aside className="filter-panel card">
          <div className="search-field" style={{ marginBottom: 18 }}>
            <AppIcon name="Search" size={18} />
            <input className="input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search service, name, or keyword" />
          </div>

          <label className="field-label">Service category</label>
          <div className="chip-list" style={{ marginBottom: 20 }}>
            {categories.map((category) => (
              <button key={category.id} className={`chip ${activeCategory === category.id ? "active" : ""}`} onClick={() => setActiveCategory(category.id)}>
                <AppIcon name={category.icon} size={15} />
                {category.label}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <label className="field-label" htmlFor="sortBy">Sort results</label>
              <select id="sortBy" className="select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="rating">Top rated</option>
                <option value="experience">Most experienced</option>
                <option value="reviews">Most reviews</option>
                <option value="distance">Nearest</option>
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="minRating">Minimum rating</label>
              <select id="minRating" className="select" value={minRating} onChange={(event) => setMinRating(Number(event.target.value))}>
                <option value={0}>Any rating</option>
                <option value={4.5}>4.5+ stars</option>
                <option value={4}>4.0+ stars</option>
                <option value={3}>3.0+ stars</option>
              </select>
            </div>
            <label className="check-tile" style={{ justifyContent: "flex-start" }}>
              <input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} />
              Available soon
            </label>
          </div>
        </aside>

        <section className="results-panel">
          <div className="results-toolbar">
            <div>
              <strong>{filteredCraftsmen.length} result{filteredCraftsmen.length === 1 ? "" : "s"}</strong>
              <div className="small-muted">Filtered by category, rating, availability, and service keywords.</div>
            </div>
            <button className="btn-secondary" onClick={() => {
              setSearch("");
              setActiveCategory("all");
              setMinRating(0);
              setSortBy("rating");
              setAvailableOnly(false);
            }}>
              <AppIcon name="Filter" size={16} />
              Reset
            </button>
          </div>

          {filteredCraftsmen.length > 0 ? (
            <div className="craftsman-grid">
              {filteredCraftsmen.map((craftsman) => <CraftsmanCard key={craftsman.id} craftsman={craftsman} />)}
            </div>
          ) : (
            <EmptyState icon="Search" title="No craftsmen found" message="Try a broader keyword, lower rating threshold, or another category." />
          )}
        </section>
      </div>
    </div>
  );
}
