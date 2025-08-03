import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from "@tanstack/react-router"
import { ArrowLeft, Search } from 'lucide-react'
import TransactionItem from '../components/TransactionItem'
import { useState, useEffect } from 'react'
import NewTransactionButton from '../components/NewTransactionButton'
import { getAllTransactions } from "../services/firebaseService" // asegúrate de la ruta
import type { Transaction } from '../types/transaction'

export const Route = createFileRoute('/transacciones')({
  component: Transacciones,
})

function Transacciones() {
  const navigate = useNavigate()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [amountFilter, setAmountFilter] = useState<"all" | "greater" | "less">("all")
  const [amountValue, setAmountValue] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
    async function fetchTransactions() {
      try {
        const data = await getAllTransactions()
        console.log(data)
        setTransactions(data)
      } catch (error) {
        console.error("Error al obtener transacciones:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])
  
  console.log(loading)

  const categories = ["Todas", "Alimentación", "Trabajo", "Entretenimiento", "Transporte"]

  const filteredTransactions = transactions.filter((transaction) => {
    // Filtro por categoría
    const categoryMatch = selectedCategory === "Todas" || transaction.category === selectedCategory

    // Filtro por cantidad
    let amountMatch = true
    if (amountFilter === "greater" && amountValue) {
      amountMatch = Math.abs(transaction.amount) > Number.parseFloat(amountValue)
    } else if (amountFilter === "less" && amountValue) {
      amountMatch = Math.abs(transaction.amount) < Number.parseFloat(amountValue)
    }

    // Filtro por búsqueda
    const searchMatch =
      searchTerm === "" ||
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())

    return categoryMatch && amountMatch && searchMatch
  })

  // Calcular totales de las transacciones filtradas
  const filteredIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const filteredExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <div className='px-4 py-4 max-w-7xl mx-auto'>
        <div className="flex items-center justify-center">
          <button
            onClick={() => navigate({ to: '/' })}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer absolute left-0 ml-5"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white text-center">Transacciones</h1>
        </div>

        <div className="relative my-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar transacciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 border-0"
          />
        </div>

        <div className="flex gap-2 justify-center-safe flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4  border-slate-200 dark:border-gray-500 mt-4">
          <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Filtrar por cantidad</h4>
          <div className="flex space-x-3">
            <select
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value as "all" | "greater" | "less")}
              className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 border-0"
            >
              <option value="all">Todas las cantidades</option>
              <option value="greater">Mayor que</option>
              <option value="less">Menor que</option>
            </select>
            {amountFilter !== "all" && (
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  value={amountValue}
                  onChange={(e) => setAmountValue(e.target.value)}
                  placeholder="0.00"
                  className="w-24 pl-6 pr-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 border-0"
                />
              </div>
            )}
          </div>
        </div>

        {(selectedCategory !== "Todas" || amountFilter !== "all" || searchTerm !== "") && (
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-slate-600 dark:text-slate-400">Filtros activos:</span>
            {selectedCategory !== "Todas" && (
              <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300">
                {selectedCategory}
              </span>
            )}
            {amountFilter !== "all" && amountValue && (
              <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300">
                {amountFilter === "greater" ? ">" : "<"} ${amountValue}
              </span>
            )}
            {searchTerm && (
              <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300">
                "{searchTerm}"
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4  border-slate-200 dark:border-gray-500">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Ingresos</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+{filteredIncome.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4  border-slate-200 dark:border-gray-500">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Gastos</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">-{filteredExpenses.toFixed(2)}</p>
          </div>
        </div>

        <div className='mt-5 md:col-span-3 dark:bg-gray-800 border border-gray-500 rounded-2xl  text-white shadow-lg dark:shadow-2xl mb-20'>
          <div className='flex items-center justify-between p-6 border-b dark:border-gray-500'>
            <p className='text-xl font-medium'>Historial completo</p>
          </div>
          <div>
            {filteredTransactions.map((transaction, index) => (
              <div
                key={`${transaction.id}-${index}`}
              >
                <TransactionItem transaction={transaction} />
              </div>

            ))}
          </div>
        </div>

      </div>
      <NewTransactionButton />
    </div>
  )
}