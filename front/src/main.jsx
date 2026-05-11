import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MyRoutes from '../src/routes/Routes'
import { ThemeProvider } from './context/ThemeContext'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <MyRoutes />
    </ThemeProvider>
  </StrictMode>,
)
