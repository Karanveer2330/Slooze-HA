# Database Schema Documentation

## Overview
The Zaika Food Delivery application uses PostgreSQL as its database. This document describes all tables, their relationships, and data types.

## Database Name
`fda` (Food Delivery App)

## Tables

### 1. `logins` - User Authentication & Profile
Stores user account information, authentication credentials, and role-based access control.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | SERIAL | PRIMARY KEY | Auto-incrementing user ID |
| `user_name` | VARCHAR(100) | | User's first name |
| `user_lname` | VARCHAR(100) | | User's last name |
| `user_email` | VARCHAR(100) | UNIQUE, NOT NULL | User's email address (unique) |
| `user_password` | VARCHAR(255) | | Hashed password (bcrypt) |
| `adr` | VARCHAR(255) | | Address line 1 |
| `adr1` | VARCHAR(255) | | Address line 2 |
| `city` | VARCHAR(100) | | City |
| `state` | VARCHAR(100) | | State/Province |
| `zip` | VARCHAR(20) | | ZIP/Postal code |
| `user_role` | VARCHAR(20) | DEFAULT 'member', CHECK | User role: 'admin', 'manager', 'member' |
| `country` | VARCHAR(50) | DEFAULT 'India', CHECK | User country: 'India', 'America' |

**Indexes:**
- Primary Key: `user_id`
- Unique: `user_email`

**Relationships:**
- Referenced by: `orders.user_id`, `payment_methods.user_id`, `app_settings.updated_by`

---

### 2. `restaurants` - Restaurant Information
Stores restaurant details including location, country, and delivery availability.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `restaurant_id` | SERIAL | PRIMARY KEY | Auto-incrementing restaurant ID |
| `name` | VARCHAR(100) | | Restaurant name |
| `description` | TEXT | | Restaurant description |
| `location` | VARCHAR(100) | | Restaurant location |
| `country` | VARCHAR(50) | | Country where restaurant operates |
| `image_url` | VARCHAR(255) | | URL to restaurant image |
| `delivery_available` | BOOLEAN | | Whether delivery is available |
| `offers` | TEXT | | Special offers/promotions |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Indexes:**
- Primary Key: `restaurant_id`

**Relationships:**
- Referenced by: `items.restaurant_id`, `orders.restaurant_id`

---

### 3. `items` - Food Items/Menu Items
Stores individual food items that can be ordered.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing item ID |
| `fname` | VARCHAR(100) | | Food item name |
| `f_ing` | VARCHAR(255) | | Ingredients description |
| `f_img` | VARCHAR(255) | | URL to food item image |
| `f_price` | DECIMAL(10, 2) | | Price of the food item |
| `restaurant_id` | INTEGER | | Foreign key to `restaurants.restaurant_id` |

**Indexes:**
- Primary Key: `id`
- Foreign Key: `restaurant_id` → `restaurants.restaurant_id`

**Relationships:**
- References: `restaurants.restaurant_id`

---

### 4. `orders` - Order Management
Stores customer orders with items, payment, and status information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `order_id` | SERIAL | PRIMARY KEY | Auto-incrementing order ID |
| `user_id` | INTEGER | FOREIGN KEY | User who placed the order |
| `restaurant_id` | INTEGER | | Restaurant for the order |
| `items` | JSONB | | JSON array of ordered items |
| `total_amount` | DECIMAL(10, 2) | | Total order amount |
| `status` | VARCHAR(20) | DEFAULT 'pending' | Order status: 'pending', 'served', 'delivered', 'completed', 'cancelled' |
| `payment_method_id` | INTEGER | FOREIGN KEY | Payment method used |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Order creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- Primary Key: `order_id`
- Foreign Key: `user_id` → `logins.user_id` (ON DELETE SET NULL)
- Foreign Key: `payment_method_id` → `payment_methods.payment_id` (ON DELETE SET NULL)

**Relationships:**
- References: `logins.user_id`, `payment_methods.payment_id`

**JSONB Structure (items field):**
```json
[
  {
    "id": 1,
    "fname": "Pizza",
    "f_price": 299.99,
    "quantity": 2
  }
]
```

---

### 5. `payment_methods` - Payment Information
Stores encrypted payment method details for users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `payment_id` | SERIAL | PRIMARY KEY | Auto-incrementing payment method ID |
| `user_id` | INTEGER | FOREIGN KEY | User who owns this payment method |
| `method_type` | VARCHAR(255) | | Payment method type (e.g., 'credit_card', 'debit_card') |
| `card_number` | VARCHAR(255) | | Encrypted card number |
| `card_holder_name` | VARCHAR(255) | | Cardholder name |
| `expiry_date` | VARCHAR(10) | | Card expiry date (MM/YY) |
| `is_default` | BOOLEAN | DEFAULT false | Whether this is the default payment method |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Indexes:**
- Primary Key: `payment_id`
- Foreign Key: `user_id` → `logins.user_id`

**Relationships:**
- References: `logins.user_id`
- Referenced by: `orders.payment_method_id`

**Security:**
- Card numbers are encrypted using AES-256 encryption before storage
- Only last 4 digits are displayed in API responses

---

### 6. `app_settings` - Application Settings
Stores application-wide settings like delivery availability and offers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `setting_id` | SERIAL | PRIMARY KEY | Auto-incrementing setting ID |
| `setting_key` | VARCHAR(50) | UNIQUE, NOT NULL | Setting key (e.g., 'delivery_available', 'offers') |
| `setting_value` | TEXT | | Setting value |
| `updated_by` | INTEGER | FOREIGN KEY | User who last updated this setting |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- Primary Key: `setting_id`
- Unique: `setting_key`
- Foreign Key: `updated_by` → `logins.user_id`

**Relationships:**
- References: `logins.user_id`

**Common Settings:**
- `delivery_available`: 'true' or 'false'
- `offers`: Text description of current offers

---

### 7. `menu` - Legacy Menu Table
Legacy table for menu items (may be used for backward compatibility).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing menu item ID |
| `name` | VARCHAR(100) | | Menu item name |
| `ing` | VARCHAR(255) | | Ingredients |
| `size` | VARCHAR(50) | | Item size |
| `count` | INTEGER | | Quantity/Count |
| `price` | DECIMAL(10, 2) | | Price |
| `user_id` | INTEGER | | User who created the menu item |

**Indexes:**
- Primary Key: `id`

---

### 8. `food` - Legacy Food Table
Legacy table for food items (may be used for backward compatibility).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing food item ID |
| `name` | VARCHAR(100) | | Food item name |
| `ing` | VARCHAR(255) | | Ingredients |
| `size` | VARCHAR(50) | | Item size |
| `count` | INTEGER | | Quantity/Count |
| `price` | DECIMAL(10, 2) | | Price |

**Indexes:**
- Primary Key: `id`

---

### 9. `busi` - Legacy Business Table
Legacy table for business information (may be used for backward compatibility).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing business ID |
| `bname` | VARCHAR(100) | | Business name |
| `description` | TEXT | | Business description |
| `pic` | VARCHAR(255) | | Picture URL |
| `location` | VARCHAR(100) | | Business location |

**Indexes:**
- Primary Key: `id`

---

### 10. `busilogi` - Legacy Business Login Table
Legacy table for business login credentials (may be used for backward compatibility).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | SERIAL | PRIMARY KEY | Auto-incrementing user ID |
| `user_name` | VARCHAR(100) | | Username |
| `user_password` | VARCHAR(255) | | Hashed password |

**Indexes:**
- Primary Key: `user_id`

---

## Entity Relationship Diagram (ERD)

```
logins (1) ────< (N) orders
  │                    │
  │                    │
  │                    └───< (N) payment_methods
  │
  └───< (N) app_settings (updated_by)

restaurants (1) ────< (N) items
  │
  └───< (N) orders
```

## Database Migrations

### Initial Setup
Run `server/database/setup.sql` to create all tables.

### Additional Migrations
1. **Add delivery offers**: `server/database/add_delivery_offers.sql`
   - Creates `app_settings` table

2. **Add payment method to orders**: `server/database/add_payment_method_to_orders.sql`
   - Adds `payment_method_id` column to `orders` table
   - Creates foreign key relationship

3. **Add user to menu**: `server/database/add_user_to_menu.sql`
   - Adds `user_id` column to `menu` table

4. **Fix menu user_id**: `server/database/fix_menu_user_id.sql`
   - Updates foreign key constraints for `menu.user_id`

## Sample Data

### Test Users
Run `server/database/insert_test_users.js` to insert test users with different roles:
- Admin user (email: admin@example.com)
- Manager user (email: manager@example.com)
- Member user (email: member@example.com)

Default password for all test users: `password123`

## Data Types Reference

- **SERIAL**: Auto-incrementing integer (1, 2, 3, ...)
- **VARCHAR(n)**: Variable-length string up to n characters
- **TEXT**: Unlimited length text
- **DECIMAL(10, 2)**: Decimal number with 10 total digits, 2 after decimal point
- **BOOLEAN**: true/false
- **TIMESTAMP**: Date and time
- **JSONB**: Binary JSON data (PostgreSQL-specific)
- **INTEGER**: 32-bit integer

## Constraints

### Check Constraints
- `logins.user_role`: Must be 'admin', 'manager', or 'member'
- `logins.country`: Must be 'India' or 'America'
- `orders.status`: Should be one of: 'pending', 'served', 'delivered', 'completed', 'cancelled'

### Foreign Key Constraints
- `orders.user_id` → `logins.user_id` (ON DELETE SET NULL)
- `orders.payment_method_id` → `payment_methods.payment_id` (ON DELETE SET NULL)
- `payment_methods.user_id` → `logins.user_id`
- `app_settings.updated_by` → `logins.user_id`

## Indexes

Primary keys automatically create indexes. Additional indexes may be added for:
- Frequently queried columns (e.g., `logins.user_email`)
- Foreign key columns for join performance
- Columns used in WHERE clauses (e.g., `orders.status`, `restaurants.country`)

## Security Considerations

1. **Password Hashing**: All passwords are hashed using bcrypt (10 salt rounds)
2. **Card Encryption**: Payment card numbers are encrypted using AES-256 before storage
3. **Role-Based Access**: Database queries filter results based on user roles
4. **Country Filtering**: Users can only see restaurants/orders from their country (unless admin)
