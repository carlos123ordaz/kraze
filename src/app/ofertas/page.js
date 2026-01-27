'use client'

import { useEffect, useState } from 'react'
import ProductCard from '../../components/products/ProductCard'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function OfertasPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            // Buscar productos con descuento activo
            const { data } = await axios.get(`${API_URL}/products?estado=activo&ordenar=-createdAt`)
            // Filtrar solo productos con descuento
            const productsWithDiscount = data.productos.filter(p => p.descuento?.activo) || []
            setProducts(productsWithDiscount)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container-custom py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-serif font-bold mb-4">Ofertas Especiales</h1>
                <p className="text-accent">Aprovecha nuestros descuentos exclusivos</p>
            </div>

            {loading ? (
                <div className="text-center py-20">Cargando ofertas...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-accent mb-4">No hay ofertas disponibles en este momento</p>
                    <p className="text-sm text-accent mb-6">¡Vuelve pronto para descubrir nuevas promociones!</p>
                    <a href="/productos" className="btn-primary">
                        Ver Todos los Productos
                    </a>
                </div>
            ) : (
                <>
                    <div className="bg-light-gray p-6 rounded-lg mb-8 text-center">
                        <p className="text-lg font-medium">
                            🎉 {products.length} productos en oferta
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}