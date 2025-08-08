import { useAuthStore } from '../stores/useAuthStore';

export function formatCurrency(amount: number) {
  const currency = useAuthStore.getState().firestoreUser?.currency || 'USD';

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount);
}