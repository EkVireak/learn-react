// Exercise 10 – Routing with React Router
import { MemoryRouter, Route, Routes } from 'react-router'
import { products } from './data'

function Layout() {
  // TODO: <nav> with NavLink to "/" (Home) and "/products" (Products), then <Outlet />
  return <nav>TODO: nav + outlet</nav>
}

function Home() {
  return <h2>Welcome to the shop</h2>
}

function ProductList() {
  // TODO: const [searchParams, setSearchParams] = useSearchParams()
  // TODO: sort = searchParams.get('sort') ?? 'name'; a <select> labelled "Sort by" that calls
  //       setSearchParams({ sort: value })
  // TODO: render <Link to={`/products/${p.id}`}> for each product (sorted copy!)
  return (
    <>
      <h2>Products</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </>
  )
}

function ProductDetail() {
  // TODO: const { id } = useParams() — remember it's a string
  // TODO: find the product; if missing render "Product not found"
  // TODO: heading = name, <p>{formatPrice(price)}</p>, <Link to="/products">Back to products</Link>
  return <p>TODO</p>
}

/** The route tree — tests render this inside their own MemoryRouter. */
export function AppRoutes() {
  return (
    <Routes>
      {/* TODO: nest the routes inside Layout and add products/:id and the "*" 404 route */}
      <Route path="/" element={<Layout />} />
      <Route path="/home" element={<Home />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/x" element={<ProductDetail />} />
    </Routes>
  )
}

export default function Exercise10() {
  return (
    <MemoryRouter>
      <AppRoutes />
    </MemoryRouter>
  )
}
