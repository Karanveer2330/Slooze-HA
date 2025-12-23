'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import API_URL from '../utils/api'

function PaymentMethods() {
  const { user, isAuthenticated, hasRole } = useAuth()
  const [paymentMethods, setPaymentMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    method_type: 'credit_card',
    card_number: '',
    card_holder_name: '',
    expiry_date: '',
    is_default: false
  })

  const getPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/payment-methods`, {
        headers: {
          'token': token
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPaymentMethods(data)
      }
    } catch (err) {
      console.error(err.message)
      toast.error('Failed to load payment methods')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      getPaymentMethods()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast.error('Please login to add payment methods')
        return
      }

      console.log('Adding payment method with token:', token ? 'Token exists' : 'No token')
      
      const response = await fetch(`${API_URL}/api/payment-methods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": token
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Payment method added successfully')
        setShowForm(false)
        setFormData({
          method_type: 'credit_card',
          card_number: '',
          card_holder_name: '',
          expiry_date: '',
          is_default: false
        })
        getPaymentMethods()
      } else {
        const error = await response.json().catch(() => ({ error: 'Failed to add payment method' }))
        console.error('Add payment method error:', error)
        if (response.status === 403) {
          toast.error('Access denied. Please login again.')
        } else {
          toast.error(error.error || error.message || 'Failed to add payment method')
        }
      }
    } catch (err) {
      console.error(err.message)
      toast.error('Failed to add payment method')
    }
  }

  const handleDelete = async (paymentId) => {
    if (!hasRole('admin') && !hasRole('manager')) {
      toast.error('Only administrators and managers can delete payment methods')
      return
    }

    if (!window.confirm('Are you sure you want to delete this payment method?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/payment-methods/${paymentId}`, {
        method: "DELETE",
        headers: {
          'token': token
        }
      })

      if (response.ok) {
        toast.success('Payment method deleted successfully')
        getPaymentMethods()
      } else {
        const error = await response.json().catch(() => ({ error: 'Failed to delete payment method' }))
        toast.error(error.error || 'Only administrators can delete payment methods')
      }
    } catch (err) {
      console.error(err.message)
      toast.error('Failed to delete payment method')
    }
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Payment Methods</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Payment Method'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Add New Payment Method</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Method Type</label>
                <select
                  className="form-select"
                  value={formData.method_type}
                  onChange={e => setFormData({...formData, method_type: e.target.value})}
                  required
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Card Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.card_number}
                  onChange={e => setFormData({...formData, card_number: e.target.value})}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Card Holder Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.card_holder_name}
                  onChange={e => setFormData({...formData, card_holder_name: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Expiry Date</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.expiry_date}
                  onChange={e => setFormData({...formData, expiry_date: e.target.value})}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={formData.is_default}
                  onChange={e => setFormData({...formData, is_default: e.target.checked})}
                />
                <label className="form-check-label">Set as default payment method</label>
              </div>
              <button type="submit" className="btn btn-primary">Add Payment Method</button>
            </form>
          </div>
        </div>
      )}

      {(hasRole('admin') || hasRole('manager')) && paymentMethods.length > 0 && (
        <div className="alert alert-info mb-3">
          <strong>Note:</strong> You can view and manage all payment methods. Card numbers are encrypted and only last 4 digits are shown.
        </div>
      )}

      {!hasRole('admin') && !hasRole('manager') && paymentMethods.length > 0 && (
        <div className="alert alert-info mb-3">
          <strong>Note:</strong> Only administrators and managers can update or delete payment methods. You can add new payment methods.
        </div>
      )}

      {paymentMethods.length === 0 ? (
        <div className="alert alert-info">
          No payment methods added yet.
        </div>
      ) : (
        <>
          {(() => {
            // Group payment methods by country for admins/managers
            const groupPaymentMethodsByCountry = (methods) => {
              if (!Array.isArray(methods)) return {}
              
              return methods.reduce((groups, method) => {
                const country = method.user_country || 'Unknown'
                if (!groups[country]) {
                  groups[country] = []
                }
                groups[country].push(method)
                return groups
              }, {})
            }

            const paymentMethodsByCountry = (hasRole('admin') || hasRole('manager')) 
              ? groupPaymentMethodsByCountry(paymentMethods) 
              : { 'My Payment Methods': paymentMethods }

            const renderPaymentMethodsTable = (methods, countryName) => {
              if (!Array.isArray(methods) || methods.length === 0) return null

              return (
                <div key={countryName} className="mb-4">
                  {(hasRole('admin') || hasRole('manager')) && (
                    <h4 className="mb-3" style={{ 
                      color: '#da4453', 
                      borderBottom: '2px solid #da4453', 
                      paddingBottom: '0.5rem' 
                    }}>
                      {countryName === 'India' ? '🇮🇳' : countryName === 'America' ? '🇺🇸' : '🌍'} {countryName} ({methods.length} {methods.length === 1 ? 'method' : 'methods'})
                    </h4>
                  )}
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead className="table-dark">
                        <tr>
                          <th>Method Type</th>
                          <th>Card Holder</th>
                          {(hasRole('admin') || hasRole('manager')) && <th>Owner</th>}
                          <th>Last 4 Digits</th>
                          <th>Expiry Date</th>
                          <th>Default</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {methods.map(payment => (
                          <tr key={payment.payment_id}>
                            <td>{payment.method_type}</td>
                            <td>{payment.card_holder_name}</td>
                            {(hasRole('admin') || hasRole('manager')) && (
                              <td>
                                <div>
                                  <strong>{payment.user_name || 'Unknown'}</strong>
                                  {payment.user_email && (
                                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                      {payment.user_email}
                                    </div>
                                  )}
                                </div>
                              </td>
                            )}
                            <td>{payment.card_number || 'N/A'}</td>
                            <td>{payment.expiry_date}</td>
                            <td>
                              {payment.is_default && (
                                <span className="badge bg-success">Default</span>
                              )}
                            </td>
                            <td>
                              {(hasRole('admin') || hasRole('manager')) && (
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDelete(payment.payment_id)}
                                >
                                  Delete
                                </button>
                              )}
                              {!hasRole('admin') && !hasRole('manager') && (
                                <span className="text-muted">Admin/Manager only</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            }

            return Object.keys(paymentMethodsByCountry).map(country => 
              renderPaymentMethodsTable(paymentMethodsByCountry[country], country)
            )
          })()}
        </>
      )}
    </div>
  )
}

export default PaymentMethods