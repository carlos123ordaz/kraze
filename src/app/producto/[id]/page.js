'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'
import ProductGallery from '../../../components/products/ProductGallery'
import ProductInfo from '../../../components/products/ProductInfo'
import ProductReviews from '../../../components/products/ProductReviews'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function ProductPage() {
    const params = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProduct()
    }, [params.id])

    const fetchProduct = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${API_URL}/products/${params.id}`)
            setProduct(data.producto)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="container-custom py-20 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="container-custom py-20 text-center">
                <p className="text-accent mb-4">Producto no encontrado</p>
            </div>
        )
    }

    return (
        <div className="container-custom py-8">
            {/* Breadcrumb */}
            <div className="text-sm text-accent mb-8">
                <a href="/" className="hover:text-primary">Inicio</a>
                <span className="mx-2">/</span>
                <a href="/productos" className="hover:text-primary">Productos</a>
                <span className="mx-2">/</span>
                <span>{product.nombre}</span>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                <ProductGallery images={product.imagenesPrincipales} />
                <ProductInfo product={product} />
            </div>

            {/* Product Description */}
            <div className="max-w-3xl mx-auto mb-20">
                <h2 className="text-2xl font-serif font-bold mb-4">Descripción</h2>
                <p className="text-accent leading-relaxed">
                    {product.descripcionCompleta || product.descripcionCorta}
                </p>
            </div>

            {/* Reviews */}
            <ProductReviews productId={product._id} />
        </div>
    )
}