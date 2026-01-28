'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function ProductCard({ product, viewMode = 'grid' }) {

    const discountedPrice = product.descuento?.activo
        ? product.precio * (1 - product.descuento.porcentaje / 100)
        : null

    if (viewMode === 'list') {
        return (
            <Link href={`/producto/${product.slug}`} className="group">
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                        {/* Image */}
                        <div className="relative w-full sm:w-48 aspect-[3/4] sm:aspect-square overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                            <Image
                                src={product.imagenesPrincipales?.[0]?.url || '/placeholder.jpg'}
                                alt={product.nombre}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {product.nuevo && (
                                <span className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-medium rounded">
                                    NUEVO
                                </span>
                            )}
                            {product.descuento?.activo && (
                                <span className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                                    -{product.descuento.porcentaje}%
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                    {product.categoria?.nombre || 'Sin categoría'}
                                </p>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                                    {product.nombre}
                                </h3>
                                {product.descripcion && (
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                        {product.descripcion}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {discountedPrice ? (
                                        <>
                                            <span className="text-lg font-bold text-gray-900">
                                                S/ {discountedPrice.toFixed(2)}
                                            </span>
                                            <span className="text-sm text-gray-500 line-through">
                                                S/ {product.precio.toFixed(2)}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-lg font-bold text-gray-900">
                                            S/ {product.precio.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        )
    }

    // Grid View (default)
    return (
        <Link href={`/producto/${product.slug}`} className="group">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <Image
                        src={product.imagenesPrincipales?.[0]?.url || '/placeholder.jpg'}
                        alt={product.nombre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.nuevo && (
                        <span className="absolute top-3 left-3 bg-black text-white px-2.5 py-1 text-xs font-medium rounded shadow-sm">
                            NUEVO
                        </span>
                    )}
                    {product.descuento?.activo && (
                        <span className="absolute top-3 right-3 bg-red-600 text-white px-2.5 py-1 text-xs font-bold rounded shadow-sm">
                            -{product.descuento.porcentaje}%
                        </span>
                    )}
                </div>

                <div className="p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        {product.categoria?.nombre || 'Sin categoría'}
                    </p>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                        {product.nombre}
                    </h3>
                    <div className="flex items-center gap-2">
                        {discountedPrice ? (
                            <>
                                <span className="text-lg font-bold text-gray-900">
                                    S/ {discountedPrice.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    S/ {product.precio.toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-gray-900">
                                S/ {product.precio.toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}