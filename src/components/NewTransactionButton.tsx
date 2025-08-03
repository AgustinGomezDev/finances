import { Link } from "@tanstack/react-router"
import { Plus } from "lucide-react"

const NewTransactionButton = () => {
  return (
    <Link to="/nuevaTransaccion">
      <button className="fixed bottom-24 right-4 bg-slate-900 dark:bg-white/60 text-white dark:text-slate-900 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:cursor-pointer dark:hover:bg-white/80">
          <Plus className="w-6 h-6" />
      </button>
    </Link>
  )
}

export default NewTransactionButton