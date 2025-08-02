import { useNavigate } from "@tanstack/react-router"
import { ArrowLeft, DollarSign, Tag, FileText, Calendar } from "lucide-react"
import { useState } from "react"

const NewTransaction = () => {
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [note, setNote] = useState("")

  const categories = {
    expense: ["Alimentación", "Transporte", "Entretenimiento", "Salud", "Compras", "Servicios", "Otros"],
    income: ["Salario", "Freelance", "Inversiones", "Ventas", "Bonos", "Otros"],
  }

  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <div className="px-4 py-4 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-center">
          <button
              onClick={() => navigate({to:'/'})}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer absolute left-0 ml-5"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white text-center">Nueva Transacción</h1>
        </div>

        <div className="flex flex-col gap-4">
          {/* INGRESO / GASTO */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 mt-2">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setTransactionType("expense")}
                className={`py-3 px-4 rounded-lg font-medium transition-all cursor-pointer ${transactionType === "expense"
                  ? "bg-red-600 dark:bg-red-500 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
              >
                Gasto
              </button>
              <button
                onClick={() => setTransactionType("income")}
                className={`py-3 px-4 rounded-lg font-medium transition-all cursor-pointer ${transactionType === "income"
                  ? "bg-emerald-600 dark:bg-emerald-500 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
              >
                Ingreso
              </button>
            </div>
          </div>

          {/* CANTIDAD */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Cantidad</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-4 text-2xl font-bold bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 border-0"
              />
            </div>
          </div>

          {/* CATEGORÍA */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Categoría</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 border-0 appearance-none"
              >
                <option value="">Seleccionar categoría</option>
                {categories[transactionType].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* NOTA */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Nota (opcional)</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-slate-400 w-4 h-4" />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Agregar una nota..."
                rows={3}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 border-0 resize-none"
              />
            </div>
          </div>

          {/* FECHA */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Fecha</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 border-0"
              />
            </div>
          </div>

          {/* BOTONES DE ACCION */}
          <div className="space-y-3 pb-20">
            <button
              onClick={() => navigate({to: '/'})}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${transactionType === "expense"
                  ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                  : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                }`}
            >
              Guardar {transactionType === "expense" ? "Gasto" : "Ingreso"}
            </button>
            <button
              onClick={() => navigate({to: '/'})}
              className="w-full py-4 px-6 rounded-lg font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancelar
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default NewTransaction