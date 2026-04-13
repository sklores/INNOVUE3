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

function renderFatalError(message: string): void {
  const node = getMountNode()
  node.innerHTML = ''

  const panel = document.createElement('pre')
  panel.textContent = message
  panel.style.whiteSpace = 'pre-wrap'
  panel.style.padding = '1rem'
  panel.style.margin = '1rem'
  panel.style.border = '2px solid #b91c1c'
  panel.style.background = '#fef2f2'
  panel.style.color = '#7f1d1d'
  panel.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, monospace'

  node.appendChild(panel)
}

window.addEventListener('error', (event) => {
  renderFatalError(`Startup error:\n${event.message}`)
})

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason instanceof Error ? event.reason.message : String(event.reason)
  renderFatalError(`Unhandled promise rejection:\n${reason}`)
})

try {
  createRoot(getMountNode()).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  renderFatalError(`Render failed:\n${message}`)
}
