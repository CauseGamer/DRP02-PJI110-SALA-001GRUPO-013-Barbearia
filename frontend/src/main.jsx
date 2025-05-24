import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ContactPage from './pages/ContactPage.jsx'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router'
import AboutPage from './pages/AboutPage.jsx'
import AgendaPage from './pages/AgendaPage.jsx'
import Agendamentos from './pages/AgendadoPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "contato",
    element: <ContactPage/>
  },
  {
    path: "sobre",
    element: <AboutPage/>
  },
  {
    path: "agendar",
    element: <AgendaPage/>
  },
  {
    path: "agendamentos",
    element: <Agendamentos/>
  },
  {
    path: "admin",
    element: <AdminPage/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
