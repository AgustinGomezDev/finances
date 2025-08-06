import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, User } from 'lucide-react'
import { useAuthStore } from '../stores/useAuthStore';

export const Route = createFileRoute('/configuracion')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.firestoreUser);

  if (!user) return (
    <div className='dark:bg-gray-900 min-h-screen'>
      <div className='px-4 py-4 max-w-7xl mx-auto'>
        <p className='text-red-500 text-xl text-center'>Error al obtener el usuario</p>
      </div>
    </div>

  )

  const currencies = ["USD", "EUR", "MXN", "ARS", "COP", "CLP"]

  return (
    <div className='dark:bg-gray-900 min-h-screen'>
      <div className='px-4 py-4 max-w-7xl mx-auto'>
        <div className="flex items-center justify-center mb-2 relative">
          <button
            onClick={() => navigate({ to: '/' })}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer absolute left-0 ml-5"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white text-center">Configración</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{user.displayName}</h3>
              <p className="text-slate-600 dark:text-slate-400">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mt-5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Moneda</h3>
          <div className="grid grid-cols-3 gap-3">
            {currencies.map((currency, index) => (
              <button
                key={currency + index}
                className={`p-3 rounded-lg text-center font-medium transition-all cursor-pointer ${currency === user.currency
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
              >
                {currency}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
