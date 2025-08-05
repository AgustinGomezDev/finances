import { useEffect, useState } from "react"
import MainBalance from './MainBalance'
import NewTransactionButton from './NewTransactionButton'
import TransactionItem from './TransactionItem'
import { getCurrentMonthTransactions, getUserSummary } from "../services/firebaseService"
import type { Transaction } from "../types/transaction"
import { useAuthStore } from "../stores/useAuthStore"
import { Link } from "@tanstack/react-router"

const Dashboard = () => {
    const user = useAuthStore((state) => state.user);

    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    const [totalMonthIncome, setTotalMonthIncome] = useState(0);
    const [totalMonthExpense, setTotalMonthExpense] = useState(0);

    const [userSummary, setUserSummary] = useState({ totalIncome: 0, totalExpense: 0 })

    useEffect(() => {
        async function fetchTransactions() {
            if (!user) return;

            setLoading(true);
            try {
                const allCurrentMonth = await getCurrentMonthTransactions(user.uid);
                const summary = await getUserSummary(user.uid);
                if (summary) setUserSummary(summary);

                const income = allCurrentMonth
                    .filter((t) => t.type === "income")
                    .reduce((sum, t) => sum + t.amount, 0);

                const expense = allCurrentMonth
                    .filter((t) => t.type === "expense")
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

                setTotalMonthIncome(income);
                setTotalMonthExpense(expense);

                const latestFive = allCurrentMonth
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5);

                setTransactions(latestFive);
            } catch (error) {
                console.error("Error al obtener transacciones:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTransactions();
    }, [user]);

    console.log(loading)

    return (
        <div className='container mx-auto px-4'>
            <MainBalance
                totalBalance={((Number(userSummary.totalIncome) || 0) - (Number(userSummary.totalExpense) || 0)).toFixed(2)}
                changeText="+12.5%"
                changeType="up"
                income={totalMonthIncome}
                expense={totalMonthExpense}
                saving="2566.38"
            />
            <div className='mt-5 md:col-span-3 dark:bg-gray-800 border border-gray-500 rounded-2xl  text-white shadow-lg dark:shadow-2xl'>
                <div className='flex items-center justify-between p-6 border-b dark:border-gray-500'>
                    <p className='text-xl font-medium'>Transacciones recientes</p>
                    <Link to="/transacciones">
                        <p className='text-sm dark:text-gray-400'>Ver todas</p>
                    </Link>
                </div>
                <div>
                    {transactions.map((transaction, index) => (
                        <div
                            key={`${transaction.id}-${index}`}
                        >
                            <TransactionItem transaction={transaction} />
                        </div>

                    ))}
                </div>
            </div>
            <NewTransactionButton />
        </div>
    )
}

export default Dashboard