'use client'

import { useEffect, useState } from 'react'
import Hero from '../components/home/Hero'
import ProductCard from '../components/products/ProductCard'
import Link from 'next/link'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

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
        axios.get(`${API_URL}/products?destacado=true&limite=4`),
        axios.get(`${API_URL}/products?nuevo=true&limite=4`),
      ])
      setFeaturedProducts(featured.data.productos || [])
      setNewProducts(newest.data.productos || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Hero />

      {/* Featured Products */}
      <section className="container-custom py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4">Productos Destacados</h2>
          <p className="text-accent">Descubre nuestras piezas más populares</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Cargando...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/productos" className="btn-primary">
            Ver Todos los Productos
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-light-gray py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">Recién Llegados</h2>
            <p className="text-accent">Las últimas novedades en moda</p>
          </div>

          {loading ? (
            <div className="text-center py-12">Cargando...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/productos?nuevo=true" className="btn-secondary">
              Ver Nuevos Productos
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Banner */}
      <section className="container-custom py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/productos?genero=mujer" className="relative h-96 group overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800)',
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>
            <div className="relative z-10 h-full flex items-center justify-center text-secondary">
              <div className="text-center">
                <h3 className="text-3xl font-serif font-bold mb-4">MUJER</h3>
                <span className="btn-secondary">Comprar Ahora</span>
              </div>
            </div>
          </Link>

          <Link href="/productos?genero=hombre" className="relative h-96 group overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800)',
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>
            <div className="relative z-10 h-full flex items-center justify-center text-secondary">
              <div className="text-center">
                <h3 className="text-3xl font-serif font-bold mb-4">HOMBRE</h3>
                <span className="btn-secondary">Comprar Ahora</span>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </>
  )
}