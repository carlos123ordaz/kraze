'use client'

import { useEffect, useState } from 'react'
import ProductCard from '../../components/products/ProductCard'
import { FiTag, FiClock, FiTrendingDown, FiPercent, FiGrid, FiList } from 'react-icons/fi'
import axios from 'axios'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function OfertasPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState('grid')
    const [sortBy, setSortBy] = useState('discount')

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/products?estado=activo&ordenar=-createdAt`)
            const productsWithDiscount = data.productos.filter(p => p.descuento?.activo) || []
            setProducts(productsWithDiscount)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    // Calcular estadísticas de ofertas
    const maxDiscount = products.length > 0
        ? Math.max(...products.map(p => p.descuento?.porcentaje || 0))
        : 0

    const totalSavings = products.reduce((sum, p) => {
        if (p.descuento?.activo) {
            return sum + (p.precio * (p.descuento.porcentaje / 100))
        }
        return sum
    }, 0)

    // Ordenar productos
    const sortedProducts = [...products].sort((a, b) => {
        switch (sortBy) {
            case 'discount':
                return (b.descuento?.porcentaje || 0) - (a.descuento?.porcentaje || 0)
            case 'price_asc':
                const priceA = a.descuento?.activo
                    ? a.precio * (1 - a.descuento.porcentaje / 100)
                    : a.precio
                const priceB = b.descuento?.activo
                    ? b.precio * (1 - b.descuento.porcentaje / 100)
                    : b.precio
                return priceA - priceB
            case 'price_desc':
                const priceA2 = a.descuento?.activo
                    ? a.precio * (1 - a.descuento.porcentaje / 100)
                    : a.precio
                const priceB2 = b.descuento?.activo
                    ? b.precio * (1 - b.descuento.porcentaje / 100)
                    : b.precio
                return priceB2 - priceA2
            default:
                return 0
        }
    })

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent mb-4"></div>
                    <p className="text-gray-600">Cargando ofertas especiales...</p>
                </div>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container-custom py-20">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiTag size={40} className="text-red-600" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            No hay ofertas disponibles
                        </h1>
                        <p className="text-gray-600 mb-8">
                            En este momento no tenemos productos en oferta, pero ¡vuelve pronto! Constantemente agregamos nuevas promociones.
                        </p>
                        <Link
                            href="/productos"
                            className="inline-block bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            Explorar Todos los Productos
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                <div className="container-custom py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                            <span className="text-sm font-semibold uppercase tracking-wider">Ofertas Especiales</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Hasta {maxDiscount}% de Descuento
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 mb-8">
                            Aprovecha nuestras ofertas exclusivas en productos seleccionados
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold mb-1">{products.length}</div>
                                <div className="text-sm text-white/80">Productos</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold mb-1">{maxDiscount}%</div>
                                <div className="text-sm text-white/80">Descuento Máx</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold mb-1">S/ {totalSavings.toFixed(0)}</div>
                                <div className="text-sm text-white/80">Ahorro Total</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Banner */}
            <div className="bg-white border-b border-gray-200">
                <div className="container-custom py-6">
                    <div className="flex flex-wrap justify-center gap-8 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                            <FiPercent className="text-red-600" size={20} />
                            <span>Descuentos de hasta {maxDiscount}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <FiTrendingDown className="text-red-600" size={20} />
                            <span>Precios rebajados</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <FiClock className="text-red-600" size={20} />
                            <span>Ofertas por tiempo limitado</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="container-custom py-8">
                {/* Controls */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                                Productos en Oferta
                            </h2>
                            <p className="text-gray-600 text-sm">
                                {products.length} {products.length === 1 ? 'producto' : 'productos'} disponibles
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* View Mode Toggle */}
                            <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    aria-label="Vista de cuadrícula"
                                >
                                    <FiGrid size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    aria-label="Vista de lista"
                                >
                                    <FiList size={20} />
                                </button>
                            </div>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                            >
                                <option value="discount">Mayor Descuento</option>
                                <option value="price_asc">Precio: Menor a Mayor</option>
                                <option value="price_desc">Precio: Mayor a Menor</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                        : 'space-y-6'
                }>
                    {sortedProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            viewMode={viewMode}
                        />
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-center text-white">
                    <h3 className="text-2xl font-bold mb-3">¿No encontraste lo que buscabas?</h3>
                    <p className="text-gray-300 mb-6">
                        Explora toda nuestra colección y descubre más productos increíbles
                    </p>
                    <Link
                        href="/productos"
                        className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                    >
                        Ver Todos los Productos
                    </Link>
                </div>
            </div>
        </div>
    )
}