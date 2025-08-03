export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()

  // Convertimos ambos a medianoche para comparar solo días
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diffMs = startOfDay(now).getTime() - startOfDay(date).getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Hoy"
  if (diffDays === 1) return "Ayer"
  return `Hace ${diffDays} días`
}
