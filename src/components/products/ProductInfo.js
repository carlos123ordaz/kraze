'use client'

import { useState, useEffect } from 'react'
import { FiHeart, FiCheck, FiX } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'

export default function ProductInfo({ product }) {
    const { addToCart } = useCart()
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [notification, setNotification] = useState(null)

    // Obtener tallas únicas
    const sizes = [...new Set(product.variantes?.map(v => v.talla) || [])]

    // Obtener colores únicos
    const colors = [...new Map(
        product.variantes?.map(v => [v.color.codigoHex, v.color]) || []
    ).values()]

    // Seleccionar automáticamente la primera talla y color disponibles
    useEffect(() => {
        if (product.variantes && product.variantes.length > 0) {
            // Encontrar la primera variante con stock
            const firstAvailable = product.variantes.find(v => v.stock > 0)

            if (firstAvailable) {
                setSelectedSize(firstAvailable.talla)
                setSelectedColor(firstAvailable.color.codigoHex)
            } else if (sizes.length > 0 && colors.length > 0) {
                // Si no hay stock, seleccionar la primera talla y color de todas formas
                setSelectedSize(sizes[0])
                setSelectedColor(colors[0].codigoHex)
            }
        }
    }, [product.variantes])

    // Filtrar variantes disponibles según selección
    const availableVariants = product.variantes?.filter(v => {
        if (selectedSize && v.talla !== selectedSize) return false
        if (selectedColor && v.color.codigoHex !== selectedColor) return false
        return v.stock > 0
    }) || []

    // Obtener variante seleccionada actual
    const currentVariant = product.variantes?.find(
        v => v.talla === selectedSize && v.color.codigoHex === selectedColor
    )

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 3500)
    }

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            showNotification('Por favor selecciona talla y color', 'error')
            return
        }

        const variant = product.variantes?.find(
            v => v.talla === selectedSize && v.color.codigoHex === selectedColor
        )

        if (!variant || variant.stock === 0) {
            showNotification('Esta variante no está disponible en stock', 'error')
            return
        }

        if (quantity > variant.stock) {
            showNotification(`Solo hay ${variant.stock} unidades disponibles`, 'error')
            return
        }

        addToCart(product, variant, quantity)

        const colorName = colors.find(c => c.codigoHex === selectedColor)?.nombre || ''
        showNotification(
            `¡Agregado! ${quantity} ${quantity > 1 ? 'unidades' : 'unidad'} - Talla ${selectedSize}, Color ${colorName}`,
            'success'
        )
    }

    const precio = product.descuento?.activo
        ? product.precio * (1 - product.descuento.porcentaje / 100)
        : product.precio

    return (
        <div className="relative">
            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className={`flex items-start gap-3 p-4 rounded-lg shadow-lg max-w-md ${notification.type === 'success'
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}>
                        <div className={`flex-shrink-0 ${notification.type === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {notification.type === 'success' ? (
                                <FiCheck size={24} />
                            ) : (
                                <FiX size={24} />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className={`font-medium ${notification.type === 'success' ? 'text-green-900' : 'text-red-900'
                                }`}>
                                {notification.type === 'success' ? '¡Producto agregado!' : 'Error'}
                            </p>
                            <p className={`text-sm mt-1 ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                                }`}>
                                {notification.message}
                            </p>
                        </div>
                        <button
                            onClick={() => setNotification(null)}
                            className={`flex-shrink-0 ${notification.type === 'success' ? 'text-green-600' : 'text-red-600'
                                } hover:opacity-70`}
                        >
                            <FiX size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Category */}
            <p className="text-sm text-accent uppercase tracking-wide mb-2">
                {product.categoria?.nombre || 'Sin categoría'}
            </p>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                {product.nombre}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
                {product.descuento?.activo ? (
                    <>
                        <span className="text-2xl font-bold">S/ {precio.toFixed(2)}</span>
                        <span className="text-xl text-accent line-through">
                            S/ {product.precio.toFixed(2)}
                        </span>
                        <span className="bg-red-600 text-white px-2 py-1 text-xs uppercase">
                            -{product.descuento.porcentaje}%
                        </span>
                    </>
                ) : (
                    <span className="text-2xl font-bold">S/ {product.precio.toFixed(2)}</span>
                )}
            </div>

            {/* Short Description */}
            <p className="text-accent mb-8 leading-relaxed">
                {product.descripcionCorta}
            </p>

            {/* Size Selector */}
            {sizes.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <label className="font-medium">Talla: {selectedSize || '-'}</label>
                        <button className="text-sm text-accent hover:text-primary">
                            Guía de tallas
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => {
                            const isAvailable = product.variantes?.some(
                                v => v.talla === size && v.stock > 0
                            )
                            return (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    disabled={!isAvailable}
                                    className={`px-6 py-3 border-2 text-sm font-medium transition-colors ${selectedSize === size
                                            ? 'border-primary bg-primary text-white'
                                            : isAvailable
                                                ? 'border-gray-300 hover:border-primary'
                                                : 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                                        }`}
                                >
                                    {size}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Color Selector */}
            {colors.length > 0 && (
                <div className="mb-6">
                    <label className="font-medium mb-3 block">
                        Color: {colors.find(c => c.codigoHex === selectedColor)?.nombre || '-'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => {
                            const isAvailable = product.variantes?.some(
                                v => v.color.codigoHex === color.codigoHex && v.stock > 0
                            )
                            return (
                                <button
                                    key={color.codigoHex}
                                    onClick={() => setSelectedColor(color.codigoHex)}
                                    disabled={!isAvailable}
                                    className={`w-12 h-12 rounded-full border-2 transition-all relative ${selectedColor === color.codigoHex
                                            ? 'border-primary scale-110'
                                            : 'border-gray-300'
                                        } ${!isAvailable ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'}`}
                                    style={{ backgroundColor: color.codigoHex }}
                                    title={color.nombre}
                                >
                                    {!isAvailable && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-full h-0.5 bg-gray-400 rotate-45"></div>
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Stock Info */}
            {currentVariant && (
                <div className="mb-4">
                    {currentVariant.stock > 0 ? (
                        <p className="text-sm text-green-600">
                            ✓ {currentVariant.stock} {currentVariant.stock === 1 ? 'unidad' : 'unidades'} disponibles
                        </p>
                    ) : (
                        <p className="text-sm text-red-600">
                            ✗ Sin stock disponible
                        </p>
                    )}
                </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
                <label className="font-medium mb-3 block">Cantidad</label>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 border border-gray-300 hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity <= 1}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                            const val = Math.max(1, parseInt(e.target.value) || 1)
                            setQuantity(currentVariant ? Math.min(val, currentVariant.stock) : val)
                        }}
                        max={currentVariant?.stock || 999}
                        className="w-16 h-10 text-center border border-gray-300 focus:outline-none focus:border-primary"
                    />
                    <button
                        onClick={() => setQuantity(
                            currentVariant
                                ? Math.min(quantity + 1, currentVariant.stock)
                                : quantity + 1
                        )}
                        className="w-10 h-10 border border-gray-300 hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentVariant && quantity >= currentVariant.stock}
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
                <button
                    onClick={handleAddToCart}
                    disabled={!currentVariant || currentVariant.stock === 0}
                    className="btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {currentVariant && currentVariant.stock > 0
                        ? 'Agregar al Carrito'
                        : 'Sin Stock'}
                </button>
                <button className="w-full py-4 border-2 border-primary hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2">
                    <FiHeart />
                    Agregar a Favoritos
                </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-200 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                    <span className="font-medium">SKU:</span>
                    <span className="text-accent">{currentVariant?.sku || product.sku || 'N/A'}</span>
                </div>
                {product.marca && (
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Marca:</span>
                        <span className="text-accent">{product.marca}</span>
                    </div>
                )}
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}