'use client'

import { useState, useEffect } from 'react'
import { FiCheck, FiX, FiTruck, FiRefreshCw, FiShoppingCart, FiZap } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useRouter } from 'next/navigation'

export default function ProductInfo({ product }) {
    const { addToCart, addToCartSilent } = useCart()
    const router = useRouter()
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [notification, setNotification] = useState(null)
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [isBuyingNow, setIsBuyingNow] = useState(false)

    // Obtener tallas únicas
    const sizes = [...new Set(product.variantes?.map(v => v.talla) || [])]

    // Obtener colores únicos
    const colors = [...new Map(
        product.variantes?.map(v => [v.color.codigoHex, v.color]) || []
    ).values()]

    // Seleccionar automáticamente la primera talla y color disponibles
    useEffect(() => {
        if (product.variantes && product.variantes.length > 0) {
            const firstAvailable = product.variantes.find(v => v.stock > 0)

            if (firstAvailable) {
                setSelectedSize(firstAvailable.talla)
                setSelectedColor(firstAvailable.color.codigoHex)
            } else if (sizes.length > 0 && colors.length > 0) {
                setSelectedSize(sizes[0])
                setSelectedColor(colors[0].codigoHex)
            }
        }
    }, [product.variantes])

    // Obtener variante seleccionada actual
    const currentVariant = product.variantes?.find(
        v => v.talla === selectedSize && v.color.codigoHex === selectedColor
    )

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 3500)
    }

    const handleBuyNow = async () => {
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

        setIsBuyingNow(true)

        // Agregar al carrito SIN abrir el sidebar y redirigir al checkout

        addToCartSilent(product, variant, quantity) // ← Usar addToCartSilent
        router.push('/checkout')

    }

    const handleAddToCart = async () => {
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

        setIsAddingToCart(true)

        // Simular pequeño delay para efecto visual
        setTimeout(() => {
            addToCart(product, variant, quantity)
            const colorName = colors.find(c => c.codigoHex === selectedColor)?.nombre || ''
            showNotification(
                `¡Agregado al carrito! ${quantity} ${quantity > 1 ? 'unidades' : 'unidad'}`,
                'success'
            )
            setIsAddingToCart(false)
        }, 300)
    }

    const precio = product.descuento?.activo
        ? product.precio * (1 - product.descuento.porcentaje / 100)
        : product.precio

    return (
        <div className="relative bg-white rounded-2xl p-8 shadow-sm">
            {/* Category & Stock Badge */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600 uppercase tracking-wider font-medium">
                    {product.categoria?.nombre || 'Sin categoría'}
                </span>
                {product.nuevo && (
                    <span className="bg-black text-white text-xs px-3 py-1 rounded-full font-medium">
                        NUEVO
                    </span>
                )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                {product.nombre}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                {product.descuento?.activo ? (
                    <>
                        <span className="text-4xl font-bold text-gray-900">S/ {precio.toFixed(2)}</span>
                        <span className="text-xl text-gray-500 line-through">
                            S/ {product.precio.toFixed(2)}
                        </span>
                        <span className="bg-red-600 text-white px-3 py-1.5 text-sm font-bold rounded-lg">
                            -{product.descuento.porcentaje}% OFF
                        </span>
                    </>
                ) : (
                    <span className="text-4xl font-bold text-gray-900">S/ {product.precio.toFixed(2)}</span>
                )}
            </div>

            {/* Short Description */}
            <p className="text-gray-600 mb-8 leading-relaxed">
                {product.descripcionCorta}
            </p>

            {/* Size Selector */}
            {sizes.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <label className="font-semibold text-gray-900">
                            Talla: <span className="font-normal text-gray-600">{selectedSize || 'Selecciona una talla'}</span>
                        </label>
                        <button className="text-sm text-gray-600 hover:text-gray-900 underline">
                            Guía de tallas
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {sizes.map((size) => {
                            const isAvailable = product.variantes?.some(
                                v => v.talla === size && v.stock > 0
                            )
                            return (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    disabled={!isAvailable}
                                    className={`min-w-[60px] px-5 py-3 border-2 text-sm font-semibold rounded-lg transition-all ${selectedSize === size
                                        ? 'border-black bg-black text-white'
                                        : isAvailable
                                            ? 'border-gray-300 hover:border-black hover:bg-gray-50'
                                            : 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50 line-through'
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
                    <label className="font-semibold text-gray-900 mb-4 block">
                        Color: <span className="font-normal text-gray-600">
                            {colors.find(c => c.codigoHex === selectedColor)?.nombre || 'Selecciona un color'}
                        </span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {colors.map((color) => {
                            const isAvailable = product.variantes?.some(
                                v => v.color.codigoHex === color.codigoHex && v.stock > 0
                            )
                            return (
                                <button
                                    key={color.codigoHex}
                                    onClick={() => setSelectedColor(color.codigoHex)}
                                    disabled={!isAvailable}
                                    className={`w-14 h-14 rounded-full border-3 transition-all relative ${selectedColor === color.codigoHex
                                        ? 'border-black ring-2 ring-black ring-offset-2 scale-110'
                                        : 'border-gray-300 hover:scale-105'
                                        } ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    style={{ backgroundColor: color.codigoHex }}
                                    title={color.nombre}
                                >
                                    {selectedColor === color.codigoHex && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <FiCheck
                                                size={20}
                                                className={`${color.codigoHex.toLowerCase() === '#ffffff' ||
                                                    color.codigoHex.toLowerCase() === '#fff'
                                                    ? 'text-black'
                                                    : 'text-white'
                                                    }`}
                                            />
                                        </div>
                                    )}
                                    {!isAvailable && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-full h-0.5 bg-red-500 rotate-45 rounded"></div>
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
                <div className="mb-6 p-4 rounded-lg bg-gray-50">
                    {currentVariant.stock > 0 ? (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <p className="text-sm font-medium text-gray-900">
                                {currentVariant.stock} {currentVariant.stock === 1 ? 'unidad disponible' : 'unidades disponibles'}
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <p className="text-sm font-medium text-red-600">
                                Sin stock disponible
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
                <label className="font-semibold text-gray-900 mb-4 block">Cantidad</label>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                        disabled={quantity <= 1}
                    >
                        −
                    </button>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                            const val = Math.max(1, parseInt(e.target.value) || 1)
                            setQuantity(currentVariant ? Math.min(val, currentVariant.stock) : val)
                        }}
                        max={currentVariant?.stock || 999}
                        className="w-20 h-12 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black font-semibold text-lg"
                    />
                    <button
                        onClick={() => setQuantity(
                            currentVariant
                                ? Math.min(quantity + 1, currentVariant.stock)
                                : quantity + 1
                        )}
                        className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                        disabled={currentVariant && quantity >= currentVariant.stock}
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Buttons - Comprar Ahora + Agregar al Carrito */}
            <div className="space-y-3 mb-8">
                {/* Botón Comprar Ahora - Principal */}
                <button
                    onClick={handleBuyNow}
                    disabled={!currentVariant || currentVariant.stock === 0 || isBuyingNow}
                    className="w-full py-4 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl"
                >
                    {isBuyingNow ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Procesando...
                        </>
                    ) : currentVariant && currentVariant.stock > 0 ? (
                        <>
                            <FiZap size={20} />
                            Comprar Ahora
                        </>
                    ) : (
                        'Sin Stock'
                    )}
                </button>

                {/* Botón Agregar al Carrito - Secundario */}
                <button
                    onClick={handleAddToCart}
                    disabled={!currentVariant || currentVariant.stock === 0 || isAddingToCart}
                    className="w-full py-4 border-2 border-black text-black rounded-lg font-semibold hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isAddingToCart ? (
                        <>
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            Agregando...
                        </>
                    ) : (
                        <>
                            <FiShoppingCart size={20} />
                            Agregar al Carrito
                        </>
                    )}
                </button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex items-start gap-3">
                    <FiTruck className="text-gray-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                        <p className="font-medium text-gray-900 text-sm">Envío gratis</p>
                        <p className="text-xs text-gray-600">En compras mayores a S/ 150</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <FiRefreshCw className="text-gray-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                        <p className="font-medium text-gray-900 text-sm">Devolución gratis</p>
                        <p className="text-xs text-gray-600">30 días para cambios y devoluciones</p>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-medium text-gray-900">{currentVariant?.sku || product.sku || 'N/A'}</span>
                </div>
                {product.marca && (
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Marca:</span>
                        <span className="font-medium text-gray-900">{product.marca}</span>
                    </div>
                )}
                {product.genero && (
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Género:</span>
                        <span className="font-medium text-gray-900 capitalize">{product.genero}</span>
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