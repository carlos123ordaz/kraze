'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FiChevronRight, FiPackage, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi'
import axios from 'axios'
import ProductGallery from '../../../components/products/ProductGallery'
import ProductInfo from '../../../components/products/ProductInfo'
import ProductReviews from '../../../components/products/ProductReviews'
import { API_URL } from '@/app/config'

export default function ProductPage() {
    const params = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('description')

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

    const features = [
        {
            icon: <FiTruck size={24} />,
            title: 'Envío Gratis',
            description: 'En compras mayores a S/ 150'
        },
        {
            icon: <FiRefreshCw size={24} />,
            title: 'Devolución Fácil',
            description: '30 días para cambios y devoluciones'
        },
        {
            icon: <FiShield size={24} />,
            title: 'Compra Segura',
            description: 'Protección de pagos garantizada'
        },
        {
            icon: <FiPackage size={24} />,
            title: 'Entrega Rápida',
            description: '2-3 días en Lima, 3-5 días en provincias'
        }
    ]

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent mb-4"></div>
                    <p className="text-gray-600">Cargando producto...</p>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiPackage size={40} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Producto no encontrado</h2>
                    <p className="text-gray-600 mb-6">El producto que buscas no existe o ha sido eliminado</p>
                    <Link href="/productos" className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                        Ver Todos los Productos
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="container-custom py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Inicio
                        </Link>
                        <FiChevronRight className="text-gray-400" size={16} />
                        <Link href="/productos" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Productos
                        </Link>
                        <FiChevronRight className="text-gray-400" size={16} />
                        {product.categoria && (
                            <>
                                <Link
                                    href={`/productos?categoria=${product.categoria._id}`}
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    {product.categoria.nombre}
                                </Link>
                                <FiChevronRight className="text-gray-400" size={16} />
                            </>
                        )}
                        <span className="text-gray-900 font-medium truncate max-w-xs">{product.nombre}</span>
                    </nav>
                </div>
            </div>

            {/* Product Details */}
            <div className="container-custom py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
                    <div className="lg:sticky lg:top-24 self-start">
                        <ProductGallery images={product.imagenesPrincipales} />
                    </div>
                    <ProductInfo product={product} />
                </div>

                {/* Features Banner */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 text-gray-900 mb-3">
                                    {feature.icon}
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{feature.title}</h3>
                                <p className="text-xs text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-12">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-200">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'description'
                                    ? 'text-gray-900 border-b-2 border-black'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Descripción
                            </button>
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'details'
                                    ? 'text-gray-900 border-b-2 border-black'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Detalles
                            </button>
                            <button
                                onClick={() => setActiveTab('shipping')}
                                className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'shipping'
                                    ? 'text-gray-900 border-b-2 border-black'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Envío y Devoluciones
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 'description' && (
                            <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {product.descripcionCompleta || product.descripcionCorta || 'Sin descripción disponible'}
                                </p>
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {product.categoria && (
                                        <div className="flex justify-between py-3 border-b border-gray-200">
                                            <span className="text-gray-600 font-medium">Categoría:</span>
                                            <span className="text-gray-900">{product.categoria.nombre}</span>
                                        </div>
                                    )}
                                    {product.marca && (
                                        <div className="flex justify-between py-3 border-b border-gray-200">
                                            <span className="text-gray-600 font-medium">Marca:</span>
                                            <span className="text-gray-900">{product.marca}</span>
                                        </div>
                                    )}
                                    {product.genero && (
                                        <div className="flex justify-between py-3 border-b border-gray-200">
                                            <span className="text-gray-600 font-medium">Género:</span>
                                            <span className="text-gray-900 capitalize">{product.genero}</span>
                                        </div>
                                    )}
                                    {product.material && (
                                        <div className="flex justify-between py-3 border-b border-gray-200">
                                            <span className="text-gray-600 font-medium">Material:</span>
                                            <span className="text-gray-900">{product.material}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'shipping' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Envío</h3>
                                    <ul className="space-y-2 text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-600 mt-1">✓</span>
                                            <span>Envío gratis en compras mayores a S/ 150</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-600 mt-1">✓</span>
                                            <span>Entrega en 2-3 días hábiles en Lima Metropolitana</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-600 mt-1">✓</span>
                                            <span>Entrega en 3-5 días hábiles en provincias</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Devoluciones y Cambios</h3>
                                    <ul className="space-y-2 text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-600 mt-1">✓</span>
                                            <span>30 días para cambios y devoluciones</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-600 mt-1">✓</span>
                                            <span>Producto debe estar sin usar y con etiquetas</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-600 mt-1">✓</span>
                                            <span>Reembolso completo o cambio por otra talla/color</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <ProductReviews productId={product._id} />
                </div>
            </div>
        </div>
    )
}