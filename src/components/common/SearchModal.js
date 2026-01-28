'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FiX, FiSearch } from 'react-icons/fi'
import axios from 'axios'
import { API_URL } from '@/app/config'

export default function SearchModal({ isOpen, onClose }) {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (query.length >= 2) {
            searchProducts()
        } else {
            setResults([])
        }
    }, [query])

    const searchProducts = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${API_URL}/products?buscar=${query}&limite=8`)
            setResults(data.productos || [])
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleProductClick = (productId) => {
        router.push(`/producto/${productId}`)
        onClose()
        setQuery('')
    }

    const handleViewAll = () => {
        router.push(`/productos?buscar=${query}`)
        onClose()
        setQuery('')
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative min-h-screen flex items-start justify-center p-4">
                <div className="relative bg-white w-full max-w-2xl mt-20 rounded-lg shadow-xl">
                    {/* Header */}
                    <div className="flex items-center gap-4 p-6 border-b border-gray-200">
                        <FiSearch size={24} className="text-accent" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                            className="flex-1 text-lg focus:outline-none"
                        />
                        <button onClick={onClose} className="hover:text-accent transition-colors">
                            <FiX size={24} />
                        </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-[60vh] overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-accent">Buscando...</div>
                        ) : query.length < 2 ? (
                            <div className="p-8 text-center text-accent">
                                Escribe al menos 2 caracteres para buscar
                            </div>
                        ) : results.length === 0 ? (
                            <div className="p-8 text-center text-accent">
                                No se encontraron productos para "{query}"
                            </div>
                        ) : (
                            <>
                                <div className="p-4 space-y-2">
                                    {results.map((product) => (
                                        <button
                                            key={product._id}
                                            onClick={() => handleProductClick(product._id)}
                                            className="w-full flex items-center gap-4 p-3 hover:bg-light-gray transition-colors rounded-lg text-left"
                                        >
                                            <div className="relative w-16 h-16 flex-shrink-0 bg-light-gray">
                                                {product.imagenesPrincipales?.[0]?.url && (
                                                    <Image
                                                        src={product.imagenesPrincipales[0].url}
                                                        alt={product.nombre}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{product.nombre}</p>
                                                <p className="text-sm text-accent truncate">
                                                    {product.categoria?.nombre || 'Sin categoría'}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                {product.descuento?.activo ? (
                                                    <>
                                                        <p className="font-bold">
                                                            S/ {(product.precio * (1 - product.descuento.porcentaje / 100)).toFixed(2)}
                                                        </p>
                                                        <p className="text-xs text-accent line-through">
                                                            S/ {product.precio.toFixed(2)}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="font-bold">S/ {product.precio.toFixed(2)}</p>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {results.length >= 8 && (
                                    <div className="p-4 border-t border-gray-200">
                                        <button
                                            onClick={handleViewAll}
                                            className="w-full btn-secondary py-3"
                                        >
                                            Ver todos los resultados
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}