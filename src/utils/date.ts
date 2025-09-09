export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffMs = startOfDay(now).getTime() - startOfDay(date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays <= 7) return `Hace ${diffDays} días`;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Enero = 0
  const year = String(date.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}