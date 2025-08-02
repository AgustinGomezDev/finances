import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/presupuestos')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className='dark:bg-gray-900 min-h-screen'>
            <div className='px-4 py-4 max-w-7xl mx-auto'>
                
            </div>
        </div>
    )
}
