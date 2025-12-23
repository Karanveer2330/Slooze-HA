'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        background: 'white',
        padding: '3rem',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          fontSize: '8rem',
          marginBottom: '1rem',
          lineHeight: '1'
        }}>
          😕
        </div>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '700',
          color: '#333',
          marginBottom: '1rem'
        }}>
          404
        </h1>
        <h2 style={{
          fontSize: '1.5rem',
          color: '#666',
          marginBottom: '1.5rem',
          fontWeight: '500'
        }}>
          Page Not Found
        </h2>
        <p style={{
          color: '#999',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link
            href="/"
            style={{
              padding: '0.875rem 2rem',
              background: 'linear-gradient(135deg, #da4453 0%, #c0394a 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'inline-block',
              boxShadow: '0 4px 6px rgba(218, 68, 83, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(218, 68, 83, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(218, 68, 83, 0.3)'
            }}
          >
            Go Home
          </Link>
          <button
            onClick={() => router.back()}
            style={{
              padding: '0.875rem 2rem',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#5a6268'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#6c757d'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Go Back
          </button>
        </div>
        <div style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid #e0e0e0'
        }}>
          <p style={{
            color: '#999',
            fontSize: '0.9rem',
            marginBottom: '1rem'
          }}>
            Popular Pages:
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link href="/PPMenu" style={{ color: '#da4453', textDecoration: 'none' }}>Menu</Link>
            <Link href="/cart" style={{ color: '#da4453', textDecoration: 'none' }}>Cart</Link>
            <Link href="/orders" style={{ color: '#da4453', textDecoration: 'none' }}>Orders</Link>
            <Link href="/about" style={{ color: '#da4453', textDecoration: 'none' }}>About</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

