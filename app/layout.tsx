export const metadata = {
  title: 'Game Leaderboard API',
  description: 'Leaderboard system with Redis Stream processing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
