import './globals.css'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'

export const metadata = {
  title: 'Kraze Store - Moda Urbana',
  description: 'Descubre las últimas tendencias en moda urbana',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}