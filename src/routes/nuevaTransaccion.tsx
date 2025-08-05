import { useEffect } from 'react';
import { useNavigate, createFileRoute } from '@tanstack/react-router';
import { useAuthStore } from '../stores/useAuthStore';
import NewTransaction from '../components/NewTransaction';

export const Route = createFileRoute('/nuevaTransaccion')({
    component: RouteComponent,
})

function RouteComponent() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: '/autenticacion' });
    }
  }, [user, loading, navigate]);

  if (loading) return <p className="p-4">Cargando...</p>;
  if (!user) return null;

  return (
    <div className='dark:bg-gray-900'>
      <NewTransaction user={user} />
    </div>
  );
}
