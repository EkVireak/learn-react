// Solution 10 – Routing with React Router
import {
  Link,
  MemoryRouter,
  NavLink,
  Outlet,
  Route,
  Routes,
  useParams,
  useSearchParams,
} from 'react-router'
import { formatPrice, products } from './data'

function Layout() {
  return (
    <div>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/products">Products</NavLink>
      </nav>
      {/* The matched child route renders here */}
      <Outlet />
    </div>
  )
}

function Home() {
  return <h2>Welcome to the shop</h2>
}

type SortKey = 'name' | 'price'

function ProductList() {
  // URL search params as state: survives refresh and can be shared as a link.
  const [searchParams, setSearchParams] = useSearchParams()
  const sort: SortKey = searchParams.get('sort') === 'price' ? 'price' : 'name'

  const sorted = products.toSorted((a, b) =>
    sort === 'price' ? a.price - b.price : a.name.localeCompare(b.name),
  )

  return (
    <>
      <h2>Products</h2>
      <label>
        Sort by{' '}
        <select value={sort} onChange={(e) => setSearchParams({ sort: e.target.value })}>
          <option value="name">name</option>
          <option value="price">price</option>
        </select>
      </label>
      <ul>
        {sorted.map((p) => (
          <li key={p.id}>
            <Link to={`/products/${p.id}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

function ProductDetail() {
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))

  if (!product) {
    return (
      <>
        <p>Product not found</p>
        <Link to="/products">Back to products</Link>
      </>
    )
  }

  return (
    <article>
      <h2>{product.name}</h2>
      <p>{formatPrice(product.price)}</p>
      <Link to="/products">Back to products</Link>
    </article>
  )
}

function NotFound() {
  return <h2>Page not found</h2>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default function Solution10() {
  return (
    <MemoryRouter>
      <AppRoutes />
    </MemoryRouter>
  )
}
