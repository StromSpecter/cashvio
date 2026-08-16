import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from './lib/theme.jsx'
import { AuthProvider } from './lib/auth.jsx'
import { InvestmentProvider } from './lib/investment-store.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <InvestmentProvider>
            <App />
          </InvestmentProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
