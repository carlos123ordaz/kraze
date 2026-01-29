'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { API_URL } from '@/app/config'

export default function CategoriesSection() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/categories?mostrarEnHome=true&activo=true`)
            // Ordenar por el campo 'orden'
            const sortedCategories = (data.categorias || []).sort((a, b) => a.orden - b.orden)
            setCategories(sortedCategories)
        } catch (error) {
            console.error('Error al cargar categorías:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <section className="bg-white py-16">
                <div className="container-custom">
                    <div className="text-center">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent mb-4"></div>
                        <p className="text-gray-600">Cargando categorías...</p>
                    </div>
                </div>
            </section>
        )
    }

    if (categories.length === 0) {
        return null
    }

    // Dividir categorías: primeras 2 son grandes, el resto pequeñas
    const categoriasGrandes = categories.slice(0, 2)
    const categoriasPequenas = categories.slice(2, 4)

    return (
        <section className="bg-white py-16">
            <div className="container-custom">
                {/* Título */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">CATEGORÍAS</h2>
                </div>

                {/* Grid Layout - Estilo Savage */}
                <div className="space-y-6">
                    {/* Fila 1: 2 categorías GRANDES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {categoriasGrandes.map((category) => (
                            <Link
                                key={category._id}
                                href={`/productos?categoria=${category._id}`}
                                className="group relative h-[400px] md:h-[500px] overflow-hidden rounded-xl bg-gray-100"
                            >
                                <div className="absolute inset-0">
                                    <Image
                                        src={category.imagen?.url || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'}
                                        alt={category.imagen?.alt || category.nombre}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                                </div>

                                {/* Texto */}
                                <div className="relative h-full flex items-end p-6 md:p-8">
                                    <div>
                                        <h3 className="text-white text-2xl md:text-3xl font-bold mb-1 uppercase">
                                            {category.nombre}
                                        </h3>
                                        <span className="text-white text-lg flex items-center gap-2">
                                            →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Fila 2: 2 categorías PEQUEÑAS (si existen) */}
                    {categoriasPequenas.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {categoriasPequenas.map((category) => (
                                <Link
                                    key={category._id}
                                    href={`/productos?categoria=${category._id}`}
                                    className="group relative h-[300px] md:h-[350px] overflow-hidden rounded-xl bg-gray-100"
                                >
                                    <div className="absolute inset-0">
                                        <Image
                                            src={category.imagen?.url || 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'}
                                            alt={category.imagen?.alt || category.nombre}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                                    </div>

                                    {/* Texto */}
                                    <div className="relative h-full flex items-end p-6">
                                        <div>
                                            <h3 className="text-white text-xl md:text-2xl font-bold mb-1 uppercase">
                                                {category.nombre}
                                            </h3>
                                            <span className="text-white flex items-center gap-2">
                                                →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}