'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '../../components/products/ProductCard'
import { FiChevronDown } from 'react-icons/fi'
import axios from 'axios'
import { API_URL } from '../config'

function ProductsContent() {
    const searchParams = useSearchParams()
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        genero: searchParams.get('genero') || '',
        categoria: searchParams.get('categoria') || '',
        coleccion: searchParams.get('coleccion') || '',
        nuevo: searchParams.get('nuevo') || '',
        buscar: searchParams.get('buscar') || '',
        precioMin: 0,
        precioMax: 500,
        ordenar: 'featured',
    })

    const [priceRange, setPriceRange] = useState({ min: 0, max: 500 })

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [filters])

    useEffect(() => {
        if (products.length > 0) {
            const prices = products.map(p => p.precio)
            const min = Math.floor(Math.min(...prices))
            const max = Math.ceil(Math.max(...prices))
            setPriceRange({ min, max })
        }
    }, [products])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (filters.genero) params.append('genero', filters.genero)
            if (filters.categoria) params.append('categoria', filters.categoria)
            if (filters.coleccion) params.append('coleccion', filters.coleccion)
            if (filters.nuevo) params.append('nuevo', 'true')
            if (filters.buscar) params.append('buscar', filters.buscar)
            if (filters.precioMin > priceRange.min) params.append('precioMin', filters.precioMin)
            if (filters.precioMax < priceRange.max) params.append('precioMax', filters.precioMax)
            params.append('ordenar', filters.ordenar)

            const { data } = await axios.get(`${API_URL}/products?${params}`)
            setProducts(data.productos || [])
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/categories`)
            setCategories(data.categorias || [])
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const handleFilterChange = (newFilters) => {
        setFilters({ ...filters, ...newFilters })
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="container-custom py-12">
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
                            {filters.buscar ? `"${filters.buscar}"` :
                                filters.coleccion ? filters.coleccion.toUpperCase() :
                                    filters.nuevo ? 'NUEVOS PRODUCTOS' :
                                        filters.genero === 'mujer' ? 'MUJER' :
                                            filters.genero === 'hombre' ? 'HOMBRE' :
                                                'POLOS BOXY FIT'}
                        </h1>
                        <p className="text-gray-600 uppercase tracking-wide text-sm">
                            {filters.coleccion || 'POLOS BOXY FIT'}
                        </p>
                    </div>

                    {/* Filters Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <div>
                                <span className="text-sm text-gray-600 font-medium">Filtrar:</span>
                            </div>

                            {/* Disponibilidad Dropdown */}
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-10 text-sm focus:outline-none focus:border-black cursor-pointer"
                                    defaultValue=""
                                >
                                    <option value="">Disponibilidad</option>
                                    <option value="in-stock">En Stock</option>
                                    <option value="out-of-stock">Agotado</option>
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600" size={16} />
                            </div>

                            {/* Precio Dropdown */}
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-10 text-sm focus:outline-none focus:border-black cursor-pointer"
                                    defaultValue=""
                                >
                                    <option value="">Precio</option>
                                    <option value="0-50">S/ 0 - S/ 50</option>
                                    <option value="50-100">S/ 50 - S/ 100</option>
                                    <option value="100-150">S/ 100 - S/ 150</option>
                                    <option value="150+">S/ 150+</option>
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600" size={16} />
                            </div>
                        </div>

                        {/* Sort and Count */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">{products.length} productos</span>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Ordenar por:</span>
                                <div className="relative">
                                    <select
                                        value={filters.ordenar}
                                        onChange={(e) => handleFilterChange({ ordenar: e.target.value })}
                                        className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-10 text-sm focus:outline-none focus:border-black cursor-pointer"
                                    >
                                        <option value="featured">Características</option>
                                        <option value="reciente">Más Reciente</option>
                                        <option value="precio_asc">Precio: Menor a Mayor</option>
                                        <option value="precio_desc">Precio: Mayor a Menor</option>
                                        <option value="nombre">Nombre: A-Z</option>
                                    </select>
                                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600" size={16} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container-custom py-12">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent mb-4"></div>
                            <p className="text-gray-600">Cargando productos...</p>
                        </div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-600 text-lg">No se encontraron productos</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2 mt-12">
                            <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                                ←
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center bg-black text-white rounded">
                                1
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                                2
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                                →
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* WhatsApp Button - Floating */}
            <a
                href="https://wa.me/51987654321?text=Hola,%20tengo%20una%20consulta%20sobre%20los%20productos"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-3 group"
                aria-label="Contactar por WhatsApp"
            >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="hidden group-hover:block text-sm font-medium whitespace-nowrap pr-1">
                    Chatea con nosotros
                </span>
            </a>

            {/* Footer Newsletter Section */}
            <section className="bg-black text-white py-12 mt-20">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-6">
                            <h3 className="text-xl md:text-2xl font-bold mb-2">
                                Sé de los primeros en enterarte de los nuevos lanzamientos y promociones ¡REGÍSTRATE!
                            </h3>
                        </div>

                        <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                className="flex-1 px-6 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                                required
                            />
                            <button
                                type="submit"
                                className="px-8 py-3 bg-white text-black rounded-md font-bold hover:bg-gray-200 transition-colors"
                            >
                                →
                            </button>
                        </form>

                        <div className="flex items-center justify-center gap-6">
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
                                href="https://instagram.com"
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
            <section className="bg-black text-white py-6 border-t border-gray-800">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex gap-8">
                            <a href="/politicas" className="text-sm text-gray-400 hover:text-white transition-colors underline">
                                Política de envíos
                            </a>
                            <a href="/preguntas" className="text-sm text-gray-400 hover:text-white transition-colors underline">
                                Preguntas frecuentes
                            </a>
                        </div>
                        <p className="text-sm text-gray-500">
                            © 2026, KRAZE PERÚ
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    )
}