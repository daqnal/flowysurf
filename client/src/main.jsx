import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Apply saved theme before mounting React so theme-dependent UI renders correctly on first paint
try {
  const saved = localStorage.getItem('flowymap-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    window.flowyTheme = saved;
  }
} catch (e) {
  // ignore
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
