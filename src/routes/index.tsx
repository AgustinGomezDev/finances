import { createFileRoute } from '@tanstack/react-router'
import Dashboard from "../components/Dashboard"


export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className='dark'>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors pt-5">
        <Dashboard />
      </div>
    </div>
  )
}