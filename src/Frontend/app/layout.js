export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/img/favicon.ico"></link>
      </head>
      <body>{children}</body>
    </html>
  )
}