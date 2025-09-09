import { useEffect, useState } from "react"
import MainBalance from './MainBalance'
import NewTransactionButton from './NewTransactionButton'
import TransactionItem from './TransactionItem'
import { getTransactionsByDateRange } from "../services/transactionService"
// import { getCurrentMonthTransactions } from "../services/transactionService"
// import { getUserSummary } from "../services/userSummaryService"
import type { Transaction } from "../types/transaction"
import { useAuthStore } from "../stores/useAuthStore"
import { Link } from "@tanstack/react-router"
import { motion } from "motion/react"

const Dashboard = () => {
    const user = useAuthStore((state) => state.firestoreUser);

    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    const [totalMonthIncome, setTotalMonthIncome] = useState(0);
    const [totalMonthExpense, setTotalMonthExpense] = useState(0);

    const [userSummary, setUserSummary] = useState({ totalIncome: 0, totalExpense: 0 })

    const now = new Date();
    const start = new Date();
    start.setDate(now.getDate() - 30);

    useEffect(() => {
        async function fetchTransactions() {
            if (!user) return;

            setLoading(true);
            try {
                const last30days = await getTransactionsByDateRange(user.uid, start, now);
                // const allCurrentMonth = await getCurrentMonthTransactions(user.uid);
                // const summary = await getUserSummary(user.uid);
                setUserSummary({ totalExpense: user.totalExpense, totalIncome: user.totalIncome });

                const income = last30days
                    .filter((t) => t.type === "income")
                    .reduce((sum, t) => sum + t.amount, 0);

                const expense = last30days
                    .filter((t) => t.type === "expense")
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

                setTotalMonthIncome(income);
                setTotalMonthExpense(expense);

                const latestFive = last30days
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
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
                <MainBalance
                    totalBalance={((Number(userSummary.totalIncome) || 0) - (Number(userSummary.totalExpense) || 0)).toFixed(2)}
                    changeText="+12.5%"
                    changeType="up"
                    income={totalMonthIncome}
                    expense={totalMonthExpense}
                    saving="2566.38"
                />
            </motion.div>
            <motion.div
                className='mt-5 md:col-span-3 dark:bg-gray-800 border border-gray-500 rounded-2xl  text-white shadow-lg dark:shadow-2xl'
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
                <div className='flex items-center justify-between p-6 border-b dark:border-gray-500'>
                    <p className='text-xl font-medium'>Transacciones recientes</p>
                    <Link to="/transacciones">
                        <p className='text-sm dark:text-gray-400'>Ver todas</p>
                    </Link>
                </div>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.1 } },
                    }}
                >
                    {transactions.map((transaction, index) => (
                        <motion.div
                            key={`${transaction.id}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 20,
                                delay: index * 0.1,
                            }}
                        >
                            <TransactionItem transaction={transaction} editable={false} />
                        </motion.div>

                    ))}
                </motion.div>
            </motion.div>
            <NewTransactionButton />
        </div>
    )
}

export default Dashboard