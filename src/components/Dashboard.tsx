import MainBalance from './MainBalance'
import NewTransactionButton from './NewTransactionButton'
import TransactionItem from './TransactionItem'

const Dashboard = () => {
    const recentTransactions = [
        {
            id: 1,
            title: "Supermercado",
            amount: -45.5,
            category: "Alimentación",
            date: "Hoy",
            type: "expense",
            color: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
        },
        {
            id: 2,
            title: "Salario",
            amount: 2500.0,
            category: "Trabajo",
            date: "Ayer",
            type: "income",
            color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
        },
        {
            id: 3,
            title: "Netflix",
            amount: -12.99,
            category: "Entretenimiento",
            date: "2 días",
            type: "expense",
            color: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
        },
        {
            id: 4,
            title: "Freelance",
            amount: 350.0,
            category: "Trabajo",
            date: "3 días",
            type: "income",
            color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
        },
    ]

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
                    {recentTransactions.map((transaction, index) => (
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