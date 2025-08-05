import { ShoppingCart, Briefcase, Film, Coffee, Car, Home } from "lucide-react"
import type { Transaction } from "../types/transaction"
import { formatRelativeDate } from "../utils/date"

interface TransactionItemProps {
    transaction: Transaction
}


const categoryIcons: { [key: string]: any } = {
    Alimentación: ShoppingCart,
    Trabajo: Briefcase,
    Entretenimiento: Film,
    Café: Coffee,
    Transporte: Car,
    Hogar: Home,
}


const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {

    const IconComponent = categoryIcons[transaction.category] || ShoppingCart

    return (
        <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    <IconComponent className="w-4 h-4" />
                </div>
                <div>
                    <h4 className="font-medium text-slate-900 dark:text-white text-sm">{transaction.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {transaction.category} • {formatRelativeDate(transaction.date)}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p
                    className={`font-semibold text-sm ${transaction.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                        }`}
                >
                    {transaction.type === "income" ? "+" : "-"}{Math.abs(transaction.amount).toFixed(2)}€
                </p>
            </div>
        </div>
    )
}

export default TransactionItem