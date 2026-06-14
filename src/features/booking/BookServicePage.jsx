import { useState } from "react";
import { Link } from "react-router-dom";
import { categories, timeSlots } from "../../data/mockData.js";
import { getCategory } from "../../utils/formatters.js";
import AppIcon from "../../components/ui/AppIcon.jsx";
import SelectMenu from "../../components/ui/SelectMenu.jsx";
import { paths } from "../../routes/paths.js";

function StepIndicator({ step }) {
  return (
    <div className="form-steps" aria-label={`Step ${step} of 3`}>
      {[1, 2, 3].map((value) => (
        <span key={value} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span className={`step-dot ${value <= step ? "active" : ""}`}>{value < step ? <AppIcon name="Check" size={15} /> : value}</span>
          {value < 3 && <span className={`step-line ${value < step ? "active" : ""}`} />}
        </span>
      ))}
    </div>
  );
}

export default function BookServicePage({ craftsman, addBooking }) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [service, setService] = useState(craftsman?.services[0] ?? "");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!craftsman) return null;

  const category = getCategory(categories, craftsman.category);

  function handleSubmit() {
    addBooking({
      id: Date.now(),
      craftsmanId: craftsman.id,
      clientName: "Demo User",
      date,
      time,
      service,
      description,
      price: price ? price.replace(/^\$/, "") : "TBD",
      status: "pending",
      reviewed: false,
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="narrow-container section">
        <div className="success-state">
          <span className="success-icon"><AppIcon name="CheckCircle" size={38} /></span>
          <h1 className="page-title">Booking request sent</h1>
          <p className="page-copy">{craftsman.name} will review your request and confirm availability.</p>
        </div>
        <div className="form-panel card">
          <h2>Booking Summary</h2>
          <div className="summary-box">
            <div className="summary-row"><span>Craftsman</span><strong>{craftsman.name}</strong></div>
            <div className="summary-row"><span>Service</span><strong>{service}</strong></div>
            <div className="summary-row"><span>Date & Time</span><strong>{date} at {time}</strong></div>
            <div className="summary-row"><span>Agreed Price</span><strong>{price ? `$${price}` : "TBD"}</strong></div>
          </div>
          <div className="button-row" style={{ marginTop: 18 }}>
            <Link className="btn-primary" to={paths.bookings}>View My Bookings</Link>
            <Link className="btn-secondary" to={paths.browse}>Back to Browse</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="narrow-container section">
      <Link className="back-button" to={paths.craftsman(craftsman.id)}>
        <AppIcon name="ArrowLeft" size={16} />
        Back to profile
      </Link>

      <h1 className="page-title">Book a service</h1>
      <p className="page-copy">With {craftsman.name} · {category?.label}</p>
      <StepIndicator step={step} />

      <section className="form-panel card">
        {step === 1 && (
          <div className="profile-stack">
            <h2>1. Select service & schedule</h2>
            <div>
              <label className="field-label" htmlFor="service">Service Type</label>
              <SelectMenu
                id="service"
                value={service}
                onChange={setService}
                options={craftsman.services.map((item) => ({ value: item, label: item }))}
              />
            </div>
            <div className="form-grid">
              <div>
                <label className="field-label" htmlFor="date">Preferred Date</label>
                <input id="date" className="input" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              </div>
              <div>
                <label className="field-label" htmlFor="time">Preferred Time</label>
                <SelectMenu
                  id="time"
                  value={time}
                  onChange={setTime}
                  options={[
                    { value: "", label: "Select time..." },
                    ...timeSlots.map((slot) => ({ value: slot, label: slot })),
                  ]}
                />
              </div>
            </div>
            <div>
              <label className="field-label" htmlFor="description">Job Description</label>
              <textarea id="description" className="textarea" rows={5} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the work, access details, materials, and any must-have timing." />
            </div>
            <button className="btn-primary" disabled={!date || !time || !description.trim()} onClick={() => setStep(2)}>
              Continue to Agreement
              <AppIcon name="ArrowRight" size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="profile-stack">
            <h2>2. Agree on terms</h2>
            <div className="summary-box">
              <div className="summary-row"><span>Craftsman</span><strong>{craftsman.name}</strong></div>
              <div className="summary-row"><span>Service</span><strong>{service}</strong></div>
              <div className="summary-row"><span>Date & Time</span><strong>{date} at {time}</strong></div>
              <div className="summary-row"><span>Scope</span><strong>{description}</strong></div>
            </div>
            <div>
              <label className="field-label" htmlFor="price">Agreed Price (optional)</label>
              <input id="price" className="input" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="e.g. 250 or TBD" />
              <p className="small-muted">Leave blank to discuss pricing with the craftsman.</p>
            </div>
            <div className="notice-box">
              <AppIcon name="Info" size={18} />
              <span>This preview keeps scope, timing, and pricing visible before work begins.</span>
            </div>
            <div className="button-row">
              <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary" onClick={() => setStep(3)}>Review & Confirm</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="profile-stack">
            <h2>3. Confirm booking</h2>
            <div className="summary-box">
              <div className="summary-row"><span>Craftsman</span><strong>{craftsman.name}</strong></div>
              <div className="summary-row"><span>Service</span><strong>{service}</strong></div>
              <div className="summary-row"><span>Date & Time</span><strong>{date} at {time}</strong></div>
              <div className="summary-row"><span>Price</span><strong>{price ? `$${price}` : "To be discussed"}</strong></div>
              <div className="summary-row"><span>Scope</span><strong>{description}</strong></div>
            </div>
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", color: "var(--slate-600)" }}>
              <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
              I agree to the terms of this service agreement and understand this request is subject to confirmation.
            </label>
            <div className="button-row">
              <button className="btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button className="btn-trust" disabled={!agreed} onClick={handleSubmit}>
                <AppIcon name="Send" size={16} />
                Send Request
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
