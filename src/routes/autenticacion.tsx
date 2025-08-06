import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"
import { login, loginWithGoogle, register } from '../services/authService'
import { useNavigate } from "@tanstack/react-router"

export const Route = createFileRoute('/autenticacion')({
    component: RouteComponent,
    validateSearch: (search) => {
        return {
            mode: search.mode === 'register' ? 'register' : 'login'
        }
    }
})

function RouteComponent() {
    const navigate = useNavigate()
    const { mode } = Route.useSearch()

    const [isLogin, setIsLogin] = useState(mode === 'login')
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (isLogin === true) {
            await login(formData.email, formData.password)
            navigate({ to: '/' })
        } else {
            await register(formData.email, formData.password, formData.name)
            navigate({ to: '/' })
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    useEffect(() => {
        setIsLogin(mode === 'login')
    }, [mode])

    return (
        <div className='dark:bg-gray-900 min-h-screen p-4'>
            <div className="flex items-center justify-center">
                <button
                    onClick={() => navigate({ to: '/' })}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer absolute left-0 ml-5"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white text-center">{isLogin === true ? 'Iniciar Sesión' : 'Registrarse'}</h1>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mt-3">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field (only for register) */}
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Nombre completo
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Tu nombre completo"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 border-0"
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Correo electrónico
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="tu@email.com"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 border-0"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Tu contraseña"
                                className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 border-0"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field (only for register) */}
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Confirmar contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirma tu contraseña"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 border-0"
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    {/* Forgot Password (only for login) */}
                    {isLogin && (
                        <div className="text-right">
                            <button
                                type="button"
                                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 cursor-pointer"
                    >
                        {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                    </button>
                </form>

                {/* Toggle Auth Mode */}
                <div className="mt-6 text-center">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-1 text-slate-900 dark:text-white font-medium hover:underline cursor-pointer"
                        >
                            {isLogin ? "Registrarse" : "Iniciar Sesión"}
                        </button>
                    </p>
                </div>

                {/* Social Login (Optional) */}
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                O continúa con
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-center gap-3">
                        <button
                            type="button"
                            className="w-full py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium cursor-pointer"
                            onClick={() => loginWithGoogle()}
                        >
                            Google
                        </button>
                        {/* <button
                            type="button"
                            className="w-full py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                        >
                            Apple
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
