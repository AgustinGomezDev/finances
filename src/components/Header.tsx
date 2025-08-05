import { Link } from "@tanstack/react-router"
import { User } from "lucide-react"
import { useAuthStore } from '../stores/useAuthStore';
import { logout } from "../services/authService";

const Header = () => {
    const user = useAuthStore((state) => state.user);

    return (
        <header className='dark:bg-gray-800 border-b dark:border-gray-700'>
            <div className="flex items-center justify-between container mx-auto px-4 py-5">
                {user
                    ? <div>
                        <p className='text-2xl font-semibold dark:text-white'>MyFinances</p>
                        <p className='text-sm dark:text-gray-400'>Hola, {user.displayName}</p>
                    </div>
                    : <div>
                        <p className='text-2xl font-semibold dark:text-white'>MyFinances</p>
                        <p className='text-sm dark:text-gray-400'>Gestiona tus finanzas</p>
                    </div>
                }
                <div className="flex items-center space-x-3">
                    {/* <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Bell className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full shadow-sm"></span>
                    </button> */}
                    {/* <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-full flex items-center justify-center shadow-md">
                        <User className="w-6 h-6 text-white" />
                    </div> */}
                    {user
                        ? <div className="relative group">
                            <button className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                                <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            </button>
                            {/* Dropdown Menu */}
                            <div className="cursor-pointer absolute right-0 top-full w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible hover:opacity-100 hover:visible transition-all duration-200 z-50">
                                <div className="p-2">
                                    <button className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors cursor-pointer">Configuración</button>
                                    <button onClick={() => logout()} className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors cursor-pointer">Cerrar Sesión</button>
                                </div>
                            </div>
                        </div>

                        : <div className="flex items-center space-x-2">
                            <Link to="/autenticacion" search={{ mode: "login" }}>
                                <button className="cursor-pointer px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Iniciar Sesión</button>
                            </Link>
                            <Link to="/autenticacion" search={{ mode: "register" }}>
                                <button className="cursor-pointer px-4 py-2 text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">Registrarse</button>
                            </Link>
                        </div>
                    }

                </div>
            </div>
        </header>
    )
}

export default Header