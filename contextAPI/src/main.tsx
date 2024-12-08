import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App/App'
import { ProblemApp } from './ProblemApp/ProblemApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <ProblemApp/>
  </StrictMode>,
)