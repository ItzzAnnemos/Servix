import AppIcon from "./AppIcon.jsx";

export default function EmptyState({ icon = "Search", title, message, action }) {
  return (
    <div className="empty-state card">
      <span className="empty-icon">
        <AppIcon name={icon} size={34} />
      </span>
      <h3>{title}</h3>
      <p className="page-copy">{message}</p>
      {action && <div style={{ marginTop: 18 }}>{action}</div>}
    </div>
  );
}
