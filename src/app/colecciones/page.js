'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight, FiTag, FiPackage } from 'react-icons/fi'
import axios from 'axios'
import { API_URL } from '../config'

export default function ColeccionesPage() {
    const [collections, setCollections] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCollections()
    }, [])

    const fetchCollections = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/collections?activo=true`)
            setCollections(data.colecciones || [])
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent mb-4"></div>
                    <p className="text-gray-600">Cargando colecciones...</p>
                </div>
            </div>
        )
    }

    if (collections.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container-custom py-20">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiPackage size={40} className="text-gray-400" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            No hay colecciones disponibles
                        </h1>
                        <p className="text-gray-600 mb-8">
                            En este momento no tenemos colecciones activas, pero puedes explorar todos nuestros productos.
                        </p>
                        <Link
                            href="/productos"
                            className="inline-block bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            Explorar Productos
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="container-custom py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full mb-4">
                            <FiTag size={18} className="text-gray-700" />
                            <span className="text-sm font-medium text-gray-700 uppercase tracking-wider">
                                Nuestras Colecciones
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                            Explora Nuestro Estilo
                        </h1>
                        <p className="text-lg text-gray-600">
                            Descubre colecciones curadas especialmente para ti con las últimas tendencias y estilos únicos
                        </p>
                    </div>
                </div>
            </div>

            {/* Collections Grid */}
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {collections.map((collection, index) => (
                        <Link
                            key={collection._id}
                            href={`/productos?coleccion=${collection._id}`}
                            className="group"
                        >
                            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                                {/* Image */}
                                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                                    {collection.imagen?.url ? (
                                        <Image
                                            src={collection.imagen.url}
                                            alt={collection.nombre}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            priority={index < 3}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FiPackage size={48} className="text-gray-300" />
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Badges */}
                                    {collection.destacado && (
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                                                Destacado
                                            </span>
                                        </div>
                                    )}

                                    {/* Hover CTA */}
                                    <div className="absolute bottom-6 left-6 right-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <div className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-xl">
                                            <span>Ver Colección</span>
                                            <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                                        {collection.nombre}
                                    </h3>
                                    {collection.descripcion && (
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                            {collection.descripcion}
                                        </p>
                                    )}
                                    <div className="flex items-center text-sm font-medium text-gray-900 group-hover:gap-2 transition-all">
                                        <span>Explorar ahora</span>
                                        <FiArrowRight size={16} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="container-custom pb-12">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-center text-white">
                    <h3 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h3>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Explora nuestra colección completa de productos y encuentra el estilo perfecto para ti
                    </p>
                    <Link
                        href="/productos"
                        className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                    >
                        <span>Ver Todos los Productos</span>
                        <FiArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    )
}