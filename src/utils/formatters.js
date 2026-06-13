export function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getCategory(categories, categoryId) {
  return categories.find((category) => category.id === categoryId);
}

export function getStatusBadge(status) {
  if (status === "completed" || status === "accepted") return "green";
  if (status === "pending") return "amber";
  if (status === "declined") return "red";
  return "blue";
}

export function labelStatus(status) {
  const labels = {
    completed: "Completed",
    pending: "Pending",
    accepted: "Accepted",
    declined: "Declined",
  };

  return labels[status] ?? status;
}
