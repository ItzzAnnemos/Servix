import AppIcon from "./AppIcon.jsx";

export default function StatCard({ label, value, icon, tone = "blue" }) {
  return (
    <div className="stat-card card">
      <span className={`icon-tile ${tone === "green" ? "green" : ""}`}>
        <AppIcon name={icon} size={21} />
      </span>
      <div className="stat-value">{value}</div>
      <div className="small-muted">{label}</div>
    </div>
  );
}
