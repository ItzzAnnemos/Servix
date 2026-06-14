import { Link, NavLink, useMatch } from "react-router-dom";
import { paths } from "../../routes/paths.js";
import AppIcon from "../ui/AppIcon.jsx";

function NavButton({ icon, label, to, onClick }) {
  return (
    <NavLink className={({ isActive }) => `nav-button ${isActive ? "active" : ""}`} to={to} onClick={onClick}>
      <AppIcon name={icon} size={17} />
      {label}
    </NavLink>
  );
}

function MobileNavButton({ icon, label, to, onClick }) {
  return (
    <NavLink className="mobile-nav-button" to={to} onClick={onClick}>
      <AppIcon name={icon} size={18} />
      {label}
    </NavLink>
  );
}

export default function Navbar({ currentUser, mobileMenuOpen, setMobileMenuOpen }) {
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const dashboardMatch = useMatch(`${paths.dashboard}/*`);
  const isProvider = currentUser?.role === "provider" || Boolean(dashboardMatch);
  const isClient = currentUser?.role === "client";

  return (
    <nav className="glass-nav">
      <div className="container">
        <div className="nav-inner">
          <Link className="brand-button" to={paths.home} onClick={closeMobileMenu}>
            <span className="brand-mark">
              <AppIcon name="Wrench" size={18} />
            </span>
            Servix
          </Link>

          <div className="desktop-nav">
            {isClient && <NavButton icon="Search" label="Find Pros" to={paths.browse} />}
            {isClient && <NavButton icon="Clipboard" label="My Bookings" to={paths.bookings} />}
            {isProvider && <NavButton icon="Briefcase" label="Dashboard" to={paths.dashboard} />}
          </div>

          <div className="desktop-actions">
            <span className="session-pill">
              <AppIcon name={isProvider ? "Briefcase" : "User"} size={15} />
              {currentUser?.name ?? "Guest"}
            </span>
            <Link className="btn-ghost" to={paths.login}>Switch Role</Link>
          </div>

          <button className="mobile-toggle" onClick={() => setMobileMenuOpen((open) => !open)} aria-label="Toggle menu">
            <AppIcon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        {isClient && <MobileNavButton icon="Search" label="Find Pros" to={paths.browse} onClick={closeMobileMenu} />}
        {isClient && <MobileNavButton icon="Clipboard" label="My Bookings" to={paths.bookings} onClick={closeMobileMenu} />}
        {isProvider && <MobileNavButton icon="Briefcase" label="Dashboard" to={paths.dashboard} onClick={closeMobileMenu} />}
        <MobileNavButton icon="LogOut" label="Switch Role" to={paths.login} onClick={closeMobileMenu} />
      </div>
    </nav>
  );
}
