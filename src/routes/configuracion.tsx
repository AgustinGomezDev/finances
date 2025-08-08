import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, User } from 'lucide-react'
import { useAuthStore } from '../stores/useAuthStore';
import { useState, useEffect } from 'react';
import { updateUserConfig } from '../services/userSummaryService';

export const Route = createFileRoute('/configuracion')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.firestoreUser);
  const setFirestoreUser = useAuthStore((state) => state.setFirestoreUser)

  type BudgetCategories =
    | 'Alimentación'
    | 'Transporte'
    | 'Entretenimiento'
    | 'Compras'
    | 'Salud'
    | 'Servicios'
    | 'Otros'

  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<BudgetCategories, number>>({
    'Alimentación': 0,
    'Transporte': 0,
    'Entretenimiento': 0,
    'Compras': 0,
    'Salud': 0,
    'Servicios': 0,
    'Otros': 0
  });
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const [loading, setLoading] = useState(true);

  const currencies = ["USD", "EUR", "MXN", "ARS", "COP", "CLP"]
  const categories: BudgetCategories[] = ['Alimentación', 'Transporte', 'Entretenimiento', 'Compras', 'Salud', 'Servicios', 'Otros']

  useEffect(() => {
    if (user) {
      setMonthlyBudget(user.monthlyBudget || 0);
      setCategoryBudgets({
        'Alimentación': user.monthlyFoodBudget || 0,
        'Transporte': user.monthlyTransportBudget || 0,
        'Entretenimiento': user.monthlyEntertainmentBudget || 0,
        'Compras': user.monthlyShoppingBudget || 0,
        'Salud': user.monthlyHealthBudget || 0,
        'Servicios': user.monthlyServicesBudget || 0,
        'Otros': user.monthlyOthersBudget || 0
      });
      setSelectedCurrency(user.currency || "EUR");
      setLoading(false);
    }
  }, [user]);

  if (!user && !loading) {
    return (
      <div className='dark:bg-gray-900 min-h-screen'>
        <div className='px-4 py-4 max-w-7xl mx-auto'>
          <p className='text-red-500 text-xl text-center'>Error al obtener el usuario</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='dark:bg-gray-900 min-h-screen flex items-center justify-center'>
        <p className='text-slate-500 dark:text-slate-300'>Cargando configuración...</p>
      </div>
    )
  }

  const handleSave = async () => {
    if (!user?.uid) return;

    await updateUserConfig(
      user.uid,
      selectedCurrency,
      monthlyBudget,
      categoryBudgets.Alimentación,
      categoryBudgets.Transporte,
      categoryBudgets.Entretenimiento,
      categoryBudgets.Compras,
      categoryBudgets.Salud,
      categoryBudgets.Servicios,
      categoryBudgets.Otros
    )

    setFirestoreUser({
      ...user,
      currency: selectedCurrency,
      monthlyBudget,
      monthlyFoodBudget: categoryBudgets.Alimentación,
      monthlyTransportBudget: categoryBudgets.Transporte,
      monthlyEntertainmentBudget: categoryBudgets.Entretenimiento,
      monthlyShoppingBudget: categoryBudgets.Compras,
      monthlyHealthBudget: categoryBudgets.Salud,
      monthlyServicesBudget: categoryBudgets.Servicios,
      monthlyOthersBudget: categoryBudgets.Otros
    })

    navigate({ to: "/presupuestos" })
  }

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
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white text-center">Configuración</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{user?.displayName}</h3>
              <p className="text-slate-600 dark:text-slate-400">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mt-5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Moneda</h3>
          <div className="grid grid-cols-3 gap-3">
            {currencies.map((currency, index) => (
              <button
                key={currency + index}
                onClick={() => setSelectedCurrency(currency)}
                className={`p-3 rounded-lg text-center font-medium transition-all cursor-pointer ${currency === selectedCurrency
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
              >
                {currency}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mt-5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Presupuesto mensual</h3>
          <input
            type="number"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(Number(e.target.value))}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mt-5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Presupuesto por categoría</h3>
          {categories.map(cat => (
            <div key={cat} className="flex items-center mb-3 border-b even:bg-gray-600 px-4 py-2 rounded-lg">
              <span className="flex-1 text-slate-800 dark:text-slate-200">{cat}</span>
              <input
                type="number"
                value={categoryBudgets[cat]}
                onChange={(e) => setCategoryBudgets(prev => ({ ...prev, [cat]: Number(e.target.value) }))}
                className="w-28 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="mt-6 w-full p-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition mb-20 cursor-pointer"
        >
          Guardar cambios
        </button>

      </div>
    </div>
  )
}
