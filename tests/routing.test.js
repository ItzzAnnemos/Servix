import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const appSource = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const navbarSource = readFileSync(new URL("../src/components/layout/Navbar.jsx", import.meta.url), "utf8");
const footerSource = readFileSync(new URL("../src/components/layout/Footer.jsx", import.meta.url), "utf8");
const landingSource = readFileSync(new URL("../src/features/landing/LandingPage.jsx", import.meta.url), "utf8");
const dashboardSource = readFileSync(new URL("../src/features/dashboard/CraftsmanDashboard.jsx", import.meta.url), "utf8");
const profileSource = readFileSync(new URL("../src/features/profile/CraftsmanProfilePage.jsx", import.meta.url), "utf8");
const browseSource = readFileSync(new URL("../src/features/browse/BrowsePage.jsx", import.meta.url), "utf8");
const bookingSource = readFileSync(new URL("../src/features/booking/BookServicePage.jsx", import.meta.url), "utf8");
const selectMenuSource = readFileSync(new URL("../src/components/ui/SelectMenu.jsx", import.meta.url), "utf8");
const craftsmanCardSource = readFileSync(new URL("../src/features/browse/CraftsmanCard.jsx", import.meta.url), "utf8");
const pathsSource = readFileSync(new URL("../src/routes/paths.js", import.meta.url), "utf8");
const mockDataSource = readFileSync(new URL("../src/data/mockData.js", import.meta.url), "utf8");
const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const clientBookingsBlock = mockDataSource.match(/export const clientBookings = \[[\s\S]*?\];/)?.[0] ?? "";
const providerBookingsBlock = mockDataSource.match(/export const providerBookings = \[[\s\S]*?\];/)?.[0] ?? "";

test("app uses real URL routes instead of an in-memory page switcher", () => {
  assert.match(packageJson.dependencies["react-router-dom"], /^\^7\./);
  assert.match(appSource, /BrowserRouter/);
  assert.match(appSource, /function ScrollToTop/);
  assert.match(appSource, /window\.scrollTo\(\{ top: 0, left: 0 \}\)/);
  assert.match(appSource, /<Routes>/);
  assert.match(appSource, /path=\{paths\.browse\}/);
  assert.match(appSource, /path="\/craftsmen\/:craftsmanId"/);
  assert.match(pathsSource, /browse: "\/browse"/);
  assert.match(pathsSource, /craftsman: \(craftsmanId\) => `\/craftsmen\/\$\{craftsmanId\}`/);
  assert.doesNotMatch(appSource, /const \[page, setPage\]/);
  assert.doesNotMatch(appSource, /const pages = \{/);
  assert.doesNotMatch(appSource, /function getPageFromPath/);
  assert.doesNotMatch(appSource, /function createPath/);
  assert.match(navbarSource, /NavLink/);
  assert.match(craftsmanCardSource, /Link/);
});

test("popular service tiles are hoverable but not navigation links", () => {
  assert.match(landingSource, /<div key=\{category\.id\} className="service-tile">/);
  assert.doesNotMatch(landingSource, /<Link key=\{category\.id\} className="service-tile"/);
  assert.match(stylesSource, /\.service-grid\s*\{[^}]*display: flex;[^}]*flex-wrap: wrap;[^}]*justify-content: center;/s);
  assert.match(stylesSource, /\.service-grid \.service-tile\s*\{[^}]*flex: 0 1 calc\(\(100% - 56px\) \/ 5\);/s);
  assert.match(stylesSource, /\.service-grid \.service-tile\s*\{[^}]*flex-basis: calc\(\(100% - 14px\) \/ 2\);/s);
  assert.match(stylesSource, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(stylesSource, /\.service-tile:hover/);
});

test("app defines a demo login flow and role protected routes", () => {
  assert.match(pathsSource, /login: "\/login"/);
  assert.match(appSource, /function RequireRole/);
  assert.match(appSource, /allowedRoles/);
  assert.match(appSource, /currentUser/);
  assert.match(appSource, /handleLogin/);
  assert.match(appSource, /<Route path=\{paths\.login\}/);
  assert.match(appSource, /allowedRoles=\{\["client"\]\}/);
  assert.match(appSource, /allowedRoles=\{\["provider"\]\}/);
  assert.match(navbarSource, /currentUser/);
  assert.match(navbarSource, /Switch Role/);
  assert.doesNotMatch(navbarSource, /Log out/);
  assert.match(footerSource, /currentUser/);
  assert.match(footerSource, /isProvider/);
  assert.match(footerSource, /For Craftsmen/);
  assert.match(footerSource, /to=\{paths\.providerProfile\}>Profile/);
  assert.match(footerSource, /to=\{paths\.home\}>How it Works/);
  assert.match(footerSource, /to=\{paths\.login\}>Switch Role/);
  assert.match(footerSource, /to=\{paths\.home\}>Public Home/);
  assert.doesNotMatch(footerSource, /Booking Requests/);
  assert.doesNotMatch(footerSource, /Profile Tools/);
});

test("provider profile editing lives in a dedicated preview workspace", () => {
  assert.match(pathsSource, /providerProfile: "\/dashboard\/profile"/);
  assert.match(appSource, /ProviderProfileWorkspace/);
  assert.match(appSource, /path=\{paths\.providerProfile\}/);
  assert.match(dashboardSource, /to=\{paths\.providerProfile\}/);
  assert.doesNotMatch(dashboardSource, /Profile Editor/);
  assert.doesNotMatch(dashboardSource, /activeTab/);
});

test("profile preview renders gallery images and keeps sidebar panels content sized", () => {
  assert.match(mockDataSource, /image: galleryImage\(/);
  assert.match(profileSource, /<img/);
  assert.match(profileSource, /className="gallery-image"/);
  assert.match(profileSource, /profile-stack profile-sidebar/);
  assert.match(stylesSource, /\.profile-main\s*\{[^}]*align-items: start;/s);
  assert.match(stylesSource, /\.profile-sidebar\s*\{[^}]*align-content: start;/s);
  assert.match(stylesSource, /\.bar-track\s*\{[^}]*display: block;/s);
  assert.match(stylesSource, /\.bar-fill\s*\{[^}]*display: block;/s);
});

test("dropdown menus use custom below-field popovers", () => {
  assert.match(browseSource, /SelectMenu/);
  assert.match(bookingSource, /SelectMenu/);
  assert.doesNotMatch(browseSource, /<select/);
  assert.doesNotMatch(bookingSource, /<select/);
  assert.match(selectMenuSource, /className="select-popover"/);
  assert.match(selectMenuSource, /ChevronDown/);
  assert.match(stylesSource, /\.select-popover\s*\{[^}]*top: calc\(100% \+ 6px\);/s);
});

test("browse cards pin footers and navbar links are left aligned without underlines", () => {
  assert.match(browseSource, /hasActiveFilters/);
  assert.match(browseSource, /hasActiveFilters &&/);
  assert.match(browseSource, /className="btn-danger"/);
  assert.doesNotMatch(browseSource, /My Bookings/);
  assert.doesNotMatch(clientBookingsBlock, /price: "\$/);
  assert.doesNotMatch(providerBookingsBlock, /price: "\$/);
  assert.match(bookingSource, /price: price \? price\.replace\(\//);
  assert.doesNotMatch(craftsmanCardSource, /DollarSign/);
  assert.match(stylesSource, /\.craftsman-card\s*\{[^}]*display: flex;[^}]*flex-direction: column;/s);
  assert.match(stylesSource, /\.craftsman-card-body\s*\{[^}]*flex: 1;/s);
  assert.match(stylesSource, /\.card-footer\s*\{[^}]*margin-top: auto;/s);
  assert.match(stylesSource, /\.nav-inner\s*\{[^}]*justify-content: flex-start;/s);
  assert.match(stylesSource, /\.desktop-actions\s*\{[^}]*margin-left: auto;/s);
  assert.match(stylesSource, /\.mobile-toggle\s*\{[^}]*margin-left: auto;/s);
  assert.match(stylesSource, /\.mobile-menu\s*\{[^}]*position: absolute;[^}]*top: 64px;/s);
  assert.match(stylesSource, /\.brand-button\s*\{[^}]*text-decoration: none;/s);
  assert.match(stylesSource, /\.nav-button,\s*\.mobile-nav-button\s*\{[^}]*text-decoration: none;/s);
  assert.doesNotMatch(stylesSource, /\.filter-panel,\s*\.results-panel,\s*\.profile-panel,\s*\.form-panel\s*\{/);
  assert.match(stylesSource, /\.craftsman-card \.card-footer \.button-row\s*\{[^}]*flex-direction: row;/s);
  assert.match(stylesSource, /\.craftsman-card \.card-footer \.btn-primary,\s*\.craftsman-card \.card-footer \.btn-ghost\s*\{[^}]*flex: 1;/s);
});
