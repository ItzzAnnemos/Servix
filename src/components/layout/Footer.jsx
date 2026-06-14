import { Link } from "react-router-dom";
import { paths } from "../../routes/paths.js";
import AppIcon from "../ui/AppIcon.jsx";

export default function Footer({ currentUser }) {
  const isProvider = currentUser?.role === "provider";

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand-button" style={{ color: "white", marginBottom: 14 }}>
              <span className="brand-mark">
                <AppIcon name="Wrench" size={18} />
              </span>
              Servix
            </div>
            <p>Connecting homeowners with trusted local craftsmen through clear scope, pricing, and verified reviews.</p>
          </div>
          {isProvider ? (
            <>
              <div>
                <h4>For Craftsmen</h4>
                <ul>
                  <li><Link className="footer-link" to={paths.dashboard}>Dashboard</Link></li>
                  <li><Link className="footer-link" to={paths.providerProfile}>Profile</Link></li>
                  <li><Link className="footer-link" to={paths.home}>How it Works</Link></li>
                </ul>
              </div>
              <div>
                <h4>Account</h4>
                <ul>
                  <li><Link className="footer-link" to={paths.login}>Switch Role</Link></li>
                  <li><Link className="footer-link" to={paths.home}>Public Home</Link></li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4>For Clients</h4>
                <ul>
                  <li><Link className="footer-link" to={paths.browse}>Find a Pro</Link></li>
                  <li><Link className="footer-link" to={paths.bookings}>My Bookings</Link></li>
                  <li><Link className="footer-link" to={paths.home}>How it Works</Link></li>
                </ul>
              </div>
              <div>
                <h4>Account</h4>
                <ul>
                  <li><Link className="footer-link" to={paths.login}>Switch Role</Link></li>
                  <li><Link className="footer-link" to={paths.home}>Public Home</Link></li>
                </ul>
              </div>
            </>
          )}
          <div>
            <h4>Support</h4>
            <ul>
              <li><button className="footer-link">Help Center</button></li>
              <li><button className="footer-link">Safety</button></li>
              <li><button className="footer-link">Contact Us</button></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">© 2026 Servix. Demo MVP for presentation purposes.</div>
      </div>
    </footer>
  );
}
