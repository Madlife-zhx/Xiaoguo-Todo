import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { TasksProvider } from './state/TasksContext'
import './styles/tokens.css'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TasksProvider>
      <App />
    </TasksProvider>
  </StrictMode>
)
