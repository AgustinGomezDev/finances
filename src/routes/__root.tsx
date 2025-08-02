import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Header from "../components/Header"
import Navigation from "../components/Navigation"

export const Route = createRootRoute({
    component: () => (
        <div className='dark'>
            <Header />
            <Outlet />
            <Navigation />
            <TanStackRouterDevtools />
        </div>
    ),
})