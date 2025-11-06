import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Globaalit tyylit
import './styles/global.css'
import './styles/components/buttons.css'
import './styles/components/cards.css'
import './styles/components/forms.css'
import './styles/components/header.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)