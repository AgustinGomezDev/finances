import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AlertTriangle, ArrowLeft, Target } from 'lucide-react'
import { useAuthStore } from '../stores/useAuthStore';
import { useEffect, useState } from 'react';
import { getCurrentMonthTransactions } from '../services/transactionService';
import type { Transaction } from '../types/transaction'
import { formatCurrency } from '../utils/formatCurrency';

export const Route = createFileRoute('/presupuestos')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.firestoreUser);

    const [loading, setLoading] = useState(true)
    const [spent, setSpent] = useState(0)
    const [transactions, setTransactions] = useState<Transaction[]>([])

    const budgetsCategories = [
        {
            id: 1,
            category: "Alimentación",
            spent: 320,
            limit: user?.monthlyFoodBudget || 100,
            color: "bg-emerald-500",
            bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
            icon: "🍽️",
        },
        {
            id: 2,
            category: "Entretenimiento",
            spent: 180,
            limit: user?.monthlyEntertainmentBudget || 100,
            color: "bg-violet-500",
            bgColor: "bg-violet-50 dark:bg-violet-900/20",
            icon: "🎬",
        },
        {
            id: 3,
            category: "Transporte",
            spent: 250,
            limit: user?.monthlyTransportBudget || 100,
            color: "bg-red-500",
            bgColor: "bg-red-50 dark:bg-red-900/20",
            icon: "🚗",
        },
        {
            id: 4,
            category: "Compras",
            spent: 150,
            limit: user?.monthlyShoppingBudget || 100,
            color: "bg-blue-500",
            bgColor: "bg-blue-50 dark:bg-blue-700/20",
            icon: "🛍️",
        },
        {
            id: 5,
            category: "Salud",
            spent: 150,
            limit: user?.monthlyHealthBudget || 100,
            color: "bg-orange-500",
            bgColor: "bg-orange-50 dark:bg-orange-700/20",
            icon: "💊",
        },
        {
            id: 6,
            category: "Servicios",
            spent: 150,
            limit: user?.monthlyServicesBudget || 100,
            color: "bg-yellow-500",
            bgColor: "bg-yellow-50 dark:bg-yellow-700/20",
            icon: "💡",
        },
        {
            id: 7,
            category: "Otros",
            spent: 150,
            limit: user?.monthlyOthersBudget || 100,
            color: "bg-amber-500",
            bgColor: "bg-amber-50 dark:bg-amber-700/20",
            icon: "📦",
        }
    ]

    const [budgetsWithSpent, setBudgetsWithSpent] = useState(budgetsCategories);

    const getProgressPercentage = (spent: number, limit: number) => {
        return Math.min((spent / limit) * 100, 100)
    }

    const getStatusIcon = (spent: number, limit: number) => {
        const percentage = (spent / limit) * 100
        if (percentage >= 100) return <AlertTriangle className="w-4 h-4 text-red-500" />
        if (percentage >= 80) return <AlertTriangle className="w-4 h-4 text-amber-500" />
        return null
    }

    const getBudgetColor = (spent: number, limit: number) => {
        const percentage = (spent / limit) * 100

        if (percentage >= 80) return 'text-red-600 dark:text-red-400'
        if (percentage >= 60 && percentage < 80) return 'text-amber-600 dark:text-amber-400'
        return 'text-emerald-600 dark:text-emerald-400'
    }

    const budgetFields = [
        'monthlyEntertainmentBudget',
        'monthlyFoodBudget',
        'monthlyHealthBudget',
        'monthlyOthersBudget',
        'monthlyServicesBudget',
        'monthlyShoppingBudget',
        'monthlyTransportBudget',
    ] as const;

    const totalBudget = budgetFields.reduce((sum, field) => {
        return sum + Number(user?.[field] || 0);
    }, 0);

    useEffect(() => {
        async function fetchMonthTransactions() {
            if (!user) return;

            setLoading(true);
            try {
                const currentMonthTransactions = await getCurrentMonthTransactions(user.uid);
                const totalMonthExpense = currentMonthTransactions
                    .filter(tx => tx.type === 'expense')
                    .reduce((sum, tx) => sum + tx.amount, 0);

                setSpent(totalMonthExpense);
                setTransactions(currentMonthTransactions)
            } catch (error) {
                console.error("Error al obtener transacciones:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchMonthTransactions()
    }, [user])

    useEffect(() => {
        const updated = budgetsCategories.map((budget) => {
            const totalSpent = transactions
                .filter(tx => tx.type === 'expense' && tx.category === budget.category)
                .reduce((sum, tx) => sum + tx.amount, 0);

            return {
                ...budget,
                spent: totalSpent,
            };
        });

        setBudgetsWithSpent(updated);
    }, [transactions])

    // Si no hay usuario, mostramos loading o mensaje
    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen text-slate-600 dark:text-slate-400">
                Cargando usuario...
            </div>
        )
    }

    console.log(loading)

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
                    <h1 className="text-lg font-semibold text-slate-900 dark:text-white text-center">Presupuestos</h1>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-500">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Presupuesto Mensual</p>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(user.monthlyBudget)}</h2>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <Target className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Gastado: {formatCurrency(spent)}</p>
                            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                                <div
                                    className="bg-slate-900 dark:bg-white rounded-full h-2 transition-all duration-500"
                                    style={{ width: `${getProgressPercentage(spent, user.monthlyBudget)}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="text-right ml-4">
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {((spent / user.monthlyBudget) * 100).toFixed(0)}%
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Utilizado</p>
                        </div>
                    </div>
                </div>

                {/* CATEGORIES */}
                <div className="space-y-4 mt-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Categorías</h3>

                    {budgetsWithSpent.map((budget, index) => (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-slate-200 dark:border-gray-500" key={index}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-3 rounded-lg ${budget.bgColor}`}>
                                        <span className="text-xl">{budget.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white">{budget.category}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{formatCurrency(budget.spent)} de {formatCurrency(budget.limit)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(budget.spent, budget.limit)}
                                    <span className={`font-semibold ${getBudgetColor(budget.spent, budget.limit)}`}>
                                        {getProgressPercentage(budget.spent, budget.limit).toFixed(0)}%
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Progreso</span>
                                    <span className={`font-medium ${getBudgetColor(budget.spent, budget.limit)}`}>
                                        {formatCurrency(budget.limit - budget.spent)} restante
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                                    <div style={{ width: `${getProgressPercentage(budget.spent, budget.limit)}%` }} className={`${budget.color} rounded-full h-2 transition-all duration-500`}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* QUICK STATS */}
                <div className="grid grid-cols-2 gap-4 mt-10 mb-20">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-200 dark:border-gray-500 text-center">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{budgetsWithSpent.filter(b => b.spent <= b.limit).length}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">En objetivo</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-200 dark:border-gray-500 text-center">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{budgetsWithSpent.filter(b => b.spent > b.limit).length}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Excedido</div>
                    </div>
                    <div className="col-span-2 bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-200 dark:border-gray-500 flex items-center gap-5 md:gap-10 lg:gap-20 place-content-center text-center">
                        <div>
                            <div className="text-2xl font-bold text-black dark:text-white">{formatCurrency(totalBudget)}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Total asignado</div>
                        </div>
                        <div>
                            <div className={`text-2xl font-bold  ${user.monthlyBudget - totalBudget <= 0 ? 'text-red-600 dark:text-red-400' : 'text-black dark:text-white'}`}>
                                {formatCurrency(user.monthlyBudget - totalBudget)}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Resto mensual</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

