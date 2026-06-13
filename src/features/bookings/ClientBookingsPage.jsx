import { Link } from "react-router-dom";
import AppIcon from "../../components/ui/AppIcon.jsx";
import Avatar from "../../components/ui/Avatar.jsx";
import Badge from "../../components/ui/Badge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { getStatusBadge, labelStatus } from "../../utils/formatters.js";
import { paths } from "../../routes/paths.js";

export default function ClientBookingsPage({ bookings, craftsmen }) {
  return (
    <div className="container section">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Bookings</h1>
          <p className="page-copy">Track service requests, review completed work, and return to provider profiles quickly.</p>
        </div>
        <Link className="btn-primary" to={paths.browse}>
          <AppIcon name="Search" size={17} />
          Find a Pro
        </Link>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon="Clipboard"
          title="No bookings yet"
          message="Find a craftsman and create your first service agreement."
          action={<Link className="btn-primary" to={paths.browse}>Browse Craftsmen</Link>}
        />
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => {
            const craftsman = craftsmen.find((item) => item.id === booking.craftsmanId);
            return (
              <article key={booking.id} className="booking-card card">
                <div className="booking-card-top">
                  <div className="person-line">
                    <Avatar name={craftsman?.name ?? "Unknown"} size="sm" />
                    <div>
                      <h3>{craftsman?.name}</h3>
                      <div className="small-muted">{booking.service}</div>
                    </div>
                  </div>
                  <Badge color={getStatusBadge(booking.status)}>{labelStatus(booking.status)}</Badge>
                </div>
                <div className="meta-grid">
                  <span className="meta-item"><AppIcon name="Calendar" size={15} />{booking.date}</span>
                  <span className="meta-item"><AppIcon name="Clock" size={15} />{booking.time}</span>
                  <span className="meta-item"><AppIcon name="DollarSign" size={15} />{booking.price}</span>
                </div>
                <p className="summary-box" style={{ margin: "0 0 16px", color: "var(--slate-600)" }}>{booking.description}</p>
                <div className="button-row">
                  {booking.status === "completed" && !booking.reviewed && (
                    <Link className="btn-trust" to={paths.reviewBooking(booking.id)}>
                      <AppIcon name="Star" size={15} />
                      Leave Review
                    </Link>
                  )}
                  {booking.status === "completed" && booking.reviewed && (
                    <span className="badge slate"><AppIcon name="Check" size={14} />Reviewed</span>
                  )}
                  {craftsman && <Link className="btn-ghost" to={paths.craftsman(craftsman.id)}>View Profile</Link>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
