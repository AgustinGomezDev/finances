import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Header from "../components/Header"
import Navigation from "../components/Navigation"
import { AuthWatcher } from '../providers/AuthProvider'

export const Route = createRootRoute({
    component: () => (
        <div className='dark'>
            <AuthWatcher />
            <Header />
            <Outlet />
            <Navigation />
            <TanStackRouterDevtools />
        </div>
    ),
})