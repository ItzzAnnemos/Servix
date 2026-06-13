import { useState } from "react";
import AppIcon from "../../components/ui/AppIcon.jsx";
import Avatar from "../../components/ui/Avatar.jsx";
import Badge from "../../components/ui/Badge.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import { getStatusBadge, labelStatus } from "../../utils/formatters.js";

function TabButton({ active, children, onClick }) {
  return <button className={`tab-button ${active ? "active" : ""}`} onClick={onClick}>{children}</button>;
}

function RequestCard({ request, onAction }) {
  return (
    <article className="dashboard-request card">
      <div className="dashboard-request-top">
        <div className="person-line">
          <Avatar name={request.clientName} size="sm" />
          <div>
            <h3>{request.clientName}</h3>
            <div className="small-muted">{request.service}</div>
          </div>
        </div>
        <Badge color={getStatusBadge(request.status)}>{labelStatus(request.status)}</Badge>
      </div>
      <div className="meta-grid">
        <span className="meta-item"><AppIcon name="Calendar" size={15} />{request.date}</span>
        <span className="meta-item"><AppIcon name="Clock" size={15} />{request.time}</span>
        <span className="meta-item"><AppIcon name="DollarSign" size={15} />{request.price}</span>
      </div>
      <p className="summary-box" style={{ margin: 0, color: "var(--slate-600)" }}>{request.description}</p>
      {request.status === "pending" && (
        <div className="button-row" style={{ marginTop: 16 }}>
          <button className="btn-trust" onClick={() => onAction(request.id, "accepted")}>
            <AppIcon name="Check" size={16} />
            Accept
          </button>
          <button className="btn-danger" onClick={() => onAction(request.id, "declined")}>
            <AppIcon name="X" size={16} />
            Decline
          </button>
        </div>
      )}
    </article>
  );
}

export default function CraftsmanDashboard({ provider, initialBookings }) {
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState(initialBookings);
  const pendingCount = requests.filter((request) => request.status === "pending").length;
  const acceptedCount = requests.filter((request) => request.status === "accepted").length;

  function handleAction(id, status) {
    setRequests((current) => current.map((request) => (request.id === id ? { ...request, status } : request)));
  }

  return (
    <div className="container section">
      <div className="page-header">
        <div>
          <h1 className="page-title">Craftsman Dashboard</h1>
          <p className="page-copy">Manage incoming requests, profile details, availability, and service terms.</p>
        </div>
        <button className="btn-secondary">
          <AppIcon name="User" size={17} />
          Preview Profile
        </button>
      </div>

      <div className="dashboard-grid">
        <StatCard label="Total Jobs" value={provider.completedJobs} icon="Briefcase" />
        <StatCard label="Rating" value={provider.rating} icon="Star" />
        <StatCard label="Pending Requests" value={pendingCount} icon="Clock" />
        <StatCard label="Accepted This Week" value={acceptedCount} icon="CheckCircle" tone="green" />
      </div>

      <div className="tabs" role="tablist">
        <TabButton active={activeTab === "requests"} onClick={() => setActiveTab("requests")}>Booking Requests</TabButton>
        <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")}>Profile Editor</TabButton>
      </div>

      {activeTab === "requests" && (
        <section className="request-list">
          {requests.map((request) => <RequestCard key={request.id} request={request} onAction={handleAction} />)}
        </section>
      )}

      {activeTab === "profile" && (
        <section className="form-panel card profile-stack">
          <div className="person-line">
            <Avatar name={provider.name} size="md" />
            <div>
              <h2 style={{ margin: 0 }}>{provider.name}</h2>
              <p className="small-muted" style={{ margin: "4px 0 0" }}>Keep this profile clear, specific, and easy to compare.</p>
            </div>
          </div>

          <div className="profile-editor-grid">
            <div>
              <label className="field-label" htmlFor="displayName">Display Name</label>
              <input id="displayName" className="input" defaultValue={provider.name} />
            </div>
            <div>
              <label className="field-label" htmlFor="experience">Years of Experience</label>
              <input id="experience" className="input" type="number" defaultValue={provider.experience} />
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="providerBio">Bio</label>
            <textarea id="providerBio" className="textarea" rows={5} defaultValue={provider.bio} />
          </div>

          <div>
            <label className="field-label">Services Offered</label>
            <div className="tag-list">
              {provider.services.map((service) => (
                <span key={service} className="tag" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  {service}
                  <AppIcon name="X" size={13} />
                </span>
              ))}
              <button className="chip">+ Add Service</button>
            </div>
          </div>

          <div>
            <label className="field-label">Availability</label>
            <div className="availability-grid">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <label className="check-tile" key={day}>
                  <input type="checkbox" defaultChecked={day !== "Sun"} />
                  {day}
                </label>
              ))}
            </div>
          </div>

          <div className="button-row">
            <button className="btn-primary"><AppIcon name="Check" size={16} />Save Changes</button>
            <button className="btn-secondary">Cancel</button>
          </div>
        </section>
      )}
    </div>
  );
}
