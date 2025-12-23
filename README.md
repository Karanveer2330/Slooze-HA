# Zaika - Food Delivery App

Full-stack food ordering application with role-based access control.

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

## License

ISC
