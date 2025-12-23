# Zaika - Food Delivery App

Zaika is a full-stack food delivery application that enables users to browse restaurants, place orders, and manage their food delivery experience. The system supports role-based access control with three user roles: Admin, Manager, and Member.

### Key Features
- User authentication and authorization
- Restaurant and menu management
- Order placement and tracking
- Payment method management
- Role-based access control (Admin, Manager, Member)
- Multi-country support (India, America)
- Dashboard with statistics

Live on Render: https://fda-fron.onrender.com/
Please read Database.md for dummy login ids for quick test.

## Setup

1. Install dependencies:
```bash
npm install
cd server && npm install
```

2. Configure database in `server/db.js`

3. Run database migrations: `server/database/setup.sql`

4. Start servers:
```bash
npm run server  # Backend on port 5000
npm run dev     # Frontend on port 3000
```

## Tech Stack

- Next.js 14, React 18
- Express.js, Node.js
- PostgreSQL
- JWT Authentication

# Architecture & Design Document

### Version: 1.0.0
### Date: 2024

---

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Next.js Frontend (React 18)                  │   │
│  │  - Pages (Home, Login, Dashboard, Orders, etc.)      │   │
│  │  - Components (Navbar, Cart, Cards, etc.)           │   │
│  │  - Context API (AuthContext)                         │   │
│  │  - Static Export for Render                          │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/HTTPS
                        │ REST API
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                      API LAYER                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      Express.js Backend (Node.js)                    │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │  Routes:                                      │    │   │
│  │  │  - /authentication (JWT Auth)                 │    │   │
│  │  │  - /api/restaurants                           │    │   │
│  │  │  - /api/food-items                            │    │   │
│  │  │  - /api/orders                                │    │   │
│  │  │  - /api/payment-methods                       │    │   │
│  │  │  - /api/users                                 │    │   │
│  │  │  - /api/dashboard                             │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │  Middleware:                                 │    │   │
│  │  │  - authorization (JWT verification)         │    │   │
│  │  │  - roleAuthorization (Role checking)        │    │   │
│  │  │  - validinfo (Input validation)              │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │  Utils:                                       │    │   │
│  │  │  - jwtGenerator (Token creation)             │    │   │
│  │  │  - encryption (Card encryption)              │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ SQL Queries
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    DATA LAYER                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         PostgreSQL Database                          │   │
│  │  - logins (Users)                                    │   │
│  │  - restaurants                                        │   │
│  │  - items (Food items)                                │   │
│  │  - orders                                             │   │
│  │  - payment_methods                                    │   │
│  │  - app_settings                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

---

## System Components

### 1. Frontend Components

#### Pages (`app/`)
- `page.js` - Home page
- `login/page.js` - User login
- `Sign/page.js` - User registration
- `dashboard/page.js` - Admin/Manager dashboard
- `orders/page.js` - Order history
- `cart/page.js` - Shopping cart
- `payment-methods/page.js` - Payment method management
- `PPMenu/page.js` - Menu display
- `Businesspg/page.js` - Business page
- `about/page.js` - About page
- `Terms/page.js` - Terms and conditions

#### Components (`app/components/`)
- `Navbar.js` - Navigation bar
- `Home.js` - Home page content
- `Login.js` - Login form
- `Sign.js` - Registration form
- `Dashboard.js` - Dashboard content
- `Cart.js` - Shopping cart
- `Cards.js` - Restaurant/food item cards
- `PaymentMethods.js` - Payment method management
- `CustomerMo/` - Customer module components
- `RoleGuard.js` - Role-based route protection

#### Context (`app/context/`)
- `AuthContext.js` - Authentication state management

#### Utilities (`app/utils/`)
- `api.js` - API client configuration

### 2. Backend Components

#### Routes (`server/Routes/`)
- `jwtAuth.js` - Authentication (register, login, verify)
- `restaurants.js` - Restaurant CRUD operations
- `foodItems.js` - Food item CRUD operations
- `orders.js` - Order management
- `paymentMethods.js` - Payment method management
- `users.js` - User management
- `dashboardStats.js` - Dashboard statistics
- `dashboard.js` - Dashboard routes

#### Middleware (`server/middleware/`)
- `authorization.js` - JWT token verification
- `roleAuthorization.js` - Role-based access control
- `validinfo.js` - Input validation

#### Utilities (`server/utils/`)
- `jwtGenerator.js` - JWT token generation
- `encryption.js` - Payment card encryption/decryption

#### Database (`server/database/`)
- `setup.sql` - Initial database schema
- `migrations.sql` - Database migrations
- `insert_test_users.js` - Test user seeding
- `test_users.sql` - Test user SQL

---

## Data Flow

### 1. User Registration Flow
```
User → Frontend (Sign.js) 
  → POST /authentication/register
  → Backend (jwtAuth.js)
  → Hash password (bcrypt)
  → Insert into logins table
  → Generate JWT token
  → Return token + user info
  → Store token in localStorage
  → Redirect to dashboard
```

### 2. User Login Flow
```
User → Frontend (Login.js)
  → POST /authentication/login
  → Backend (jwtAuth.js)
  → Verify credentials
  → Generate JWT token
  → Return token + user info
  → Store token in localStorage
  → Update AuthContext
  → Redirect to dashboard
```

### 3. Order Placement Flow
```
User → Frontend (Cart.js)
  → Add items to cart
  → Select payment method
  → POST /api/orders
  → Backend (orders.js)
  → Verify JWT token
  → Check user role
  → Insert into orders table
  → Return order confirmation
  → Update cart (clear)
  → Show order confirmation
```

### 4. Restaurant Management Flow (Admin/Manager)
```
Admin/Manager → Frontend (Dashboard.js)
  → POST /api/restaurants
  → Backend (restaurants.js)
  → Verify JWT token
  → Check role (admin/manager)
  → Insert into restaurants table
  → Return restaurant data
  → Update UI
```

---


