import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

function getMountNode(): HTMLElement {
  const existing = document.getElementById('root')
  if (existing) return existing

  const fallback = document.createElement('div')
  fallback.id = 'root'
  document.body.appendChild(fallback)
  return fallback
}

createRoot(getMountNode()).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
