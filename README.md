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

## Zaika Food Delivery Application

### Version: 1.0.0
### Date: 2024

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [System Components](#system-components)
5. [Data Flow](#data-flow)
6. [Security Architecture](#security-architecture)
7. [Deployment Architecture](#deployment-architecture)
8. [API Design](#api-design)
9. [Database Design](#database-design)
10. [Frontend Architecture](#frontend-architecture)
11. [Backend Architecture](#backend-architecture)

---

## System Overview


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

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: JavaScript (ES6+)
- **Styling**: CSS Modules
- **State Management**: React Context API
- **Routing**: Next.js App Router
- **Build Tool**: Next.js built-in
- **Deployment**: Static Site (Render)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript (ES6+)
- **Database**: PostgreSQL
- **ORM/Query**: pg (node-postgres)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Encryption**: AES-256 (for payment cards)
- **Deployment**: Web Service (Render)

### Database
- **Type**: PostgreSQL
- **Connection**: Connection pooling (pg.Pool)
- **Migrations**: SQL scripts
- **Hosting**: Render PostgreSQL

### DevOps & Deployment
- **Frontend Hosting**: Render (Static Site)
- **Backend Hosting**: Render (Web Service)
- **Database Hosting**: Render (PostgreSQL)
- **Version Control**: Git/GitHub
- **Environment Variables**: Render Environment Variables

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

## Security Architecture

### 1. Authentication
- **Method**: JWT (JSON Web Tokens)
- **Token Storage**: localStorage (frontend)
- **Token Expiration**: Configured in jwtGenerator
- **Token Verification**: Middleware on protected routes

### 2. Authorization
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full access to all resources
  - **Manager**: Access to resources in their country
  - **Member**: Access to own resources only

### 3. Password Security
- **Hashing**: bcryptjs (10 salt rounds)
- **Storage**: Hashed passwords only (never plain text)

### 4. Payment Card Security
- **Encryption**: AES-256 encryption
- **Storage**: Encrypted card numbers in database
- **Display**: Only last 4 digits shown in UI
- **Key Management**: ENCRYPTION_KEY environment variable

### 5. API Security
- **CORS**: Configured for specific origins
- **Input Validation**: Middleware validation
- **SQL Injection Prevention**: Parameterized queries (pg)
- **XSS Prevention**: React's built-in XSS protection

### 6. Database Security
- **Connection**: SSL-enabled connections
- **Credentials**: Environment variables
- **Access Control**: Role-based query filtering

---

## Deployment Architecture

### Production Deployment (Render)

```
┌─────────────────────────────────────────────────────────┐
│                    RENDER PLATFORM                      │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Static Site (Frontend)                         │   │
│  │  - Next.js Static Export                        │   │
│  │  - URL: https://zaika-frontend.onrender.com     │   │
│  │  - Build: npm install && npm run build          │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                              │
│                          │ HTTPS                        │
│                          │                              │
│  ┌───────────────────────▼──────────────────────────┐   │
│  │  Web Service (Backend)                           │   │
│  │  - Express.js Server                             │   │
│  │  - URL: https://zaika-backend.onrender.com      │   │
│  │  - Port: 10000                                   │   │
│  │  - Build: npm install                            │   │
│  │  - Start: node index.js                         │   │
│  └───────────────────────┬──────────────────────────┘   │
│                          │                              │
│                          │ SQL                           │
│                          │                              │
│  ┌───────────────────────▼──────────────────────────┐   │
│  │  PostgreSQL Database                             │   │
│  │  - Internal URL (for backend)                    │   │
│  │  - External URL (for DBeaver/local)               │   │
│  │  - SSL: Required                                  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Environment Variables

#### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL

#### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `jwtSecret`: JWT signing secret
- `ENCRYPTION_KEY`: AES encryption key (32 characters)
- `PORT`: Server port (default: 10000)
- `FRONTEND_URL`: Frontend URL for CORS

---

## API Design

### RESTful API Principles
- **Resources**: Nouns (restaurants, orders, users)
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: 200, 201, 400, 401, 403, 404, 500
- **Response Format**: JSON

### API Endpoints Structure
```
Base URL: https://zaika-backend.onrender.com

Authentication:
  POST   /authentication/register
  POST   /authentication/login
  POST   /authentication/verify

Restaurants:
  GET    /api/restaurants
  GET    /api/restaurants/:restaurant_id/menu
  GET    /api/restaurants/settings
  POST   /api/restaurants
  PUT    /api/restaurants/:restaurant_id
  PUT    /api/restaurants/settings
  DELETE /api/restaurants/:restaurant_id

Food Items:
  GET    /api/food-items
  POST   /api/food-items
  PUT    /api/food-items/:id
  DELETE /api/food-items/:id

Orders:
  GET    /api/orders
  POST   /api/orders
  POST   /api/orders/checkout
  PUT    /api/orders/:order_id/status
  PUT    /api/orders/:order_id/cancel

Payment Methods:
  GET    /api/payment-methods
  POST   /api/payment-methods
  PUT    /api/payment-methods/:payment_id
  DELETE /api/payment-methods/:payment_id

Users:
  GET    /api/users
  PUT    /api/users/:user_id/role

Dashboard:
  GET    /api/dashboard/stats
```

See `API_COLLECTION.json` for detailed API documentation.

---

## Database Design

### Design Principles
- **Normalization**: 3NF (Third Normal Form)
- **Relationships**: Foreign keys with appropriate constraints
- **Data Integrity**: Check constraints, NOT NULL, UNIQUE
- **Performance**: Indexes on primary keys and foreign keys

### Key Design Decisions
1. **JSONB for Order Items**: Flexible structure for order items
2. **Country-Based Filtering**: Users see only their country's data
3. **Role-Based Access**: Database queries filtered by role
4. **Encrypted Payment Data**: Sensitive data encrypted at application level
5. **Soft Deletes**: Foreign keys use ON DELETE SET NULL for data preservation

See `DATABASE_SCHEMA.md` for detailed schema documentation.

---

## Frontend Architecture

### Component Structure
```
app/
├── page.js (Home)
├── layout.js (Root layout)
├── components/
│   ├── Navbar.js
│   ├── Home.js
│   ├── Login.js
│   ├── Sign.js
│   ├── Dashboard.js
│   ├── Cart.js
│   ├── Cards.js
│   ├── PaymentMethods.js
│   └── CustomerMo/ (Customer module)
├── context/
│   └── AuthContext.js
└── utils/
    └── api.js
```

### State Management
- **Global State**: React Context API (AuthContext)
- **Local State**: React useState hooks
- **API Calls**: Centralized in `api.js`

### Routing
- **Framework**: Next.js App Router
- **Protected Routes**: RoleGuard component
- **Dynamic Routes**: Next.js dynamic segments

---

## Backend Architecture

### MVC Pattern
- **Models**: Database tables (PostgreSQL)
- **Views**: JSON API responses
- **Controllers**: Route handlers

### Middleware Chain
```
Request → CORS → JSON Parser → Authorization → Role Check → Route Handler → Response
```

### Error Handling
- **Try-Catch**: All async route handlers
- **Status Codes**: Appropriate HTTP status codes
- **Error Messages**: User-friendly error messages
- **Logging**: Console logging for debugging

### Database Connection
- **Connection Pooling**: pg.Pool for efficient connections
- **SSL**: Required for production (Render)
- **Environment-Based**: Different configs for dev/prod

---

## Scalability Considerations

### Current Limitations
- Single database instance
- No caching layer
- No load balancing
- No CDN for static assets

### Future Improvements
1. **Caching**: Redis for frequently accessed data
2. **CDN**: CloudFront/Cloudflare for static assets
3. **Load Balancing**: Multiple backend instances
4. **Database Replication**: Read replicas for scaling reads
5. **Microservices**: Split into smaller services if needed

---

## Monitoring & Logging

### Current Implementation
- **Console Logging**: Basic error and info logging
- **Error Tracking**: Try-catch blocks with error responses

### Recommended Additions
1. **Application Monitoring**: Sentry, LogRocket
2. **Performance Monitoring**: New Relic, Datadog
3. **Uptime Monitoring**: Pingdom, UptimeRobot
4. **Database Monitoring**: pgAdmin, PostgreSQL logs

---

## Security Best Practices

1. ✅ **JWT Authentication**: Implemented
2. ✅ **Password Hashing**: bcryptjs
3. ✅ **Input Validation**: Middleware validation
4. ✅ **SQL Injection Prevention**: Parameterized queries
5. ✅ **CORS Configuration**: Restricted origins
6. ✅ **Encrypted Payment Data**: AES-256
7. ⚠️ **Rate Limiting**: Not implemented (recommended)
8. ⚠️ **HTTPS Only**: Enforced by Render
9. ⚠️ **Security Headers**: Not configured (recommended)

---

## Conclusion

The Zaika Food Delivery application follows a modern, scalable architecture with clear separation of concerns. The system is designed to be maintainable, secure, and extensible for future enhancements.

For detailed API documentation, see `API_COLLECTION.json`.
For database schema details, see `DATABASE_SCHEMA.md`.
For deployment instructions, see `DEPLOYMENT.md`.

