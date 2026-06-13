import { useState } from "react";
import { Link } from "react-router-dom";
import AppIcon from "../../components/ui/AppIcon.jsx";
import Avatar from "../../components/ui/Avatar.jsx";
import CraftsmanProfilePage from "./CraftsmanProfilePage.jsx";
import { paths } from "../../routes/paths.js";

function WorkspaceTab({ active, children, onClick }) {
  return (
    <button className={`tab-button ${active ? "active" : ""}`} onClick={onClick} type="button">
      {children}
    </button>
  );
}

export default function ProviderProfileWorkspace({ provider, onSave }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [draft, setDraft] = useState(provider);
  const [serviceText, setServiceText] = useState(provider.services.join(", "));

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleServicesChange(value) {
    setServiceText(value);
    updateDraft("services", value.split(",").map((service) => service.trim()).filter(Boolean));
  }

  function handleSave() {
    onSave(draft);
    setActiveTab("preview");
  }

  return (
    <div className="container section provider-profile-workspace">
      <div className="page-header">
        <div>
          <Link className="back-button" to={paths.dashboard}>
            <AppIcon name="ArrowLeft" size={16} />
            Back to dashboard
          </Link>
          <h1 className="page-title">Profile Workspace</h1>
          <p className="page-copy">Edit your craftsman profile and preview how clients will see it.</p>
        </div>
        <div className="person-line provider-profile-summary">
          <Avatar name={draft.name} size="sm" />
          <div>
            <strong>{draft.name}</strong>
            <div className="small-muted">Public profile preview</div>
          </div>
        </div>
      </div>

      <div className="tabs profile-workspace-tabs" role="tablist" aria-label="Profile workspace tabs">
        <WorkspaceTab active={activeTab === "edit"} onClick={() => setActiveTab("edit")}>Edit</WorkspaceTab>
        <WorkspaceTab active={activeTab === "preview"} onClick={() => setActiveTab("preview")}>Preview</WorkspaceTab>
      </div>

      {activeTab === "edit" ? (
        <section className="form-panel card profile-stack">
          <div className="profile-editor-grid">
            <div>
              <label className="field-label" htmlFor="providerName">Display Name</label>
              <input id="providerName" className="input" value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="providerExperience">Years of Experience</label>
              <input id="providerExperience" className="input" type="number" value={draft.experience} onChange={(event) => updateDraft("experience", Number(event.target.value))} />
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="providerBio">Bio</label>
            <textarea id="providerBio" className="textarea" rows={5} value={draft.bio} onChange={(event) => updateDraft("bio", event.target.value)} />
          </div>

          <div className="profile-editor-grid">
            <div>
              <label className="field-label" htmlFor="providerPrice">Rate</label>
              <input id="providerPrice" className="input" value={draft.priceRange} onChange={(event) => updateDraft("priceRange", event.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="providerAvailability">Availability</label>
              <input id="providerAvailability" className="input" value={draft.availability} onChange={(event) => updateDraft("availability", event.target.value)} />
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="providerServices">Services Offered</label>
            <textarea id="providerServices" className="textarea" rows={3} value={serviceText} onChange={(event) => handleServicesChange(event.target.value)} />
            <p className="small-muted">Separate services with commas. The preview updates immediately.</p>
          </div>

          <div className="button-row">
            <button className="btn-primary" type="button" onClick={handleSave}>
              <AppIcon name="Check" size={16} />
              Save & Preview
            </button>
            <button className="btn-secondary" type="button" onClick={() => setActiveTab("preview")}>Preview without saving</button>
          </div>
        </section>
      ) : (
        <div className="profile-preview-frame">
          <CraftsmanProfilePage craftsman={draft} showBackLink={false} showBookingAction={false} />
        </div>
      )}
    </div>
  );
}
