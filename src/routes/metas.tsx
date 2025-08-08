import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/useAuthStore'
import { createGoal, deleteGoal, getUsersGoals, updateGoal } from '../services/goalsService'
import type { Goal } from '../types/goal'
import { formatCurrency } from '../utils/formatCurrency'

export const Route = createFileRoute('/metas')({
  component: RouteComponent,
})

function RouteComponent() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    id: '',
    title: '',
    goal: 0,
    progress: 0,
    color: 'bg-emerald-500',
    icon: '🎯',
  })
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const user = useAuthStore((state) => state.firebaseUser);
  const navigate = useNavigate()

  const handleCreateGoal = async () => {
    if (!user) return;

    const savedGoal = await createGoal(newGoal, user.uid)
    setGoals(prev => [...prev, savedGoal])
    setShowForm(false)
    setNewGoal({
      id: '',
      title: '',
      goal: 0,
      progress: 0,
      color: 'bg-emerald-500',
      icon: '🎯',
    })
  }


  const handleDeleteGoal = async (goalId: string) => {
    if (!user) return;

    try {
      await deleteGoal(user.uid, goalId)
      setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId))
      setEditingGoal(null)
    } catch (error) {
      console.error("Error al borrar la meta:", error)
    }
  }

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return
      const userGoals = await getUsersGoals(user.uid)
      setGoals(userGoals)
      setLoading(false)
    }

    fetchGoals()
  }, [user])

  console.log(loading)

  return (
    <div className='dark:bg-gray-900 min-h-screen'>
      <div className='px-4 py-4 max-w-7xl mx-auto'>
        {/* Encabezado */}
        <div className="flex items-center justify-center mb-2 relative">
          <button
            onClick={() => navigate({ to: '/' })}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer absolute left-0 ml-5"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white text-center">Metas</h1>
        </div>

        {/* Botón Crear Meta */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => { setShowForm(!showForm) }}
            className="flex justify-center items-center gap-2 px-4 py-2 text-white rounded-lg font-medium text-sm transition-colors border border-gray-500/50 h-20 w-full hover:border-gray-500 cursor-pointer group"
          >
            <Plus className="size-8 text-gray-500/50 group-hover:text-gray-500" />
          </button>
        </div>

        {showForm && (
          <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-500 space-y-4 text-dark dark:text-white">
            <label htmlFor="goalTitle">Nombre de la meta</label>
            <input
              id="goalTitle"
              type="text"
              placeholder="Nombre de la meta"
              className="w-full px-3 py-2 rounded border dark:bg-gray-700 border-gray-300 dark:border-gray-500 focus:outline-none"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
            <div className="flex gap-2">
              <div className='w-full'>
                <label htmlFor="goalProgress">Progreso</label>
                <input
                  id="goalProgress"
                  type="number"
                  placeholder="Progreso"
                  className="w-full block px-3 py-2 rounded border dark:bg-gray-700 border-gray-300 dark:border-gray-500"
                  value={newGoal.progress}
                  onChange={(e) => setNewGoal({ ...newGoal, progress: Number(e.target.value) })}
                />
              </div>

              <div className='w-full'>
                <label htmlFor="totalGoal">Meta</label>
                <input
                  id="totalGoal"
                  type="number"
                  placeholder="Meta"
                  className="w-full block px-3 py-2 rounded border dark:bg-gray-700 border-gray-300 dark:border-gray-500"
                  value={newGoal.goal}
                  onChange={(e) => setNewGoal({ ...newGoal, goal: Number(e.target.value) })}
                />
              </div>

            </div>

            <div className="flex items-center gap-2">
              <label>Color:</label>
              {['bg-emerald-500', 'bg-teal-500', 'bg-blue-500', 'bg-sky-500', 'bg-violet-500', 'bg-pink-500', 'bg-amber-500', 'bg-red-500', 'bg-orange-500',].map(color => (
                <button
                  key={color}
                  onClick={() => setNewGoal({ ...newGoal, color })}
                  className={`w-8 h-8 rounded-full ${color} border-2 ${newGoal.color === color ? 'border-black dark:border-white' : 'border-transparent'}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label>Icono:</label>
              {['🎯', '💰', '🏖️', '📉', '🚗', '🏡'].map(icon => (
                <button
                  key={icon}
                  onClick={() => setNewGoal({ ...newGoal, icon })}
                  className={`text-2xl p-1 rounded ${newGoal.icon === icon ? 'ring-2 ring-slate-500' : ''}`}
                >
                  {icon}
                </button>
              ))}
            </div>

            <button
              onClick={handleCreateGoal}
              className="bg-emerald-500 text-white font-semibold w-full py-2 rounded hover:bg-emerald-600 cursor-pointer"
            >
              Guardar Meta
            </button>
          </div>
        )}

        {/* Placeholder de metas */}
        <div className="space-y-4">
          {goals.map((meta, idx) => {
            const percent = Math.min((meta.progress / meta.goal) * 100, 100)
            return (
              <div
                key={idx}
                id={meta.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-slate-200 dark:border-gray-500 cursor-pointer hover:dark:bg-gray-900 hover:dark:border-gray-600"
                onClick={() => setEditingGoal(meta)}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className='flex gap-2 items-center'>
                    <div className={`p-2 rounded-lg bg-slate-500/50 flex items-center justify-center`}>
                      <span className={`text-3xl`}>{meta.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{meta.title}</h3>
                      <p className='text-sm text-slate-600 dark:text-slate-400'>{formatCurrency(meta.progress)} de {formatCurrency(meta.goal)}</p>
                    </div>
                  </div>
                  <div className='text-right -space-y-3'>
                    <p className='text-white text-lg font-medium'>{((meta.progress / meta.goal) * 100).toFixed(0)}%</p>
                    <span className='text-xs text-slate-600 dark:text-slate-400'>Conseguido</span>
                  </div>
                </div>
                <div className='flex justify-between mb-1'>
                  <span className='text-sm text-slate-600 dark:text-slate-400'>Progreso</span>
                  <span className='text-sm text-slate-600 dark:text-slate-400'>Restante {formatCurrency(meta.goal - meta.progress)}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                  <div
                    className={`${meta.color} h-2.5 rounded-full`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )
          })}

          {editingGoal && (
            <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-500 space-y-4 text-dark dark:text-white">
              <h2 className="text-lg font-semibold">Editar progreso de {editingGoal.title}</h2>
              <label htmlFor="editProgress">Progreso</label>
              <input
                id="editProgress"
                type="number"
                className="w-full px-3 py-2 rounded border dark:bg-gray-700 border-gray-300 dark:border-gray-500 focus:outline-none"
                value={editingGoal.progress}
                onChange={(e) =>
                  setEditingGoal({ ...editingGoal, progress: Number(e.target.value) })
                }
              />
              <button
                onClick={async () => {
                  if (!user || !editingGoal) return;
                  await updateGoal(editingGoal, user.uid, editingGoal.id);
                  setGoals((prev) =>
                    prev.map((g) => (g.id === editingGoal.id ? editingGoal : g))
                  )

                  setEditingGoal(null);
                }}
                className="bg-emerald-500 text-white font-semibold w-full py-2 rounded hover:bg-emerald-600 cursor-pointer"
              >
                Guardar cambios
              </button>
              <button
                onClick={() => setEditingGoal(null)}
                className="mt-2 w-full py-2 rounded border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteGoal(editingGoal.id)}
                className="mt-2 w-full py-2 rounded border border-red-500 bg-red-700 hover:bg-red-900 dark:hover:bg-red-900 cursor-pointer"
              >
                Borrar meta
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
