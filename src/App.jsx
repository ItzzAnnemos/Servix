import { useState } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import { clientBookings, craftsmen as craftsmanMocks, providerBookings } from "./data/mockData.js";
import LoginPage from "./features/auth/LoginPage.jsx";
import LandingPage from "./features/landing/LandingPage.jsx";
import BrowsePage from "./features/browse/BrowsePage.jsx";
import CraftsmanProfilePage from "./features/profile/CraftsmanProfilePage.jsx";
import BookServicePage from "./features/booking/BookServicePage.jsx";
import CraftsmanDashboard from "./features/dashboard/CraftsmanDashboard.jsx";
import ClientBookingsPage from "./features/bookings/ClientBookingsPage.jsx";
import ReviewPage from "./features/reviews/ReviewPage.jsx";
import { paths } from "./routes/paths.js";

function CraftsmanRoute({ craftsmen, children }) {
  const { craftsmanId } = useParams();
  const craftsman = craftsmen.find((item) => item.id === Number(craftsmanId));

  if (!craftsman) return <Navigate to="/browse" replace />;

  return children(craftsman);
}

function ReviewRoute({ bookings, craftsmen, addReview }) {
  const { bookingId } = useParams();
  const booking = bookings.find((item) => item.id === Number(bookingId));
  const craftsman = craftsmen.find((item) => item.id === booking?.craftsmanId);

  if (!booking || !craftsman) return <Navigate to={paths.bookings} replace />;

  return <ReviewPage booking={booking} craftsman={craftsman} addReview={(craftsmanId, review) => addReview(craftsmanId, review, booking.id)} />;
}

function RequireRole({ currentUser, allowedRoles }) {
  const location = useLocation();

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={paths.login} replace state={{ from: location, requiredRole: allowedRoles[0] }} />;
  }

  return <Outlet />;
}

function AppLayout({ currentUser, onLogout, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <div className="app-shell">
      <Navbar currentUser={currentUser} onLogout={onLogout} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <main className="fade-in">
        <Outlet />
      </main>
      <Footer currentUser={currentUser} />
    </div>
  );
}

function AppRoutes() {
  const [craftsmen, setCraftsmen] = useState(craftsmanMocks);
  const [bookings, setBookings] = useState(clientBookings);
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const provider = craftsmen[0];

  function addBooking(booking) {
    setBookings((current) => [booking, ...current]);
  }

  function addReview(craftsmanId, review, bookingId) {
    setCraftsmen((current) =>
      current.map((craftsman) => {
        if (craftsman.id !== craftsmanId) return craftsman;

        const reviewCount = craftsman.reviewCount + 1;
        const rating = Math.round((((craftsman.rating * craftsman.reviewCount) + review.rating) / reviewCount) * 10) / 10;
        const ratingBreakdown = {
          ...craftsman.ratingBreakdown,
          [review.rating]: (craftsman.ratingBreakdown[review.rating] ?? 0) + 1,
        };

        return {
          ...craftsman,
          rating,
          reviewCount,
          ratingBreakdown,
          reviews: [review, ...craftsman.reviews],
        };
      }),
    );

    setBookings((current) => current.map((booking) => (booking.id === bookingId ? { ...booking, reviewed: true } : booking)));
  }

  function handleLogin(user) {
    setCurrentUser(user);
    setMobileMenuOpen(false);
  }

  function handleLogout() {
    setCurrentUser(null);
    setMobileMenuOpen(false);
  }

  return (
    <Routes>
      <Route path={paths.home} element={<LandingPage />} />
      <Route path={paths.login} element={<LoginPage onLogin={handleLogin} />} />
      <Route element={<AppLayout currentUser={currentUser} onLogout={handleLogout} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />}>
        <Route element={<RequireRole currentUser={currentUser} allowedRoles={["client"]} />}>
          <Route path={paths.browse} element={<BrowsePage craftsmen={craftsmen} />} />
          <Route
            path="/craftsmen/:craftsmanId"
            element={
              <CraftsmanRoute craftsmen={craftsmen}>
                {(craftsman) => <CraftsmanProfilePage craftsman={craftsman} />}
              </CraftsmanRoute>
            }
          />
          <Route
            path="/craftsmen/:craftsmanId/book"
            element={
              <CraftsmanRoute craftsmen={craftsmen}>
                {(craftsman) => <BookServicePage key={craftsman.id} craftsman={craftsman} addBooking={addBooking} />}
              </CraftsmanRoute>
            }
          />
          <Route path={paths.bookings} element={<ClientBookingsPage bookings={bookings} craftsmen={craftsmen} />} />
          <Route path="/bookings/:bookingId/review" element={<ReviewRoute bookings={bookings} craftsmen={craftsmen} addReview={addReview} />} />
        </Route>
        <Route element={<RequireRole currentUser={currentUser} allowedRoles={["provider"]} />}>
          <Route path={paths.dashboard} element={<CraftsmanDashboard provider={provider} initialBookings={providerBookings} />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={paths.home} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
