'use client'

import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import Script from 'next/script'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Zaika - Food Delivery App</title>
        <link rel="icon" href="/fav.png" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN"
          crossOrigin="anonymous"
        />
        <AuthProvider>
          <div className="hex">
            <Navbar />
            <div className="container my-3">
              {children}
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}