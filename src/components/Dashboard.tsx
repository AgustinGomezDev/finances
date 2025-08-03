import { useEffect, useState } from "react"
import MainBalance from './MainBalance'
import NewTransactionButton from './NewTransactionButton'
import TransactionItem from './TransactionItem'
import { getLastTransactions } from "../services/firebaseService"
import type { Transaction } from "../types/transaction"

const Dashboard = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        async function fetchTransactions() {
            setLoading(true)
            try {
                const data = await getLastTransactions(5)
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

    return (
        <div className='container mx-auto px-4'>
            <MainBalance
                totalBalance="3750"
                changeText="+12.5%"
                changeType="up"
                income="953"
                expense="527"
                saving="2728"
            />
            <div className='mt-5 md:col-span-3 dark:bg-gray-800 border border-gray-500 rounded-2xl  text-white shadow-lg dark:shadow-2xl'>
                <div className='flex items-center justify-between p-6 border-b dark:border-gray-500'>
                    <p className='text-xl font-medium'>Transacciones recientes</p>
                    <p className='text-sm dark:text-gray-400'>Ver todas</p>
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