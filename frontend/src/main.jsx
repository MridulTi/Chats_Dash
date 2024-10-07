import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './Context/Context.jsx'
import { ThemeProvider } from '@material-tailwind/react'
import { ErrorProvider } from './Context/ErrorContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorProvider>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </ErrorProvider>
  </StrictMode>,
)
