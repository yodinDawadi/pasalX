# PasalX Frontend

React + Vite frontend for the PasalX e-commerce backend.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

The default API is `http://localhost:5000/api`.

## Backend requirements discovered

The current backend exposes:
- `POST /api/user/signup`
- `POST /api/user/login`
- `POST /api/user/logout`
- `GET /api/product`
- `GET /api/product/:id`
- Admin: `POST /api/product`
- Admin: `PUT /api/product/:id`
- Admin: `DELETE /api/product/:id`

The frontend uses cookie credentials and also stores the returned JWT token locally.

## Important gaps for the laboratory requirements

The current backend does not yet expose:
1. an order/checkout API or Order model,
2. a product `category` field,
3. a public current-user endpoint.

Therefore this frontend currently:
- implements cart state with localStorage,
- demonstrates checkout/order confirmation locally,
- displays related/latest products client-side,
- provides full product CRUD for admin users.

For a fully database-backed final submission, add an Order model/routes and a category field to Product. Also update CORS to allow credentials from the frontend origin.

Example CORS configuration:

```js
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
```

Then replace the demo checkout in `src/pages/Checkout.jsx` with the real order endpoint.
