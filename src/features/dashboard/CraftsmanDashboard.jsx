import { useState } from "react";
import { Link } from "react-router-dom";
import AppIcon from "../../components/ui/AppIcon.jsx";
import Avatar from "../../components/ui/Avatar.jsx";
import Badge from "../../components/ui/Badge.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import { getStatusBadge, labelStatus } from "../../utils/formatters.js";
import { paths } from "../../routes/paths.js";

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
        <Link className="btn-secondary" to={paths.providerProfile}>
          <AppIcon name="User" size={17} />
          Preview Profile
        </Link>
      </div>

      <div className="dashboard-grid">
        <StatCard label="Total Jobs" value={provider.completedJobs} icon="Briefcase" />
        <StatCard label="Rating" value={provider.rating} icon="Star" />
        <StatCard label="Pending Requests" value={pendingCount} icon="Clock" />
        <StatCard label="Accepted This Week" value={acceptedCount} icon="CheckCircle" tone="green" />
      </div>

      <section className="request-list" aria-label="Booking requests">
        {requests.map((request) => <RequestCard key={request.id} request={request} onAction={handleAction} />)}
      </section>
    </div>
  );
}
