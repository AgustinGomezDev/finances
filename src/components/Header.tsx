import { Bell, User } from "lucide-react"

const Header = () => {
    return (
        <header className='dark:bg-gray-800 border-b dark:border-gray-700'>
            <div className="flex items-center justify-between container mx-auto px-4 py-5">
                <p className='text-2xl font-semibold dark:text-white'>¡Hola, Agustín! 👋</p>
                <div className="flex items-center space-x-3">
                    <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Bell className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full shadow-sm"></span>
                    </button>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-full flex items-center justify-center shadow-md">
                        <User className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header