# Test Users Documentation
---

## Test Users Details

### Default Password
**All test users have the same password:** `password123`

---


## Summary Table

| Name | Email | Role | Country | Password |
|------|-------|------|---------|----------|
| Nick Fury | nick.fury@example.com | admin | India | password123 |
| Captain Marvel | captain.marvel@example.com | manager | India | password123 |
| Captain America | captain.america@example.com | manager | America | password123 |
| Thanos | thanos@example.com | member | India | password123 |
| Thor | thor@example.com | member | India | password123 |
| Travis | travis@example.com | member | America | password123 |

---

## Access Control Matrix

| Function | Admin | Manager | Member |
|----------|-------|---------|--------|
| View restaurants & menu items | ✅ All countries | ✅ Own country | ✅ Own country |
| Create order (add food items) | ✅ | ✅ | ✅ |
| Place order (checkout & pay) | ✅ | ✅ | ❌ |
| Cancel order | ✅ | ✅ | ❌ |
| Update payment method | ✅ | ❌ | ❌ |
| View orders | ✅ All countries | ✅ Own country | ✅ Own orders only |
| Manage restaurants | ✅ | ✅ | ❌ |
| Manage food items | ✅ | ✅ | ❌ |

---

## Country-Based Access (Bonus Feature)

### India Users
- **Admin:** Nick Fury (can see all)
- **Manager:** Captain Marvel
- **Members:** Thanos, Thor

**Can Access:**
- Restaurants in India
- Orders from India (Manager) or own orders (Members)
- Menu items from India restaurants

### America Users
- **Manager:** Captain America
- **Member:** Travis

**Can Access:**
- Restaurants in America
- Orders from America (Manager) or own orders (Members)
- Menu items from America restaurants
