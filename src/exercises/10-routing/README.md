# 10 – Routing with React Router

## Why this matters

Every multi-page app has a router. You'll add pages, read URL params, link between screens and
handle "not found" — and you need to understand that in a single-page app the browser never
reloads: the router swaps components based on the URL.

## Key concepts (React Router v7, imported from `react-router`)

- Define routes as a tree. **Nested routes** render inside their parent's `<Outlet />` — perfect for
  a shared layout (header/nav) around every page.
  ```tsx
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="products" element={<ProductList />} />
      <Route path="products/:id" element={<ProductDetail />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
  ```
- `<Link to="/products">` / `<NavLink>` (adds `aria-current="page"` to the active link) instead of `<a href>`.
- `useParams()` reads `:id` (always a **string** — convert it!), `useNavigate()` navigates in code,
  `useSearchParams()` reads/writes `?sort=price` (state that lives in the URL, shareable!).
- In a real app the router wraps the whole app in `main.tsx` (`<BrowserRouter>` or
  `createBrowserRouter`). Here we use `<MemoryRouter>` because the course shell already owns the URL.
- Bigger apps also use route **loaders/actions** (data APIs) or frameworks like Next.js / React Router
  framework mode — learn the basics here first.

## Your task (`Exercise.tsx`)

Complete `AppRoutes` using the `products` data:

1. `Layout`: a `<nav>` with `NavLink`s **Home** (`/`) and **Products** (`/products`), then `<Outlet />`.
2. `Home` (index route): heading **"Welcome to the shop"**.
3. `ProductList` (`/products`): heading **"Products"**, a `<select>` labelled **"Sort by"** (`name` |
   `price`) stored in the **search params** (`?sort=price`), and a list of `Link`s to `/products/:id`.
4. `ProductDetail` (`/products/:id`): heading with the product name, its price formatted as `$12.00`,
   and a **"Back to products"** link. Unknown id → `"Product not found"`.
5. Any other URL → heading **"Page not found"**.

Run `npm test -- 10`.

## Stretch goals

- A **"Buy"** button on the detail page that `navigate('/thanks')`s to a new route.
- Lazy-load `ProductDetail` (you'll learn `lazy` in exercise 14).

## Read more

- https://reactrouter.com/start/declarative/routing
- https://reactrouter.com/api/hooks/useSearchParams
