'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import "./PPMenu.css"
import API_URL from '../utils/api'

function PPMenu() {
  const { user } = useAuth()
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [deliveryAvailable, setDeliveryAvailable] = useState(false)
  const [offers, setOffers] = useState('')
  
  // Cart form state - per item
  const [itemSelections, setItemSelections] = useState({}) // { itemId: { name, ing, size, count, price } }

  // Fetch restaurants and settings
  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please login to view restaurants')
        return
      }
      
      const response = await fetch(`${API_URL}/api/restaurants`, {
        headers: { token }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Restaurants API response:', data)
        // Handle both old format (array) and new format (object with restaurants, delivery_available, offers)
        if (Array.isArray(data)) {
          setRestaurants(data)
          // If old format, fetch settings separately
          fetchSettings()
        } else {
          setRestaurants(data.restaurants || [])
          setDeliveryAvailable(data.delivery_available || false)
          setOffers(data.offers || '')
          console.log('Delivery available:', data.delivery_available, 'Offers:', data.offers)
        }
      } else {
        toast.error('Failed to load restaurants')
      }
    } catch (err) {
      toast.error('Failed to load restaurants')
    } finally {
      setLoading(false)
    }
  }

  // Fetch delivery status and offers separately (fallback)
  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      
      const response = await fetch(`${API_URL}/api/restaurants/settings`, {
        headers: { token }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Settings fetched:', data)
        setDeliveryAvailable(data.delivery_available || false)
        setOffers(data.offers || '')
      } else {
        console.log('Settings endpoint not available or error:', response.status)
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
    }
  }

  // Fetch menu items for selected restaurant
  const fetchRestaurantMenu = async (restaurantId) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/api/restaurants/${restaurantId}/menu`, {
        headers: { token }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSelectedRestaurant(data.restaurant)
        setMenuItems(data.menu)
      } else {
        toast.error('Failed to load menu')
      }
    } catch (err) {
      toast.error('Failed to load menu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRestaurants()
    // Always try to fetch settings
    fetchSettings()
  }, [])

  // Debug: Log current state
  useEffect(() => {
    console.log('Current banner state:', { deliveryAvailable, offers })
  }, [deliveryAvailable, offers])

  const handleRestaurantClick = (restaurant) => {
    fetchRestaurantMenu(restaurant.restaurant_id)
  }

  const handleBackToRestaurants = () => {
    setSelectedRestaurant(null)
    setMenuItems([])
  }

  // Helper function to get valid image path
  const getImagePath = (imagePath) => {
    if (!imagePath) return '/PANCAKES.png'
    
    // If it's a full URL, use it
    if (imagePath.startsWith('http')) return imagePath
    
    // Validate it's a proper image filename
    const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
    const hasValidExtension = validExtensions.some(ext => 
      imagePath.toLowerCase().endsWith(ext)
    )
    
    // If it's a valid filename or common placeholder, use it
    if (hasValidExtension || imagePath === 'PANCAKES.png') {
      return `/${imagePath}`
    }
    
    // Otherwise, use default placeholder
    return '/PANCAKES.png'
  }

  // Update item selection
  const updateItemSelection = (itemId, field, value) => {
    setItemSelections(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }))
  }

  // Initialize item selection when item is clicked
  const initializeItemSelection = (item) => {
    if (!itemSelections[item.id]) {
      setItemSelections(prev => ({
        ...prev,
        [item.id]: {
          name: item.fname,
          ing: item.f_ing,
          size: 'Small', // Default size
          count: 1,
          price: parseFloat(item.f_price || 0)
        }
      }))
    }
  }

  const handleAddToCart = async (item) => {
    const selection = itemSelections[item.id]
    
    if (!selection) {
      toast.error('Please select size and quantity')
      return
    }

    if (!selection.size || selection.count < 1) {
      toast.error('Please select size and quantity (minimum 1)')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const body = { 
        name: selection.name, 
        ing: selection.ing, 
        size: selection.size, 
        count: selection.count, 
        price: selection.price * selection.count // Total price
      }
      
      const response = await fetch(`${API_URL}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": token
        },
        body: JSON.stringify(body)
      })
      
      if (response.ok) {
        toast.success(`${selection.count}x ${selection.name} added to cart!`)
        // Reset selection for this item
        setItemSelections(prev => {
          const newState = { ...prev }
          delete newState[item.id]
          return newState
        })
      } else {
        const error = await response.json().catch(() => ({ error: 'Failed to add item to cart' }))
        console.error('Add to cart error:', error)
        toast.error(error.error || error.message || 'Failed to add item to cart')
      }
    } catch (err) {
      console.error('Add to cart exception:', err)
      toast.error('Failed to add item to cart: ' + err.message)
    }
  }

  // Show restaurants list
  if (!selectedRestaurant) {
    return (
      <>
        {(deliveryAvailable || offers) && (
          <div className="promotional-banner">
            {deliveryAvailable && (
              <div className="delivery-banner">
                <img 
                  src="/Vector Takeaway Rider Delivery Background.jpg" 
                  className="delivery-image" 
                  alt="Delivery" 
                />
                <div className="delivery-content">
                  <h4 className="delivery-title">🚚 Delivery Available Now!</h4>
                  <p className="delivery-subtitle">Order your favorite food and get it delivered to your doorstep</p>
                </div>
              </div>
            )}
            {offers && (
              <div className="offers-banner">
                <div className="offers-icon">🎉</div>
                <div className="offers-content">
                  <h3 className="offers-title">Special Offers</h3>
                  <p className="offers-text">{offers}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
          <h2 className="section-heading">Choose a Restaurant</h2>
          
          {loading ? (
            <div className="loading-state">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍽️</div>
              <div>Loading restaurants...</div>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
              <h3 style={{ marginBottom: '0.5rem' }}>No Restaurants Available</h3>
              <p>No restaurants are available in your area at the moment.</p>
            </div>
          ) : (
            <div className="restaurants-grid">
              {restaurants.map(restaurant => (
                <div
                  key={restaurant.restaurant_id}
                  className="restaurant-card"
                  onClick={() => handleRestaurantClick(restaurant)}
                >
                  {restaurant.image_url ? (
                    <img
                      src={restaurant.image_url}
                      alt={restaurant.name}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '220px',
                      background: 'linear-gradient(135deg, #da4453 0%, #c0394a 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem',
                      color: 'white'
                    }}>
                      🍽️
                    </div>
                  )}
                  <div className="restaurant-card-content">
                    <h3>{restaurant.name}</h3>
                    {restaurant.description && (
                      <p>
                        {restaurant.description.length > 120 
                          ? restaurant.description.substring(0, 120) + '...'
                          : restaurant.description}
                      </p>
                    )}
                    <div className="restaurant-card-footer">
                      <span className="restaurant-location">
                        📍 {restaurant.location}
                      </span>
                      <span className="restaurant-country">{restaurant.country}</span>
                    </div>
                    <button className="restaurant-card-button">
                      View Menu →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    )
  }

  // Show menu items for selected restaurant
  return (
    <>
      {(deliveryAvailable || offers) && (
        <div className="promotional-banner">
          {deliveryAvailable && (
            <div className="delivery-banner">
              <img 
                src="/Vector Takeaway Rider Delivery Background.jpg" 
                className="delivery-image" 
                alt="Delivery" 
              />
              <div className="delivery-content">
                <h4 className="delivery-title">🚚 Delivery Available Now!</h4>
                <p className="delivery-subtitle">Order your favorite food and get it delivered to your doorstep</p>
              </div>
            </div>
          )}
          {offers && (
            <div className="offers-banner">
              <div className="offers-icon">🎉</div>
              <div className="offers-content">
                <h3 className="offers-title">Special Offers</h3>
                <p className="offers-text">{offers}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ padding: '1rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <button
          onClick={handleBackToRestaurants}
          className="back-button"
        >
          ← Back to Restaurants
        </button>
        
        <div className="menu-header">
          <h2>{selectedRestaurant.name}</h2>
          {selectedRestaurant.description && (
            <p>{selectedRestaurant.description}</p>
          )}
          <div className="menu-header-location">
            📍 {selectedRestaurant.location}, {selectedRestaurant.country}
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍕</div>
            <div>Loading menu...</div>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No Menu Items</h3>
            <p>This restaurant hasn't added any menu items yet.</p>
          </div>
        ) : (
          <div className="menu-items-container">
            {menuItems.map(item => {
              const selection = itemSelections[item.id] || { count: 1, size: 'Small', price: parseFloat(item.f_price || 0) }
              const totalPrice = (selection.price || parseFloat(item.f_price || 0)) * (selection.count || 1)
              
              return (
                <div key={item.id} className="menu-item-card" onClick={() => initializeItemSelection(item)}>
                  <div className="menu-item-image">
                    <img 
                      src={getImagePath(item.f_img)}
                      alt={item.fname}
                      onError={(e) => {
                        // If image fails to load, show placeholder
                        if (!e.target.src.includes('PANCAKES.png')) {
                          e.target.src = '/PANCAKES.png'
                        } else {
                          // If placeholder also fails, show emoji
                          e.target.style.display = 'none'
                          if (!e.target.parentElement.querySelector('.image-placeholder')) {
                            const div = document.createElement('div')
                            div.className = 'image-placeholder'
                            div.style.cssText = 'width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem; background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);'
                            div.textContent = '🍽️'
                            e.target.parentElement.appendChild(div)
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <h3 className="menu-item-name">{item.fname}</h3>
                      <div className="menu-item-price">${parseFloat(item.f_price || 0).toFixed(2)}</div>
                    </div>
                    <p className="menu-item-description">{item.f_ing}</p>
                    
                    <div className="menu-item-options">
                      <div className="size-selection">
                        <label className="option-label">Size:</label>
                        <div className="size-buttons">
                          {['Small', 'Medium', 'Large', 'Extra Large'].map(sizeOption => (
                            <button
                              key={sizeOption}
                              type="button"
                              className={`size-btn ${selection.size === sizeOption ? 'active' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                updateItemSelection(item.id, 'size', sizeOption)
                                initializeItemSelection(item)
                              }}
                            >
                              {sizeOption}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="quantity-selection">
                        <label className="option-label">Quantity:</label>
                        <div className="quantity-controls">
                          <button
                            type="button"
                            className="quantity-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              const newCount = Math.max(1, (selection.count || 1) - 1)
                              updateItemSelection(item.id, 'count', newCount)
                              initializeItemSelection(item)
                            }}
                          >
                            −
                          </button>
                          <span className="quantity-display">{selection.count || 1}</span>
                          <button
                            type="button"
                            className="quantity-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              const newCount = (selection.count || 1) + 1
                              updateItemSelection(item.id, 'count', newCount)
                              initializeItemSelection(item)
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="menu-item-footer">
                        <div className="total-price">
                          <span className="total-label">Total:</span>
                          <span className="total-amount">${totalPrice.toFixed(2)}</span>
                        </div>
                        <button 
                          className="add-to-cart-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAddToCart(item)
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default PPMenu
