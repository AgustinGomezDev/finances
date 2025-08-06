import { createFileRoute } from '@tanstack/react-router'
import UpdateTransaction from '../components/UpdateTransaction'
import { useAuthStore } from '../stores/useAuthStore';
import { useState, useEffect } from 'react'
import type { Transaction } from '../types/transaction';
import { getTransactionById } from '../services/transactionService';

export const Route = createFileRoute('/editarTransaccion/$transactionId')({
    component: RouteComponent,
})

function RouteComponent() {
    const { transactionId } = Route.useParams()
    const user = useAuthStore((state) => state.user);

    const [transaction, setTransaction] = useState<Transaction | null>(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        async function fetchTransaction() {
            if (!transactionId) return

            setLoading(true)
            const trx = await getTransactionById(transactionId)
            setTransaction(trx)
            setLoading(false)
        }
        fetchTransaction()
    }, [transactionId])

    if (loading) return <div>Cargando transacción...</div>
    if (!transaction) return <div>No se encontró la transacción</div>
    // if (!user) return <div>Acceso no autorizado</div>

    return (
        <>
        {user && transaction
        ? <UpdateTransaction user={user} transaction={transaction} />
        : null
        }
            
        </>
    )
}
