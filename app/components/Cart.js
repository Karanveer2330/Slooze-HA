'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import API_URL from '../utils/api'

const Cart = () => {
  const { user, isAuthenticated, hasRole } = useAuth()
  const router = useRouter()
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const getmenu = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setMenu([])
        return
      }
      
          const response = await fetch(`${API_URL}/menu`, {
        headers: {
          'token': token
        }
      })
      
      if (response.ok) {
        const jsondata = await response.json()
        // Ensure jsondata is an array
        setMenu(Array.isArray(jsondata) ? jsondata : (jsondata.rows || []))
      } else {
        setMenu([])
        const error = await response.json().catch(() => ({ error: 'Failed to load cart' }))
        toast.error(error.error || 'Failed to load cart items')
      }
    } catch (err) {
      console.error(err.message)
      setMenu([])
      toast.error('Failed to load cart items')
    }
  }

  useEffect(() => {
    getmenu()
    if (isAuthenticated) {
      getPaymentMethods()
    }
  }, [isAuthenticated])

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
        // Set default payment method if available
        const defaultMethod = data.find(pm => pm.is_default)
        if (defaultMethod) {
          setSelectedPaymentMethod(defaultMethod.payment_id)
        } else if (data.length > 0) {
          setSelectedPaymentMethod(data[0].payment_id)
        }
      }
    } catch (err) {
      console.error(err.message)
    }
  }

  const deleteMenu = async (id) => {
    try {
      const token = localStorage.getItem('token')
          const deleteMenu = await fetch(`${API_URL}/menu/${id}`, {
        method: "DELETE",
        headers: {
          'token': token
        }
      })
      
      if (deleteMenu.ok) {
        setMenu(menu.filter(item => item.id !== id))
        toast.success('Item removed from cart')
      }
    } catch (err) {
      console.error(err.message)
      toast.error('Failed to remove item')
    }
  }

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout')
      router.push('/login')
      return
    }

    if (menu.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    if (!selectedPaymentMethod && paymentMethods.length > 0) {
      toast.error('Please select a payment method')
      return
    }

    if (paymentMethods.length === 0) {
      toast.error('Please add a payment method first')
      setShowPaymentForm(true)
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const totalAmount = Array.isArray(menu) ? menu.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0) : 0
      
      // Get restaurant_id from first item if available
      const restaurantId = menu[0]?.restaurant_id || 1
      
      const orderData = {
        restaurant_id: restaurantId,
        items: menu,
        total_amount: totalAmount,
        payment_method_id: selectedPaymentMethod
      }

          const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": token
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Order placed successfully!')
        setMenu([])
        router.push('/orders')
      } else {
        const error = await response.json()
        toast.error(error.error || error.message || 'Failed to place order')
      }
    } catch (err) {
      console.error(err.message)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const totalAmount = Array.isArray(menu) ? menu.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0) : 0

  // Group items by country for admins/managers
  const groupItemsByCountry = (items) => {
    if (!Array.isArray(items)) return {}
    
    return items.reduce((groups, item) => {
      const country = item.user_country || 'Unknown'
      if (!groups[country]) {
        groups[country] = []
      }
      groups[country].push(item)
      return groups
    }, {})
  }

  const itemsByCountry = (user?.role === 'admin' || user?.role === 'manager') 
    ? groupItemsByCountry(menu) 
    : { 'My Cart': Array.isArray(menu) ? menu : [] }

  const renderCartTable = (items, countryName) => {
    if (!Array.isArray(items) || items.length === 0) return null
    
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
    
    return (
      <div key={countryName} className="mb-4">
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <h4 className="mb-3" style={{ 
            color: '#da4453', 
            borderBottom: '2px solid #da4453', 
            paddingBottom: '0.5rem' 
          }}>
            {countryName === 'India' ? '🇮🇳' : countryName === 'America' ? '🇺🇸' : '🌍'} {countryName} ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h4>
        )}
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Ingredients</th>
              <th>Size</th>
              <th>Count</th>
              <th>Price</th>
              {(user?.role === 'admin' || user?.role === 'manager') && <th>Added By</th>}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.ing}</td>
                <td>{item.size}</td>
                <td>{item.count}</td>
                <td>${parseFloat(item.price || 0).toFixed(2)}</td>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <td>
                    <span className="badge bg-info">
                      {item.user_name || 'Unknown'}
                    </span>
                  </td>
                )}
                <td>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => deleteMenu(item.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="table-secondary">
            <tr>
              <td colSpan={(user?.role === 'admin' || user?.role === 'manager') ? 5 : 4} className="text-end fw-bold">
                Subtotal ({countryName}):
              </td>
              <td className="fw-bold">
                ${subtotal.toFixed(2)}
              </td>
              {(user?.role === 'admin' || user?.role === 'manager') && <td></td>}
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Shopping Cart</h2>
      
      {!Array.isArray(menu) || menu.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty. Add items from the menu to get started.
        </div>
      ) : (
        <>
          {Object.keys(itemsByCountry).map(country => renderCartTable(itemsByCountry[country], country))}

          <div className="mt-4 p-4 bg-light rounded">
            <h4 className="mb-3">Total: ${totalAmount.toFixed(2)}</h4>
            
            {isAuthenticated && (
              <div className="mb-3">
                <label className="form-label fw-bold">Select Payment Method</label>
                {paymentMethods.length === 0 ? (
                  <div className="alert alert-warning">
                    <p className="mb-2">No payment methods added. Please add one to continue.</p>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => router.push('/payment-methods')}
                    >
                      Add Payment Method
                    </button>
                  </div>
                ) : (
                  <select
                    className="form-select"
                    value={selectedPaymentMethod || ''}
                    onChange={(e) => setSelectedPaymentMethod(parseInt(e.target.value))}
                  >
                    <option value="">Select a payment method</option>
                    {paymentMethods.map(pm => (
                      <option key={pm.payment_id} value={pm.payment_id}>
                        {pm.method_type} - {pm.card_number || 'N/A'} {pm.is_default && '(Default)'}
                      </option>
                    ))}
                  </select>
                )}
                <div className="mt-2">
                  <a 
                    href="/payment-methods" 
                    className="text-decoration-none"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push('/payment-methods')
                    }}
                  >
                    Manage Payment Methods →
                  </a>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center">
              {!isAuthenticated ? (
                <div className="alert alert-warning mb-0 w-100">
                  <p className="mb-2">Please login to checkout</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => router.push('/login')}
                  >
                    Login
                  </button>
                </div>
              ) : hasRole('admin') || hasRole('manager') ? (
                <button 
                  className="btn btn-primary btn-lg" 
                  onClick={handleCheckout}
                  disabled={loading || !selectedPaymentMethod}
                >
                  {loading ? 'Processing...' : 'Checkout & Pay'}
                </button>
              ) : (
                <div className="alert alert-info mb-0 w-100">
                  <p className="mb-0">
                    <strong>Please ask a manager to process your order.</strong>
                  </p>
                  <p className="mb-0 mt-2" style={{ fontSize: '0.9rem' }}>
                    Members cannot checkout directly. Contact your manager to complete the order.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
