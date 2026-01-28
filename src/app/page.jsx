'use client'

import { useEffect, useState } from 'react'
import Hero from '../components/home/Hero'
import ProductCard from '../components/products/ProductCard'
import Link from 'next/link'
import { FiShield, FiTruck, FiCreditCard, FiHeadphones, FiStar } from 'react-icons/fi'
import axios from 'axios'
import Image from 'next/image'
import { API_URL } from './config'

const API_URL = API_URL

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
      icon: <FiTruck size={32} />,
      title: 'Envío Rápido',
      description: 'Entrega en 2-3 días en Lima y 3-5 días a provincias'
    },
    {
      icon: <FiShield size={32} />,
      title: 'Compra Segura',
      description: 'Protegemos tus datos con encriptación SSL'
    },
    {
      icon: <FiCreditCard size={32} />,
      title: 'Pago Flexible',
      description: 'Acepta tarjetas, Yape y pago contra entrega'
    },
    {
      icon: <FiHeadphones size={32} />,
      title: 'Soporte 24/7',
      description: 'Estamos aquí para ayudarte en todo momento'
    }
  ]

  const testimonials = [
    {
      name: 'María Gonzales',
      location: 'Lima, Perú',
      rating: 5,
      text: 'Excelente calidad y el envío fue súper rápido. Las prendas son tal cual se ven en las fotos. Definitivamente volveré a comprar.',
      image: 'https://i.pravatar.cc/150?img=1'
    },
    {
      name: 'Carlos Rodríguez',
      location: 'Arequipa, Perú',
      rating: 5,
      text: 'Me encantó la atención al cliente y la calidad de los productos. El proceso de compra fue muy fácil y seguro.',
      image: 'https://i.pravatar.cc/150?img=12'
    },
    {
      name: 'Ana Torres',
      location: 'Cusco, Perú',
      rating: 5,
      text: 'Primera vez que compro online y la experiencia fue increíble. Los productos llegaron perfectos y en el tiempo prometido.',
      image: 'https://i.pravatar.cc/150?img=5'
    }
  ]

  return (
    <>
      <Hero />

      {/* Trust Features Section */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-900 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-custom py-20">
        <div className="text-center mb-12">
          <span className="text-sm uppercase tracking-wider text-gray-600 font-medium">Lo Mejor de KRAZE</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Productos Destacados</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre nuestras piezas más populares, seleccionadas especialmente para ti
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent mb-4"></div>
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/productos"
                className="inline-block bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Ver Todos los Productos
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Categories Banner */}
      <section className="container-custom py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/productos?genero=mujer" className="relative h-[500px] group overflow-hidden rounded-2xl">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
                alt="Colección Mujer"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
              <span className="text-sm uppercase tracking-wider mb-2 font-medium">Nueva Colección</span>
              <h3 className="text-4xl md:text-5xl font-bold mb-4">MUJER</h3>
              <p className="text-gray-200 mb-6 max-w-sm">
                Descubre las últimas tendencias en moda femenina
              </p>
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Comprar Ahora
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          <Link href="/productos?genero=hombre" className="relative h-[500px] group overflow-hidden rounded-2xl">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800"
                alt="Colección Hombre"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
              <span className="text-sm uppercase tracking-wider mb-2 font-medium">Nueva Colección</span>
              <h3 className="text-4xl md:text-5xl font-bold mb-4">HOMBRE</h3>
              <p className="text-gray-200 mb-6 max-w-sm">
                Estilo y elegancia para el hombre moderno
              </p>
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Comprar Ahora
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-sm uppercase tracking-wider text-gray-600 font-medium">Novedades</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Recién Llegados</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Las últimas tendencias en moda, recién salidas del horno
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent mb-4"></div>
                <p className="text-gray-600">Cargando productos...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/productos?nuevo=true"
                  className="inline-block bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Ver Nuevos Productos
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container-custom py-20">
        <div className="text-center mb-12">
          <span className="text-sm uppercase tracking-wider text-gray-600 font-medium">Testimonios</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Lo Que Dicen Nuestros Clientes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Miles de clientes satisfechos confían en nosotros
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-black text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Suscríbete a Nuestro Newsletter
            </h2>
            <p className="text-gray-300 mb-8">
              Recibe las últimas novedades, ofertas exclusivas y tendencias directamente en tu correo
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Suscribirse
              </button>
            </form>

            <p className="text-sm text-gray-400 mt-4">
              Al suscribirte, aceptas recibir correos de marketing. Puedes cancelar en cualquier momento.
            </p>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="bg-white py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-sm uppercase tracking-wider text-gray-600 font-medium">Síguenos</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">@KrazePerú</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Etiquétanos en tus fotos para aparecer aquí
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
              'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
              'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400',
              'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400'
            ].map((img, index) => (
              <a
                key={index}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square group overflow-hidden rounded-lg block"
              >
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundImage: `url(${img})` }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="https://www.instagram.com/kraze_peru/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors font-medium"
            >
              Ver más en Instagram
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}