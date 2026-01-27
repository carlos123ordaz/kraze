'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

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

    return (
        <div className="container-custom py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-serif font-bold mb-4">Colecciones</h1>
                <p className="text-accent">Descubre nuestras colecciones exclusivas</p>
            </div>

            {loading ? (
                <div className="text-center py-20">Cargando colecciones...</div>
            ) : collections.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-accent mb-4">No hay colecciones disponibles en este momento</p>
                    <Link href="/productos" className="btn-primary">
                        Ver Todos los Productos
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {collections.map((collection) => (
                        <Link
                            key={collection._id}
                            href={`/productos?coleccion=${collection._id}`}
                            className="group"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden bg-light-gray mb-4">
                                {collection.imagen?.url ? (
                                    <Image
                                        src={collection.imagen.url}
                                        alt={collection.nombre}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-accent">Sin imagen</span>
                                    </div>
                                )}
                                {collection.destacado && (
                                    <span className="absolute top-4 left-4 bg-primary text-secondary px-3 py-1 text-xs uppercase tracking-wide">
                                        Destacado
                                    </span>
                                )}
                            </div>
                            <h3 className="text-xl font-serif font-bold mb-2">{collection.nombre}</h3>
                            {collection.descripcion && (
                                <p className="text-accent text-sm mb-3">{collection.descripcion}</p>
                            )}
                            <span className="text-sm uppercase tracking-wide hover:underline">
                                Ver Colección →
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}