export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Game Leaderboard API</h1>
      <p>API endpoints:</p>
      <ul>
        <li>
          <strong>GET</strong> <a href="/api/leaderboard">/api/leaderboard</a> - View leaderboard
        </li>
        <li>
          <strong>POST</strong> /api/submit-score - Submit a score
          <pre style={{ background: '#f4f4f4', padding: '1rem', marginTop: '0.5rem' }}>
{`{
  "username": "player1",
  "points": 100
}`}
          </pre>
        </li>
      </ul>
      <p style={{ marginTop: '2rem', color: '#666' }}>
        Scores are processed asynchronously via Redis Stream and background worker.
      </p>
    </main>
  )
}
