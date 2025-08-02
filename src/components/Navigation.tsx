import { Link } from "@tanstack/react-router"
import { Home, CreditCard, PieChart, Settings } from "lucide-react"

const Navigation = () => {
    const navItems = [
        { id: "/", icon: Home, label: "Inicio" },
        { id: "transacciones", icon: CreditCard, label: "Transacciones" },
        { id: "/presupuestos", icon: PieChart, label: "Presupuestos" },
        { id: "/", icon: Settings, label: "Configuración" },
    ]

    return (
        <div className="dark:bg-gray-800 border-t dark:border-gray-700 fixed bottom-0 w-full">
            <div className="flex items-center justify-around max-w-7xl mx-auto container dark:text-white p-2">
                {navItems.map((item) => {
                    // const isActive = currentScreen === item.id
                    return (
                        <Link to={item.id}>
                            <button
                                key={item.id}
                                // onClick={() => onNavigate(item.id)}
                                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 hover:cursor-pointer`}
                            >
                                <item.icon className="w-5 h-5 mb-1" />
                                <span className="text-xs font-medium">{item.label}</span>
                            </button>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default Navigation