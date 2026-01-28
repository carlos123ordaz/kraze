'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '../../components/products/ProductCard'
import ProductFilters from '../../components/products/ProductFilters'
import { FiGrid, FiList, FiFilter, FiX } from 'react-icons/fi'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

function ProductsContent() {
    const searchParams = useSearchParams()
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState('grid')
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [filters, setFilters] = useState({
        genero: searchParams.get('genero') || '',
        categoria: searchParams.get('categoria') || '',
        coleccion: searchParams.get('coleccion') || '',
        nuevo: searchParams.get('nuevo') || '',
        buscar: searchParams.get('buscar') || '',
        precioMin: 0,
        precioMax: 500,
        ordenar: 'reciente',
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

    const clearFilters = () => {
        setFilters({
            genero: '',
            categoria: '',
            coleccion: '',
            nuevo: '',
            buscar: '',
            precioMin: priceRange.min,
            precioMax: priceRange.max,
            ordenar: 'reciente',
        })
    }

    const activeFiltersCount = [
        filters.genero,
        filters.categoria,
        filters.coleccion,
        filters.nuevo,
        filters.precioMin > priceRange.min || filters.precioMax < priceRange.max
    ].filter(Boolean).length

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container-custom py-8">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                                {filters.buscar ? `Resultados para "${filters.buscar}"` :
                                    filters.nuevo ? 'Nuevos Productos' :
                                        filters.genero === 'mujer' ? 'Mujer' :
                                            filters.genero === 'hombre' ? 'Hombre' :
                                                'Todos los Productos'}
                            </h1>
                            <p className="text-gray-600">{products.length} {products.length === 1 ? 'producto' : 'productos'}</p>
                        </div>

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
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                        >
                            <FiFilter size={18} />
                            <span>Filtros</span>
                            {activeFiltersCount > 0 && (
                                <span className="bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <label className="text-sm text-gray-600 whitespace-nowrap">Ordenar por:</label>
                            <select
                                value={filters.ordenar}
                                onChange={(e) => handleFilterChange({ ordenar: e.target.value })}
                                className="flex-1 sm:flex-initial border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                            >
                                <option value="reciente">Más Reciente</option>
                                <option value="precio_asc">Precio: Menor a Mayor</option>
                                <option value="precio_desc">Precio: Mayor a Menor</option>
                                <option value="nombre">Nombre: A-Z</option>
                                <option value="popularidad">Más Popular</option>
                            </select>
                        </div>
                    </div>

                    {activeFiltersCount > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                            {filters.genero && (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                    Género: {filters.genero}
                                    <button
                                        onClick={() => handleFilterChange({ genero: '' })}
                                        className="hover:text-gray-900"
                                    >
                                        <FiX size={14} />
                                    </button>
                                </span>
                            )}
                            {filters.categoria && (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                    Categoría: {categories.find(c => c._id === filters.categoria)?.nombre}
                                    <button
                                        onClick={() => handleFilterChange({ categoria: '' })}
                                        className="hover:text-gray-900"
                                    >
                                        <FiX size={14} />
                                    </button>
                                </span>
                            )}
                            {(filters.precioMin > priceRange.min || filters.precioMax < priceRange.max) && (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                    Precio: S/ {filters.precioMin} - S/ {filters.precioMax}
                                    <button
                                        onClick={() => handleFilterChange({ precioMin: priceRange.min, precioMax: priceRange.max })}
                                        className="hover:text-gray-900"
                                    >
                                        <FiX size={14} />
                                    </button>
                                </span>
                            )}
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-600 hover:text-gray-900 underline"
                            >
                                Limpiar todos
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex gap-8">
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-4">
                            <ProductFilters
                                filters={filters}
                                categories={categories}
                                priceRange={priceRange}
                                onFilterChange={handleFilterChange}
                                onClearFilters={clearFilters}
                            />
                        </div>
                    </aside>

                    <div className="flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="text-center">
                                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent mb-4"></div>
                                    <p className="text-gray-600">Cargando productos...</p>
                                </div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                <div className="max-w-md mx-auto">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FiFilter size={32} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
                                    <p className="text-gray-600 mb-6">Intenta ajustar tus filtros o explora otras categorías</p>
                                    <button
                                        onClick={clearFilters}
                                        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        Limpiar Filtros
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={
                                viewMode === 'grid'
                                    ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                    : 'space-y-6'
                            }>
                                {products.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        viewMode={viewMode}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showMobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setShowMobileFilters(false)}
                    />
                    <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto animate-slide-in-right">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-lg font-semibold">Filtros</h2>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <ProductFilters
                                filters={filters}
                                categories={categories}
                                priceRange={priceRange}
                                onFilterChange={handleFilterChange}
                                onClearFilters={clearFilters}
                            />
                        </div>
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                            >
                                Ver {products.length} productos
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
        </div>
    )
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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