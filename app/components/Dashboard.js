'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import './Dashboard.css'
import API_URL from '../utils/api'

function Dashboard() {
  const { user, hasRole, checkAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('restaurants')
  const [restaurants, setRestaurants] = useState([])
  const [foodItems, setFoodItems] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)
  const [deliveryAvailable, setDeliveryAvailable] = useState(false)
  const [offers, setOffers] = useState('')

  // Restaurant form state
  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    description: '',
    location: '',
    country: user?.country || 'India',
    image_url: ''
  })
  const [editingRestaurant, setEditingRestaurant] = useState(null)

  // Food item form state
  const [foodForm, setFoodForm] = useState({
    fname: '',
    f_ing: '',
    f_img: '',
    f_price: '',
    restaurant_id: ''
  })
  const [editingFood, setEditingFood] = useState(null)

  // Fetch data
  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/restaurants`, {
        headers: { token }
      })
      if (res.ok) {
        const data = await res.json()
        // Handle both old format (array) and new format (object with restaurants, delivery_available, offers)
        if (Array.isArray(data)) {
          console.log('Fetched restaurants:', data.length, 'restaurants')
          setRestaurants(data)
        } else {
          console.log('Fetched restaurants:', data.restaurants?.length || 0, 'restaurants')
          setRestaurants(data.restaurants || [])
        }
      } else {
        const errorData = await res.json().catch(() => ({ error: res.statusText }))
        console.error('Failed to fetch restaurants:', errorData)
        if (res.status === 403) {
          toast.error('Access denied. Make sure you have admin or manager role.')
        }
      }
    } catch (err) {
      console.error('Fetch restaurants error:', err)
      toast.error('Failed to load restaurants: ' + err.message)
    }
  }

  const fetchFoodItems = async () => {
    try {
      // Try new endpoint first, fallback to old one
      let res = await fetch(`${API_URL}/api/food-items`)
      if (!res.ok) {
        res = await fetch('${API_URL}/items')
      }
      if (res.ok) {
        const data = await res.json()
        setFoodItems(data)
      }
    } catch (err) {
      toast.error('Failed to load food items')
    }
  }

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('${API_URL}/api/orders', {
        headers: { token }
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (err) {
      toast.error('Failed to load orders')
    }
  }

  const fetchUsers = async () => {
    if (!hasRole('admin')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('${API_URL}/api/users', {
        headers: { token }
      })
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (err) {
      toast.error('Failed to load users')
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('${API_URL}/api/dashboard/stats', {
        headers: { token }
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (err) {
      // Stats endpoint might not exist yet
    }
  }

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('${API_URL}/api/restaurants/settings', {
        headers: { token }
      })
      if (res.ok) {
        const data = await res.json()
        setDeliveryAvailable(data.delivery_available || false)
        setOffers(data.offers || '')
      }
    } catch (err) {
      console.error('Failed to load settings:', err)
    }
  }

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('${API_URL}/api/restaurants/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify({
          delivery_available: deliveryAvailable,
          offers: offers
        })
      })
      if (res.ok) {
        toast.success('Settings saved successfully!')
        fetchSettings()
      } else {
        const errorData = await res.json().catch(() => ({ error: res.statusText }))
        toast.error(errorData.error || 'Failed to save settings')
      }
    } catch (err) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Always fetch restaurants first (needed for food items dropdown)
    fetchRestaurants()
  }, [])

  useEffect(() => {
    // Fetch data when switching tabs
    if (activeTab === 'food') {
      fetchFoodItems()
      fetchRestaurants() // Refresh restaurants when opening food tab
    }
    if (activeTab === 'orders') fetchOrders()
    if (activeTab === 'users' && hasRole('admin')) fetchUsers()
    if (activeTab === 'stats') fetchStats()
    if (activeTab === 'settings') fetchSettings()
  }, [activeTab, hasRole])

  // Restaurant CRUD
  const handleRestaurantSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const url = editingRestaurant
        ? `${API_URL}/api/restaurants/${editingRestaurant.restaurant_id}`
        : `${API_URL}/api/restaurants`
      
      const method = editingRestaurant ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify(restaurantForm)
      })

      if (res.ok) {
        toast.success(editingRestaurant ? 'Restaurant updated!' : 'Restaurant added!')
        setRestaurantForm({ name: '', description: '', location: '', country: user?.country || 'India', image_url: '' })
        setEditingRestaurant(null)
        // Refresh restaurants list and wait for it to complete
        await fetchRestaurants()
        // Force a small delay to ensure state update
        setTimeout(() => {
          console.log('Current restaurants in state:', restaurants.length)
        }, 100)
      } else {
        const errorData = await res.json().catch(() => ({ error: res.statusText }))
        console.error('Restaurant save error:', errorData)
        console.error('Current user from context:', user)
        console.error('Token in localStorage:', localStorage.getItem('token') ? 'Present' : 'Missing')
        
        if (res.status === 403) {
          const token = localStorage.getItem('token')
          let tokenRole = 'unknown'
          if (token) {
            try {
              const parts = token.split('.')
              if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]))
                tokenRole = payload.role || 'none'
              }
            } catch (e) {
              // Ignore
            }
          }
          toast.error(
            `🚫 Access Denied! Your JWT token has role: "${tokenRole}". ` +
            `Context shows: "${user?.role || 'none'}". ` +
            `You MUST logout and login again to refresh your token.`,
            { autoClose: 10000 }
          )
        } else {
          toast.error(errorData.error || errorData.message || 'Failed to save restaurant')
        }
      }
    } catch (err) {
      toast.error('Failed to save restaurant')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRestaurant = async (id) => {
    if (!confirm('Are you sure you want to delete this restaurant?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/restaurants/${id}`, {
        method: 'DELETE',
        headers: { token }
      })
      if (res.ok) {
        toast.success('Restaurant deleted!')
        fetchRestaurants()
      } else {
        toast.error('Failed to delete restaurant')
      }
    } catch (err) {
      toast.error('Failed to delete restaurant')
    }
  }

  // Food Item CRUD
  const handleFoodSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('No authentication token found. Please login again.')
        setLoading(false)
        return
      }
      
      const url = editingFood
        ? `${API_URL}/api/food-items/${editingFood.id}`
        : `${API_URL}/api/food-items`
      
      const method = editingFood ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify(foodForm)
      })

      if (res.ok) {
        toast.success(editingFood ? 'Food item updated!' : 'Food item added!')
        setFoodForm({ fname: '', f_ing: '', f_img: '', f_price: '', restaurant_id: '' })
        setEditingFood(null)
        fetchFoodItems()
      } else {
        const errorData = await res.json().catch(() => ({ error: res.statusText }))
        console.error('Food item save error:', errorData)
        if (res.status === 403) {
          let tokenRole = 'unknown'
          if (token) {
            try {
              const parts = token.split('.')
              if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]))
                tokenRole = payload.role || 'none'
              }
            } catch (e) {
              // Ignore
            }
          }
          toast.error(
            `🚫 Access Denied! Your JWT token has role: "${tokenRole}". ` +
            `You MUST logout and login again to refresh your token.`,
            { autoClose: 10000 }
          )
        } else {
          toast.error(errorData.error || errorData.message || 'Failed to save food item')
        }
      }
    } catch (err) {
      toast.error('Failed to save food item')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFood = async (id) => {
    if (!confirm('Are you sure you want to delete this food item?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/food-items/${id}`, {
        method: 'DELETE',
        headers: { token }
      })
      if (res.ok) {
        toast.success('Food item deleted!')
        fetchFoodItems()
      } else {
        toast.error('Failed to delete food item')
      }
    } catch (err) {
      toast.error('Failed to delete food item')
    }
  }

  // Order management
  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        toast.success('Order status updated!')
        fetchOrders()
      } else {
        toast.error('Failed to update order status')
      }
    } catch (err) {
      toast.error('Failed to update order status')
    }
  }

  // Debug: Check token role
  const checkTokenRole = () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const parts = token.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]))
          console.log('JWT Token contains:', payload)
          alert(`Your JWT Token Role: ${payload.role || 'none'}\n\nIf this is not "admin" or "manager", you need to logout and login again.`)
        }
      } catch (e) {
        console.error('Error decoding token:', e)
      }
    }
  }

  if (!hasRole('admin') && !hasRole('manager')) {
    return (
      <div className="dashboard-container">
        <div className="alert alert-warning">
          <h3>Access Denied</h3>
          <p>Admin or Manager role required.</p>
          <p>Current user: {user?.name || 'Unknown'} | Role: {user?.role || 'None'}</p>
          <p><strong>⚠️ IMPORTANT:</strong> If you just changed your role in pgAdmin, your JWT token still has the old role. You MUST logout and login again to get a new token.</p>
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff3cd', borderRadius: '4px' }}>
            <p><strong>Quick Check:</strong> Click the button below to see what role is in your JWT token:</p>
            <button onClick={checkTokenRole} style={{ padding: '0.5rem 1rem', background: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '1rem' }}>
              Check Token Role
            </button>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => {
              localStorage.removeItem('token')
              window.location.href = '/login'
            }} style={{ padding: '0.75rem 1.5rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              🔄 Logout and Login Again (REQUIRED)
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.name} ({user?.role})</p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'restaurants' ? 'active' : ''}
          onClick={() => setActiveTab('restaurants')}
        >
          Restaurants
        </button>
        <button
          className={activeTab === 'food' ? 'active' : ''}
          onClick={() => setActiveTab('food')}
        >
          Food Items
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={activeTab === 'payment-methods' ? 'active' : ''}
          onClick={() => setActiveTab('payment-methods')}
        >
          Payment Methods
        </button>
        {hasRole('admin') && (
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        )}
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        {(hasRole('admin') || hasRole('manager')) && (
          <button
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        )}
      </div>

      <div className="dashboard-content">
        {/* Restaurants Tab */}
        {activeTab === 'restaurants' && (
          <div>
            <h2>Restaurant Management</h2>
            <form onSubmit={handleRestaurantSubmit} className="dashboard-form">
              <input
                type="text"
                placeholder="Restaurant Name"
                value={restaurantForm.name}
                onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={restaurantForm.description}
                onChange={(e) => setRestaurantForm({ ...restaurantForm, description: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={restaurantForm.location}
                onChange={(e) => setRestaurantForm({ ...restaurantForm, location: e.target.value })}
                required
              />
              <select
                value={restaurantForm.country}
                onChange={(e) => setRestaurantForm({ ...restaurantForm, country: e.target.value })}
                required
              >
                <option value="India">India</option>
                <option value="America">America</option>
              </select>
              <input
                type="text"
                placeholder="Image URL"
                value={restaurantForm.image_url}
                onChange={(e) => setRestaurantForm({ ...restaurantForm, image_url: e.target.value })}
              />
              <button type="submit" disabled={loading}>
                {editingRestaurant ? 'Update Restaurant' : 'Add Restaurant'}
              </button>
              {editingRestaurant && (
                <button type="button" onClick={() => {
                  setEditingRestaurant(null)
                  setRestaurantForm({ name: '', description: '', location: '', country: user?.country || 'India', image_url: '' })
                }}>
                  Cancel
                </button>
              )}
            </form>

            <div className="dashboard-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Country</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map((rest) => (
                    <tr key={rest.restaurant_id}>
                      <td>{rest.restaurant_id}</td>
                      <td>{rest.name}</td>
                      <td>{rest.location}</td>
                      <td>{rest.country}</td>
                      <td>
                        <button onClick={() => {
                          setEditingRestaurant(rest)
                          setRestaurantForm({
                            name: rest.name,
                            description: rest.description || '',
                            location: rest.location,
                            country: rest.country,
                            image_url: rest.image_url || ''
                          })
                        }}>Edit</button>
                        <button onClick={() => handleDeleteRestaurant(rest.restaurant_id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Food Items Tab */}
        {activeTab === 'food' && (
          <div>
            <h2>Food Items Management</h2>
            <form onSubmit={handleFoodSubmit} className="dashboard-form">
              <input
                type="text"
                placeholder="Food Name"
                value={foodForm.fname}
                onChange={(e) => setFoodForm({ ...foodForm, fname: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Ingredients"
                value={foodForm.f_ing}
                onChange={(e) => setFoodForm({ ...foodForm, f_ing: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Image URL/Path"
                value={foodForm.f_img}
                onChange={(e) => setFoodForm({ ...foodForm, f_img: e.target.value })}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={foodForm.f_price}
                onChange={(e) => setFoodForm({ ...foodForm, f_price: e.target.value })}
                required
              />
              <select
                key={`restaurant-select-${restaurants.length}`}
                value={foodForm.restaurant_id}
                onChange={(e) => setFoodForm({ ...foodForm, restaurant_id: e.target.value })}
              >
                <option value="">Select Restaurant (Optional)</option>
                {restaurants.length > 0 ? (
                  restaurants.map((r) => (
                    <option key={r.restaurant_id} value={r.restaurant_id}>
                      {r.name} ({r.location}, {r.country})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No restaurants available. Add a restaurant first.</option>
                )}
              </select>
              {restaurants.length > 0 && (
                <small style={{ color: '#666', fontSize: '0.9rem' }}>
                  {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} available
                </small>
              )}
              <button type="submit" disabled={loading}>
                {editingFood ? 'Update Food Item' : 'Add Food Item'}
              </button>
              {editingFood && (
                <button type="button" onClick={() => {
                  setEditingFood(null)
                  setFoodForm({ fname: '', f_ing: '', f_img: '', f_price: '', restaurant_id: '' })
                }}>
                  Cancel
                </button>
              )}
            </form>

            <div className="dashboard-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Ingredients</th>
                    <th>Price</th>
                    <th>Restaurant</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foodItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.fname}</td>
                      <td>{item.f_ing}</td>
                      <td>${parseFloat(item.f_price || 0).toFixed(2)}</td>
                      <td>{item.restaurant_id || 'N/A'}</td>
                      <td>
                        <button onClick={() => {
                          setEditingFood(item)
                          setFoodForm({
                            fname: item.fname,
                            f_ing: item.f_ing,
                            f_img: item.f_img || '',
                            f_price: item.f_price,
                            restaurant_id: item.restaurant_id || ''
                          })
                        }}>Edit</button>
                        <button onClick={() => handleDeleteFood(item.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2>Orders Management</h2>
            <div className="dashboard-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User ID</th>
                    <th>Restaurant ID</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.order_id}>
                      <td>{order.order_id}</td>
                      <td>{order.user_id}</td>
                      <td>{order.restaurant_id || 'N/A'}</td>
                      <td>
                        {order.items && typeof order.items === 'string' 
                          ? JSON.parse(order.items).length + ' items'
                          : Array.isArray(order.items) 
                          ? order.items.length + ' items'
                          : 'N/A'}
                      </td>
                      <td>${parseFloat(order.total_amount || 0).toFixed(2)}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => updateOrderStatus(order.order_id, 'cancelled')}>
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'payment-methods' && (
          <div>
            <h2>Payment Methods</h2>
            <p>Manage payment methods from the <a href="/payment-methods">Payment Methods page</a></p>
          </div>
        )}

        {/* Users Tab (Admin Only) */}
        {activeTab === 'users' && hasRole('admin') && (
          <div>
            <h2>User Management</h2>
            <div className="dashboard-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Country</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.user_id}>
                      <td>{u.user_id}</td>
                      <td>{u.user_name}</td>
                      <td>{u.user_email}</td>
                      <td>{u.user_role}</td>
                      <td>{u.country}</td>
                      <td>
                        <button>Edit Role</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div>
            <h2>Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Restaurants</h3>
                <p>{restaurants.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Food Items</h3>
                <p>{foodItems.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p>{orders.length}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Orders</h3>
                <p>{orders.filter(o => o.status === 'pending').length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2>App Settings</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Manage delivery availability and promotional offers that appear on the menu page.
            </p>
            <form onSubmit={handleSaveSettings} className="dashboard-form">
              <div style={{ 
                background: '#f8f9fa', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                marginBottom: '1.5rem',
                border: '1px solid #e0e0e0'
              }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  <input
                    type="checkbox"
                    checked={deliveryAvailable}
                    onChange={(e) => setDeliveryAvailable(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <span>🚚 Delivery Available</span>
                </label>
                <p style={{ color: '#666', marginLeft: '2.5rem', fontSize: '0.9rem' }}>
                  When enabled, customers will see "Delivery Available Now!" banner on the menu page.
                </p>
              </div>

              <div style={{ 
                background: '#fff3cd', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                marginBottom: '1.5rem',
                border: '2px solid #ffc107'
              }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem',
                  color: '#856404'
                }}>
                  🎉 Special Offers
                </label>
                <textarea
                  placeholder="Enter promotional offers (e.g., 'Get 20% off on orders above $50!', 'Free delivery on orders above $30')"
                  value={offers}
                  onChange={(e) => setOffers(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #ffc107',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
                <p style={{ color: '#856404', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  Leave empty to hide the offers section. This text will appear on the menu page.
                </p>
              </div>

              <button type="submit" disabled={loading} style={{ 
                background: 'linear-gradient(135deg, #da4453 0%, #c0394a 100%)',
                color: 'white',
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}>
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
