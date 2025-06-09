export default function formatTanggal(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}
