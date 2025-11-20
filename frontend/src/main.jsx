import react from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './contexts/shopcontext.jsx'
import AuthContextProvider from './contexts/authcontext.jsx'

createRoot(document.getElementById('root')).render(

    <BrowserRouter>
    <AuthContextProvider>
    <ShopContextProvider>
        <App />
    </ShopContextProvider>
    </AuthContextProvider>
    
    
    </BrowserRouter>
  
)
