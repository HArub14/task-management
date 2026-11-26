import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppHeader } from './components/layout/AppHeader'
import { TaskListPage } from './components/tasks/TaskListPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppHeader />
        <Routes>
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/" element={<Navigate to="/tasks" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
