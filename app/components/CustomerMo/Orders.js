'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import '../Orders.css'
import API_URL from '../../utils/api'

function Orders() {
  const { user, canCancelOrder, hasRole } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(null)

  const getOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          'token': token
        }
      })
      
      if (response.ok) {
        const jsondata = await response.json()
        setOrders(jsondata)
      } else {
        toast.error('Failed to load orders')
      }
    } catch (err) {
      console.error(err.message)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  const handleCancelOrder = async (orderId) => {
    if (!canCancelOrder()) {
      toast.error('You do not have permission to cancel orders. Only Admins and Managers can cancel orders.')
      return
    }

    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          'token': token
        }
      })

      if (response.ok) {
        toast.success('Order cancelled successfully')
        getOrders()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to cancel order')
      }
    } catch (err) {
      console.error(err.message)
      toast.error('Failed to cancel order')
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    if (!hasRole('admin') && !hasRole('manager')) {
      toast.error('You do not have permission to change order status')
      return
    }

    setUpdatingStatus(orderId)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        toast.success(`Order status updated to ${newStatus}`)
        getOrders()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update order status')
      }
    } catch (err) {
      console.error(err.message)
      toast.error('Failed to update order status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      'pending': 'warning',
      'served': 'info',
      'delivered': 'success',
      'completed': 'success',
      'cancelled': 'danger'
    }
    return badges[status] || 'secondary'
  }

  const canManageOrders = () => {
    return hasRole('admin') || hasRole('manager')
  }

  // Group orders by country for admins
  const groupOrdersByCountry = (ordersList) => {
    if (!Array.isArray(ordersList)) return {}
    
    return ordersList.reduce((groups, order) => {
      const country = order.user_country || 'Unknown'
      if (!groups[country]) {
        groups[country] = []
      }
      groups[country].push(order)
      return groups
    }, {})
  }

  const renderOrdersTable = (ordersList, countryName) => {
    return (
      <div key={countryName} className="mb-4">
        {(user?.role === 'admin') && (
          <h4 className="mb-3" style={{ 
            color: '#da4453', 
            borderBottom: '2px solid #da4453', 
            paddingBottom: '0.5rem' 
          }}>
            {countryName === 'India' ? '🇮🇳' : countryName === 'America' ? '🇺🇸' : '🌍'} {countryName} ({ordersList.length} order{ordersList.length !== 1 ? 's' : ''})
          </h4>
        )}
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                {canManageOrders() && <th>Customer</th>}
                <th>Items</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordersList.map(order => (
                <tr key={order.order_id}>
                  <td>#{order.order_id}</td>
                  {canManageOrders() && (
                    <td>
                      <div className="customer-name">{order.user_name || 'Unknown'}</div>
                      {order.user_email && (
                        <div className="customer-email">{order.user_email}</div>
                      )}
                    </td>
                  )}
                  <td>
                    {order.items && typeof order.items === 'string' 
                      ? JSON.parse(order.items).length + ' items'
                      : Array.isArray(order.items) 
                        ? order.items.length + ' items'
                        : 'N/A'
                    }
                  </td>
                  <td>${parseFloat(order.total_amount || 0).toFixed(2)}</td>
                  <td>
                    {canManageOrders() ? (
                      <select
                        className="form-select form-select-sm status-select"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                        disabled={updatingStatus === order.order_id}
                        style={{
                          backgroundColor: getStatusBadge(order.status) === 'warning' ? '#ffc107' :
                                          getStatusBadge(order.status) === 'info' ? '#0dcaf0' :
                                          getStatusBadge(order.status) === 'success' ? '#198754' :
                                          getStatusBadge(order.status) === 'danger' ? '#dc3545' : '#6c757d',
                          color: 'white',
                          fontWeight: '600',
                          border: 'none',
                          cursor: updatingStatus === order.order_id ? 'not-allowed' : 'pointer',
                          opacity: updatingStatus === order.order_id ? 0.6 : 1
                        }}
                      >
                        <option value="pending" style={{ backgroundColor: '#ffc107', color: '#000' }}>Pending</option>
                        <option value="served" style={{ backgroundColor: '#0dcaf0', color: '#000' }}>Served</option>
                        <option value="delivered" style={{ backgroundColor: '#198754', color: '#fff' }}>Delivered</option>
                        <option value="completed" style={{ backgroundColor: '#198754', color: '#fff' }}>Completed</option>
                        <option value="cancelled" style={{ backgroundColor: '#dc3545', color: '#fff' }}>Cancelled</option>
                      </select>
                    ) : (
                      <span 
                        className={`badge bg-${getStatusBadge(order.status)}`}
                        style={{
                          fontSize: '1rem',
                          padding: '0.5rem 1rem',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}
                      >
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    {canManageOrders() ? (
                      updatingStatus === order.order_id ? (
                        <span className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Updating...</span>
                        </span>
                      ) : (
                        order.status === 'pending' && (
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancelOrder(order.order_id)}
                          >
                            Cancel
                          </button>
                        )
                      )
                    ) : (
                      canCancelOrder() && order.status === 'pending' && (
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelOrder(order.order_id)}
                        >
                          Cancel
                        </button>
                      )
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

  // Group orders by country for admins
  const ordersByCountry = (user?.role === 'admin') 
    ? groupOrdersByCountry(orders) 
    : { 'My Orders': orders }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{canManageOrders() ? 'All Orders' : 'My Orders'}</h2>
      
      {orders.length === 0 ? (
        <div className="alert alert-info">
          {canManageOrders() ? 'No orders found.' : 'You have no orders yet.'}
        </div>
      ) : (
        <>
          {Object.keys(ordersByCountry).map(country => renderOrdersTable(ordersByCountry[country], country))}
        </>
      )}
    </div>
  )
}

export default Orders
