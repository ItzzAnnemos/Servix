import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const appSource = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const navbarSource = readFileSync(new URL("../src/components/layout/Navbar.jsx", import.meta.url), "utf8");
const footerSource = readFileSync(new URL("../src/components/layout/Footer.jsx", import.meta.url), "utf8");
const craftsmanCardSource = readFileSync(new URL("../src/features/browse/CraftsmanCard.jsx", import.meta.url), "utf8");
const pathsSource = readFileSync(new URL("../src/routes/paths.js", import.meta.url), "utf8");
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

test("app uses real URL routes instead of an in-memory page switcher", () => {
  assert.match(packageJson.dependencies["react-router-dom"], /^\^7\./);
  assert.match(appSource, /BrowserRouter/);
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
  assert.match(navbarSource, /Log out/);
  assert.match(footerSource, /currentUser/);
  assert.match(footerSource, /isProvider/);
});
