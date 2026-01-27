'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '../../components/products/ProductCard'
import ProductFilters from '../../components/products/ProductFilters'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function ProductsPage() {
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
        precioMin: '',
        precioMax: '',
        ordenar: 'reciente',
    })
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [filters])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (filters.genero) params.append('genero', filters.genero)
            if (filters.categoria) params.append('categoria', filters.categoria)
            if (filters.coleccion) params.append('coleccion', filters.coleccion)
            if (filters.nuevo) params.append('nuevo', 'true')
            if (filters.buscar) params.append('buscar', filters.buscar)
            if (filters.precioMin) params.append('precioMin', filters.precioMin)
            if (filters.precioMax) params.append('precioMax', filters.precioMax)
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
            precioMin: '',
            precioMax: '',
            ordenar: 'reciente',
        })
    }

    return (
        <div className="container-custom py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold mb-2">
                        {filters.buscar ? `Resultados para "${filters.buscar}"` :
                            filters.nuevo ? 'Nuevos Productos' :
                                filters.genero === 'mujer' ? 'Mujer' :
                                    filters.genero === 'hombre' ? 'Hombre' :
                                        'Todos los Productos'}
                    </h1>
                    <p className="text-accent">{products.length} productos</p>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden btn-secondary py-2 px-4"
                >
                    Filtros
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className={`w-full md:w-64 ${showFilters ? 'block' : 'hidden md:block'}`}>
                    <ProductFilters
                        filters={filters}
                        categories={categories}
                        onFilterChange={handleFilterChange}
                        onClearFilters={clearFilters}
                    />
                </aside>

                {/* Products Grid */}
                <div className="flex-1">
                    {/* Sort */}
                    <div className="flex justify-end mb-6">
                        <select
                            value={filters.ordenar}
                            onChange={(e) => handleFilterChange({ ordenar: e.target.value })}
                            className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-primary"
                        >
                            <option value="reciente">Más Reciente</option>
                            <option value="precio_asc">Precio: Menor a Mayor</option>
                            <option value="precio_desc">Precio: Mayor a Menor</option>
                            <option value="nombre">Nombre: A-Z</option>
                        </select>
                    </div>

                    {/* Products */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-accent mb-4">No se encontraron productos</p>
                            <button onClick={clearFilters} className="btn-primary">
                                Limpiar Filtros
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}