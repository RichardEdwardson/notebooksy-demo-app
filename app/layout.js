import { Inter } from 'next/font/google'
import '@/app/ui/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Notebooksy demo',
  description: 'Coming soon...',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta name="apple-mobile-web-app-capable" content="yes"/>
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
