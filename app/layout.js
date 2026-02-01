import './globals.css'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'
import WhatsAppButton from '@/components/common/WhatsAppButton'

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

            <main className="min-h-screen">
              {children}
              <WhatsAppButton
                phoneNumber="51987654321"
                message="Hola, tengo una consulta sobre los productos"
              />
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}