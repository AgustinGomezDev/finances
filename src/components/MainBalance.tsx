import { useState } from "react"
import {
    Plus,
    // TrendingUp,
    // TrendingDown,
    // DollarSign,
    Eye,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react"
import { formatCurrency } from "../utils/formatCurrency"

interface MainBalanceProps {
    totalBalance: string | number
    changeText: string
    changeType: "up" | "down"
    income: string | number
    expense: string | number
    saving: string | number
}

const MainBalance: React.FC<MainBalanceProps> = ({
    totalBalance,
    // changeText,
    // changeType,
    income,
    expense,
    // saving
}) => {
    const [isVisible, setIsVisible] = useState(false)


    const onToggleVisibility = () => {
        setIsVisible((prev) => !prev)
    }

    const netProfit = Number(income) - Number(expense)

    return (
        <div className="md:col-span-3 dark:bg-gray-800 border border-gray-500 rounded-2xl p-6 text-white shadow-lg dark:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="dark:text-gray-400 text-sm">Balance total</p>
                    <div className="flex items-start gap-1">
                        <h2 className="text-3xl font-bold">
                            {isVisible ? formatCurrency(Number(totalBalance)) : "• • • •"}
                        </h2>

                        {/* <div className="flex items-center space-x-2">
                            {changeType === "up" ? (
                                <TrendingUp className="w-4 h-4 text-green-300" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-400" />
                            )}
                            <span className={`text-sm ${changeType === "up" ? 'text-green-300' : 'text-red-400'}`}>{changeText}</span>
                        </div> */}
                    </div>
                </div>
                <button
                    onClick={onToggleVisibility}
                    aria-label={isVisible ? "Ocultar balance" : "Mostrar balance"}
                    className="bg-white/20 p-3 hover:cursor-pointer rounded-full hover:bg-white/30 transition"
                    type="button"
                >
                    <Eye className="w-6 h-6" />
                </button>
            </div>

            <p className="mb-2 dark:text-gray-400 text-sm">Este mes</p>
            <div className="flex items-center justify-between">
                <div className="flex flex-col items-center justify-center">
                    <div className="bg-green-600/20 rounded-md p-2">
                        <ArrowUpRight className="size-6 text-green-300" />
                    </div>
                    <span className="dark:text-gray-400 text-sm">Ingresos</span>
                    <p className="font-bold">{isVisible ? formatCurrency(Number(income)) : "• • •"}</p>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="bg-red-600/20 rounded-md p-2">
                        <ArrowDownRight className="size-6 text-red-400" />
                    </div>
                    <span className="dark:text-gray-400 text-sm">Gastos</span>
                    <p className="font-bold">{isVisible ? formatCurrency(Number(expense)) : "• • •"}</p>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="bg-gray-600/20 rounded-md p-2">
                        <Plus className="size-6 text-gray-400" />
                    </div>
                    <span className="dark:text-gray-400 text-sm">Beneficio</span>
                    <p className={`font-bold ${netProfit > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isVisible ? formatCurrency(netProfit) : "• • •"}
                    </p>
                </div>

                {/* <div className="flex flex-col items-center justify-center">
                    <div className="bg-gray-600/20 rounded-md p-2">
                        <DollarSign className="size-6 text-gray-400" />
                    </div>
                    <span className="dark:text-gray-400 text-sm">Ahorros</span>
                    <p className="font-bold">{saving}€</p>
                </div> */}
            </div>
        </div>
    )
}

export default MainBalance
