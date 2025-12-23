'use client'

import React, { useState, Fragment, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import './Navbar.css'
import API_URL from '../utils/api'

function Navbar() {
  const router = useRouter()
  const { isAuthenticated, user, setAuth, canManagePayments } = useAuth()
  const [name, setName] = useState('')

  const refreshPage = () => {
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  async function getName() {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) return

      const res = await fetch(`${API_URL}/dashboard/`, {
        method: 'GET',
        headers: { token: token }
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const parseRes = await res.json()
      setName(parseRes.user_name)
    } catch (err) {
      console.error(err.message)
    }
  }

  const logout = async (e) => {
    e.preventDefault()
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
      setAuth(false)
      toast.success('Logout successfully')
      router.push('/')
    } catch (err) {
      console.error(err.message)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      getName()
    }
  }, [isAuthenticated])

  return (
    <>
      <Fragment>
        <div className="bg">
          <nav className="navbar navbar-expand-lg navbar">
            <div className="container-fluid">
              <Link className="navbar-brand" href="/" style={{ paddingLeft: '2rem', color: 'white' }}>
                <h3 className="zaika" style={{ margin: 0 }}>
                  Zaika
                </h3>
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <ul className="navbar-nav ms-auto" style={{ paddingRight: '2em' }}>
                  <li className="nav-item">
                    <Link className="nav-link" href="/">
                      Home
                    </Link>
                  </li>
                  
                  {isAuthenticated && user ? (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" href="/PPMenu">
                          Menu
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" href="/cart">
                          Cart
                        </Link>
                      </li>
                      
                      {/* More Options Dropdown */}
                      <li className="nav-item dropdown">
                        <a 
                          className="nav-link dropdown-toggle" 
                          href="#" 
                          id="moreDropdown" 
                          role="button" 
                          data-bs-toggle="dropdown" 
                          aria-expanded="false"
                        >
                          More
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="moreDropdown">
                          <li>
                            <Link className="dropdown-item" href="/orders">
                              Orders
                            </Link>
                          </li>
                          {(user.role === 'admin' || user.role === 'manager') && (
                            <li>
                              <Link className="dropdown-item" href="/dashboard">
                                Dashboard
                              </Link>
                            </li>
                          )}
                          {isAuthenticated && (
                            <li>
                              <Link className="dropdown-item" href="/payment-methods">
                                Payment Methods
                              </Link>
                            </li>
                          )}
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <Link className="dropdown-item" href="/about">
                              About us
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" href="/about">
                              Customer Service
                            </Link>
                          </li>
                        </ul>
                      </li>

                      {/* User Dropdown */}
                      <li className="nav-item dropdown">
                        <a 
                          className="nav-link dropdown-toggle" 
                          href="#" 
                          id="userDropdown" 
                          role="button" 
                          data-bs-toggle="dropdown" 
                          aria-expanded="false"
                        >
                          {name || user.name || 'User'} ({user.role})
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                          <li>
                            <span className="dropdown-item-text">
                              <small>Logged in as {name || user.name}</small>
                            </span>
                          </li>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <Link className="dropdown-item" href="/login" onClick={logout}>
                              Logout
                            </Link>
                          </li>
                        </ul>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" href="/about">
                          About
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" href="/login">
                          <img src="/6681204.png" style={{ height: '1.5em', verticalAlign: 'middle' }} alt="login" />
                          <span style={{ marginLeft: '0.5rem' }}>Login</span>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </Fragment>
    </>
  )
}

export default Navbar
