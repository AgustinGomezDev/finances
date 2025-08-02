import { createFileRoute } from '@tanstack/react-router'
import NewTransaction from '../components/NewTransaction'

export const Route = createFileRoute('/nuevaTransaccion')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='dark:bg-gray-900'>
      <NewTransaction />
    </div>
  )
}
