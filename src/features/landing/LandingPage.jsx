import { Link } from "react-router-dom";
import { categories, landingSteps, trustSignals } from "../../data/mockData.js";
import AppIcon from "../../components/ui/AppIcon.jsx";
import { paths } from "../../routes/paths.js";

function StepCard({ step }) {
  return (
    <article className="step-card card card-hover">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <span className="step-number">{step.number}</span>
        <span className="icon-tile">
          <AppIcon name={step.icon} size={23} />
        </span>
      </div>
      <h3>{step.title}</h3>
      <p className="small-muted">{step.description}</p>
    </article>
  );
}

function TrustCard({ item }) {
  return (
    <article className="trust-card card">
      <span className="icon-tile green">
        <AppIcon name={item.icon} size={26} />
      </span>
      <h3>{item.title}</h3>
      <p className="small-muted">{item.description}</p>
    </article>
  );
}

export default function LandingPage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>Find trusted craftsmen near you</h1>
            <p className="hero-copy">
              Connect with verified electricians, plumbers, painters, HVAC specialists, and more. Scope the work clearly, agree on pricing, and keep every booking accountable.
            </p>
            <div className="hero-actions">
              <Link className="btn-primary" to={paths.login} state={{ requiredRole: "client" }}>
                <AppIcon name="Search" size={18} />
                I need a service
              </Link>
              <Link className="btn-secondary" to={paths.login} state={{ requiredRole: "provider" }}>
                <AppIcon name="Briefcase" size={18} />
                I'm a craftsman
              </Link>
            </div>
          </div>

          <aside className="hero-panel" aria-label="Booking preview">
            <div className="hero-request">
              <div className="hero-request-header">
                <div>
                  <p className="hero-request-title">Kitchen lighting repair</p>
                  <span className="small-muted">Matched with Marcus Chen</span>
                </div>
                <span className="badge green">Verified</span>
              </div>
              <div className="hero-request-row"><span>Response</span><strong>~2 hours</strong></div>
              <div className="hero-request-row"><span>Rating</span><strong>4.8 from 47 reviews</strong></div>
              <div className="hero-request-row"><span>Agreement</span><strong>Scope + estimate locked</strong></div>
              <Link className="btn-primary" to={paths.login} state={{ requiredRole: "client" }}>View matched pros</Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading centered">
            <h2 className="section-title">How Servix works</h2>
            <p className="section-copy">A simple workflow from search to satisfaction, with less back-and-forth and clearer expectations.</p>
          </div>
          <div className="steps-grid">
            {landingSteps.map((step) => <StepCard key={step.number} step={step} />)}
          </div>
        </div>
      </section>

      <section className="section white-band">
        <div className="container">
          <div className="section-heading centered">
            <h2 className="section-title">Popular services</h2>
            <p className="section-copy">Browse quality professionals across the trades homeowners book most often.</p>
          </div>
          <div className="service-grid">
            {categories.filter((category) => category.id !== "all").map((category) => (
              <div key={category.id} className="service-tile">
                <span className="icon-tile">
                  <AppIcon name={category.icon} size={25} />
                </span>
                {category.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="trust-grid">
            {trustSignals.map((item) => <TrustCard key={item.title} item={item} />)}
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container centered">
          <h2 className="section-title" style={{ color: "white" }}>Ready to get started?</h2>
          <p className="section-copy" style={{ color: "#cbd5e1", maxWidth: 620, margin: "0 auto 26px" }}>
            Search local craftsmen or manage provider requests from the same polished Servix workspace.
          </p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link className="btn-primary" to={paths.login} state={{ requiredRole: "client" }}>Find a Craftsman</Link>
            <Link className="btn-secondary" to={paths.login} state={{ requiredRole: "provider" }}>Join as Pro</Link>
          </div>
        </div>
      </section>
    </>
  );
}
