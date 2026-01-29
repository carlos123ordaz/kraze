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
                <div className="bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Image */}
                        <div className="relative w-full sm:w-48 aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                                src={product.imagenesPrincipales?.[0]?.url || '/placeholder.jpg'}
                                alt={product.nombre}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {product.descuento?.activo && (
                                <div className="absolute top-3 left-3">
                                    <span className="bg-red-600 text-white px-3 py-1.5 text-xs font-bold rounded">
                                        Oferta
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between py-2">
                            <div>
                                <h3 className="text-base font-medium text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                                    {product.nombre}
                                </h3>
                                {product.descripcion && (
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                        {product.descripcion}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {discountedPrice ? (
                                    <>
                                        <span className="text-sm text-gray-400 line-through">
                                            S/ {product.precio.toFixed(2)} PEN
                                        </span>
                                        <span className="text-base font-bold text-gray-900">
                                            S/ {discountedPrice.toFixed(2)} PEN
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-base font-bold text-gray-900">
                                        S/ {product.precio.toFixed(2)} PEN
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        )
    }

    // Grid View - Estilo Savage exacto
    return (
        <Link href={`/producto/${product.slug}`} className="group block">
            <div className="bg-white overflow-hidden">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100 mb-3">
                    <Image
                        src={product.imagenesPrincipales?.[0]?.url || '/placeholder.jpg'}
                        alt={product.nombre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Badge de Oferta - Estilo Savage exacto */}
                    {product.descuento?.activo && (
                        <div className="absolute top-3 left-3">
                            <span className="bg-red-600 text-white px-3 py-1.5 text-xs font-bold rounded shadow-sm">
                                Oferta
                            </span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    {/* Nombre del producto */}
                    <h3 className="text-sm md:text-base font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                        {product.nombre}
                    </h3>

                    {/* Precios - Estilo Savage */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {discountedPrice ? (
                            <>
                                <span className="text-sm text-gray-400 line-through">
                                    S/ {product.precio.toFixed(2)} PEN
                                </span>
                                <span className="text-base font-bold text-gray-900">
                                    S/ {discountedPrice.toFixed(2)} PEN
                                </span>
                            </>
                        ) : (
                            <span className="text-base font-bold text-gray-900">
                                S/ {product.precio.toFixed(2)} PEN
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}