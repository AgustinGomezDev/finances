import { Trash, ShoppingCart, Briefcase, Film, Car, Home, Croissant, ScanHeart } from "lucide-react"
import type { Transaction } from "../types/transaction"
import { formatRelativeDate } from "../utils/date"
import { Link } from '@tanstack/react-router'

interface TransactionItemProps {
    transaction: Transaction
    onDelete?: (transactionId: string) => void
    editable: boolean
}

const categoryIcons: { [key: string]: any } = {
    Alimentación: Croissant,
    Trabajo: Briefcase,
    Entretenimiento: Film,
    Transporte: Car,
    Hogar: Home,
    Salud: ScanHeart,
    Compras: ShoppingCart,
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete, editable }) => {
    const IconComponent = categoryIcons[transaction.category] || ShoppingCart
    const href = `/editarTransaccion/${transaction.id}`
    
    return (
        <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors relative">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'text-emerald-500 bg-emerald-900/50' : 'text-red-500 bg-red-900/50'}`}>
                    <IconComponent className="w-4 h-4" />
                </div>
                <div>
                    <h4 className="font-medium text-slate-900 dark:text-white text-sm relative">
                        {editable ? (
                            <Link
                                to={href}
                                className="hover:underline relative group"
                            >
                                {transaction.title}
                                {/* Tooltip */}
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-gray-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    Editar
                                </span>
                            </Link>
                        ) : (
                            transaction.title
                        )}
                    </h4>
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
                    {transaction.type === "income" ? "+" : "-"}
                    {Math.abs(transaction.amount).toFixed(2)}€
                </p>
            </div>
            {onDelete && (
                <button
                    onClick={() => onDelete?.(transaction.id)}
                    className="absolute top-1 right-1 cursor-pointer transition-opacity text-gray-400/50 hover:text-red-500"
                    aria-label="Borrar transacción"
                >
                    <Trash className="w-4 h-4" />
                </button>
            )}
        </div>
    )
}

export default TransactionItem
