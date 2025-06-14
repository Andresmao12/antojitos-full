import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MyRoutes from '../src/routes/Routes'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MyRoutes />
  </StrictMode>,
)
