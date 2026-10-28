# FASCO — Fashion eCommerce (MERN + Tailwind)

Pixel-inspired recreation of the [Authentication / eCommerce Store Figma](https://www.figma.com/design/K56vLCXDbbz8hEJPmNrBwR/Authentication---eCommerce-Store--Copy-).

## Stack

- **client/** — React + Vite + Tailwind CSS + React Router
- **server/** — Node.js + Express + MongoDB + JWT

## Setup

1. Install [MongoDB](https://www.mongodb.com/try/download/community) and start it locally.
2. Install dependencies:

```bash
cd server && npm install
cd ../client && npm install
```

3. Seed products + demo admin:

```bash
cd server
npm run seed
```

Demo admin: `admin@fasco.com` / `Admin@123`

4. Run API (port **5000**):

```bash
cd server
npm run dev
```

5. Run client (port **5173**):

```bash
cd client
npm run dev
```

Open http://localhost:5173

## Deploy (Netlify + Render)

The frontend and API are deployed separately. MongoDB must be reachable by the
Render service; MongoDB Atlas is a common hosted option.

### 1. Deploy the API on Render

Create a **Web Service** from this repository and set:

- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

Add these environment variables in Render (do not commit real values):

- `MONGO_URI`: your MongoDB Atlas connection string
- `JWT_SECRET`: a long, randomly generated secret
- `NODE_ENV`: `production`
- `CLIENT_URL`: `https://fasco-xi.vercel.app`. If you use additional Vercel,
  Netlify, or custom domains, add their exact origins separated by commas.

Render supplies `PORT` automatically. Check
`https://fasco-9489.onrender.com/api/health` after deploying.

### 2. Deploy the frontend on Netlify or Vercel

Import the same repository into Netlify or Vercel. The included `netlify.toml`
sets the Netlify build and React Router fallback. For Vercel, set the project
root directory to `client`. Add this environment variable in the hosted site's
settings:

- `VITE_API_URL`: `https://fasco-9489.onrender.com/api`

Trigger a new deploy after setting the variable. The API URL also has a
production fallback in the client, but setting it explicitly in Vercel is
recommended. If signup fails in production, verify `VITE_API_URL` points to the
Render API and `CLIENT_URL` includes the exact browser origin (including any
custom domain).

### 3. Seed the database

The project includes a shared 14-product demo catalog with matching local
images. The API serves that catalog when the database has no products, so the
storefront, category filters, deals, arrivals, and product pages remain
browsable before seeding. Demo catalog cart/checkout is local-only and does
not charge a payment method or create a database order. Newsletter signups are
stored in MongoDB and duplicate email submissions are reported.

To enable persistent product inventory and real account orders, run
`npm run seed` from the `server` directory with `MONGO_URI` set to the target
database (for example, in a secure shell with the Render environment
configured). The seed script creates or updates the demo products by slug
without deleting other catalog entries. It also creates the demo admin
(`admin@fasco.com` / `Admin@123`) if missing; change or remove that account
before using the site publicly. Do not run the seed command as every deploy's
build or start command.

> **Important:** `server/.env` is currently tracked in this repository. If it
> contains real credentials, rotate them, remove the file from Git tracking and
> repository history, and keep production values only in Render's environment
> settings. `.gitignore` now prevents local env files from being added in the
> future.

## Features

- Auth: Sign In, Sign Up, Forgot Password → OTP → New Password
- Home, Shop (filters/sort), Product Detail, Cart, Checkout, Thank You
- JWT auth, cart (local + server), orders, newsletter subscriptions, discount
  codes `FASCO10` / `WELCOME15`
- Tests: run `npm test` from the repository root
