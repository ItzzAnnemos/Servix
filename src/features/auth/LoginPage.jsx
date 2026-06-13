import { useLocation, useNavigate } from "react-router-dom";
import AppIcon from "../../components/ui/AppIcon.jsx";
import { paths } from "../../routes/paths.js";

const demoUsers = {
  client: {
    role: "client",
    name: "Demo Homeowner",
    description: "Browse craftsmen, manage bookings, and leave reviews.",
    icon: "User",
    nextPath: paths.browse,
  },
  provider: {
    role: "provider",
    name: "Marcus Chen",
    description: "Manage service requests, availability, and your public profile.",
    icon: "Briefcase",
    nextPath: paths.dashboard,
  },
};

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const requestedRole = location.state?.requiredRole;
  const redirectTo = location.state?.from?.pathname;

  function signInAs(role) {
    const user = demoUsers[role];
    onLogin(user);
    navigate(redirectTo ?? user.nextPath, { replace: true });
  }

  return (
    <main className="login-page">
      <div className="login-shell">
        <div className="login-copy">
          <span className="brand-mark">
            <AppIcon name="Wrench" size={18} />
          </span>
          <h1>Sign in to Servix</h1>
          <p>
            Choose a demo role to enter the right workspace. Client and craftsman routes stay separated so the navigation stays focused.
          </p>
          {requestedRole && (
            <div className="notice-box">
              <AppIcon name="Info" size={18} />
              <span>That page is for {requestedRole === "provider" ? "craftsmen" : "clients"}. Sign in with the matching role to continue.</span>
            </div>
          )}
        </div>

        <section className="login-options" aria-label="Demo sign in options">
          {Object.values(demoUsers).map((user) => (
            <button key={user.role} className="login-option card card-hover" onClick={() => signInAs(user.role)}>
              <span className="icon-tile">
                <AppIcon name={user.icon} size={24} />
              </span>
              <span>
                <strong>{user.role === "client" ? "Continue as Homeowner" : "Continue as Craftsman"}</strong>
                <small>{user.description}</small>
              </span>
              <AppIcon name="ArrowRight" size={18} />
            </button>
          ))}
        </section>
      </div>
    </main>
  );
}
