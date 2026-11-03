// Runs the exercise-13 mock Contacts API as a real HTTP server: `npm run api:contacts`
// (Node strips the TypeScript types itself — no build step needed.)
import http from 'node:http'
import { createMockApi } from '../src/exercises/13-api-integration/mock-server.ts'

const PORT = Number(process.env.PORT ?? 3002)
const api = createMockApi()

// CORS: the React app (localhost:5173) is a different origin than this API (localhost:3002),
// so the browser asks permission first (preflight OPTIONS request) and checks these headers.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
}

http
  .createServer(async (req, res) => {
    const chunks: Buffer[] = []
    for await (const chunk of req) chunks.push(chunk as Buffer)
    const body = Buffer.concat(chunks)

    const headers = new Headers()
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === 'string') headers.set(key, value)
    }

    const request = new Request(`http://localhost:${PORT}${req.url ?? '/'}`, {
      method: req.method,
      headers,
      body: body.length && req.method !== 'GET' && req.method !== 'HEAD' ? body : undefined,
    })

    const response = await api.handle(request)
    console.log(`${req.method} ${req.url} → ${response.status}`)
    res.writeHead(response.status, { ...Object.fromEntries(response.headers), ...CORS })
    res.end(Buffer.from(await response.arrayBuffer()))
  })
  .listen(PORT, () => {
    console.log(`Contacts API on http://localhost:${PORT}  (x-api-key: demo-key-123)`)
    console.log('Login: ada@example.com / password123')
  })
