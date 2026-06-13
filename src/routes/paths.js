export const paths = {
  home: "/",
  login: "/login",
  browse: "/browse",
  dashboard: "/dashboard",
  bookings: "/bookings",
  craftsman: (craftsmanId) => `/craftsmen/${craftsmanId}`,
  bookCraftsman: (craftsmanId) => `/craftsmen/${craftsmanId}/book`,
  reviewBooking: (bookingId) => `/bookings/${bookingId}/review`,
};
