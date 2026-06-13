import { getInitials } from "../../utils/formatters.js";

export default function Avatar({ name, size = "md" }) {
  return <span className={`avatar ${size}`}>{getInitials(name)}</span>;
}
