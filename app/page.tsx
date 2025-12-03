export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Game Leaderboard API</h1>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>📚 API Documentation</h2>
        <p>
          <a href="/api-docs" style={{ color: '#0070f3', textDecoration: 'none', fontSize: '1.1rem' }}>
            → View Interactive Swagger UI Documentation
          </a>
        </p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>🔗 API Endpoints</h2>
        <ul>
          <li>
            <strong>GET</strong> <a href="/api/leaderboard">/api/leaderboard</a> - View leaderboard
            <pre style={{ background: '#f4f4f4', padding: '1rem', marginTop: '0.5rem' }}>
{`Query Parameters:
- limit: number (default: 10)`}
            </pre>
          </li>
          <li style={{ marginTop: '1rem' }}>
            <strong>POST</strong> /api/submit-score - Submit a score
            <pre style={{ background: '#f4f4f4', padding: '1rem', marginTop: '0.5rem' }}>
{`{
  "username": "player1",
  "points": 100
}`}
            </pre>
          </li>
        </ul>
      </div>

      <p style={{ marginTop: '2rem', color: '#666' }}>
        Scores are processed asynchronously via Redis Stream and background worker.
      </p>
    </main>
  )
}
