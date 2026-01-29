'use client'

import { useEffect, useState } from 'react'
import Hero from '../components/home/Hero'
import ProductCard from '../components/products/ProductCard'
import CategoriesSection from '../components/home/CategoriesSection'
import Link from 'next/link'
import { FiShield, FiTruck, FiCreditCard, FiHeadphones } from 'react-icons/fi'
import axios from 'axios'
import Image from 'next/image'
import { API_URL } from './config'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newProducts, setNewProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const [featured, newest] = await Promise.all([
        axios.get(`${API_URL}/products?destacado=true&limite=8`),
        axios.get(`${API_URL}/products?nuevo=true&limite=8`),
      ])
      setFeaturedProducts(featured.data.productos || [])
      setNewProducts(newest.data.productos || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const trustFeatures = [
    {
      icon: <FiTruck size={28} />,
      title: 'Envío Rápido',
      description: 'Delivery en 2-3 días'
    },
    {
      icon: <FiCreditCard size={28} />,
      title: 'Pago Contraentrega',
      description: 'Paga al recibir tu pedido'
    },
    {
      icon: <FiShield size={28} />,
      title: 'Compra Segura',
      description: 'Protección garantizada'
    },
    {
      icon: <FiHeadphones size={28} />,
      title: 'Soporte 24/7',
      description: 'Estamos para ayudarte'
    }
  ]

  return (
    <>
      <Hero />

      {/* Banner Promocional */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4">
        <div className="container-custom">
          <div className="flex items-center justify-center gap-4 text-center">
            <span className="text-lg md:text-xl font-bold">
              🔥 DESCUENTOS DEL 28 AL 30 NOV
            </span>
          </div>
        </div>
      </section>

      {/* Categorías Dinámicas desde Backend */}
      <CategoriesSection />

      {/* Packs/Colecciones - Estilo Savage */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-gray-50">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent mb-4"></div>
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Featured Products Section */}
          <section className="bg-gray-50 py-16">
            <div className="container-custom">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <Link href="/productos" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    Packs →
                  </Link>
                  <h2 className="text-3xl md:text-4xl font-bold mt-2">POLOS BOXY FIT</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <div className="text-center mt-8">
                <Link
                  href="/productos"
                  className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Ver todo
                </Link>
              </div>
            </div>
          </section>

          {/* New Products */}
          <section className="bg-white py-16">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">NUEVOS LANZAMIENTOS</h2>
                <p className="text-gray-600">Las últimas novedades de KRAZE</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {newProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <div className="text-center mt-8">
                <Link
                  href="/productos?nuevo=true"
                  className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Ver más nuevos
                </Link>
              </div>
            </div>
          </section>
        </>
      )}



      {/* Social Media Section */}
      <section className="bg-black text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">SOCIAL MEDIA</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            "Únete a la comunidad Kraze y síguenos en nuestras redes sociales para acceder a promociones exclusivas."
          </p>
          <a
            href="https://www.instagram.com/kraze_peru/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
          >
            SÍGUENOS
          </a>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-black text-white py-12 border-t border-gray-800">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">
                Sé de los primeros en enterarte de los nuevos lanzamientos y promociones ¡REGÍSTRATE!
              </h3>
            </div>

            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Correo electrónico"
                className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                →
              </button>
            </form>

            <div className="flex items-center justify-center gap-6 mt-8">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/kraze_peru/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="bg-black text-white py-8 border-t border-gray-800">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex gap-8">
              <Link href="/politicas" className="text-sm text-gray-400 hover:text-white transition-colors underline">
                Política de envíos
              </Link>
              <Link href="/preguntas" className="text-sm text-gray-400 hover:text-white transition-colors underline">
                Preguntas frecuentes
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              © 2026, KRAZE PERÚ
            </p>
          </div>
        </div>
      </section>
    </>
  )
}