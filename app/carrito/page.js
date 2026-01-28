'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FiTrash2, FiShoppingBag, FiTruck, FiPackage, FiArrowLeft, FiShield } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart()

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container-custom py-20">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiShoppingBag size={48} className="text-gray-400" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Tu carrito está vacío
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Descubre nuestros productos y agrega tus favoritos al carrito
                        </p>
                        <Link
                            href="/productos"
                            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                        >
                            <FiShoppingBag size={20} />
                            Explorar Productos
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container-custom py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link
                        href="/productos"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <FiArrowLeft size={20} />
                        <span className="font-medium">Continuar comprando</span>
                    </Link>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Carrito de Compras
                    </h1>
                    <p className="text-gray-600">
                        {getCartCount()} {getCartCount() === 1 ? 'artículo' : 'artículos'} en tu carrito
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item, index) => {
                            const precio = item.product.descuento?.activo
                                ? item.product.precio * (1 - item.product.descuento.porcentaje / 100)
                                : item.product.precio

                            return (
                                <div
                                    key={`${item.product._id}-${item.variant._id}-${index}`}
                                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex gap-6">
                                        {/* Image */}
                                        <Link
                                            href={`/producto/${item.product._id}`}
                                            className="relative w-32 h-40 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden group"
                                        >
                                            <Image
                                                src={item.product.imagenesPrincipales?.[0]?.url || '/placeholder.jpg'}
                                                alt={item.product.nombre}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {item.product.descuento?.activo && (
                                                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                                                    -{item.product.descuento.porcentaje}%
                                                </div>
                                            )}
                                        </Link>

                                        {/* Info */}
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex-1">
                                                <Link
                                                    href={`/producto/${item.product._id}`}
                                                    className="hover:text-gray-700 transition-colors"
                                                >
                                                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                                                        {item.product.nombre}
                                                    </h3>
                                                </Link>

                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-medium">
                                                        Talla: {item.variant.talla}
                                                    </span>
                                                    <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-medium flex items-center gap-2">
                                                        <span
                                                            className="w-4 h-4 rounded-full border-2 border-gray-300"
                                                            style={{ backgroundColor: item.variant.color.codigoHex }}
                                                        ></span>
                                                        {item.variant.color.nombre}
                                                    </span>
                                                </div>

                                                {/* Price and Quantity */}
                                                <div className="flex items-center justify-between">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.product._id,
                                                                    item.variant._id,
                                                                    item.quantity - 1
                                                                )
                                                            }
                                                            className="w-9 h-9 bg-white hover:bg-gray-200 rounded-md transition-colors font-bold text-lg flex items-center justify-center"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-12 text-center font-semibold">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.product._id,
                                                                    item.variant._id,
                                                                    item.quantity + 1
                                                                )
                                                            }
                                                            className="w-9 h-9 bg-white hover:bg-gray-200 rounded-md transition-colors font-bold text-lg flex items-center justify-center"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-right">
                                                        {item.product.descuento?.activo && (
                                                            <p className="text-sm text-gray-500 line-through">
                                                                S/ {(item.product.precio * item.quantity).toFixed(2)}
                                                            </p>
                                                        )}
                                                        <p className="font-bold text-xl text-gray-900">
                                                            S/ {(precio * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeFromCart(item.product._id, item.variant._id)}
                                                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-medium text-sm mt-4"
                                            >
                                                <FiTrash2 size={16} />
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Resumen del Pedido
                            </h2>

                            {/* Free Shipping Progress */}
                            {getCartTotal() < 150 ? (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <FiTruck className="text-blue-600" size={20} />
                                            <span className="text-sm font-semibold text-blue-900">
                                                Envío gratis desde S/ 150
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((getCartTotal() / 150) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-blue-700">
                                        Te faltan S/ {(150 - getCartTotal()).toFixed(2)} para envío gratis
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FiTruck className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-green-900">¡Envío gratis!</p>
                                        <p className="text-xs text-green-700">Tu pedido califica para envío sin costo</p>
                                    </div>
                                </div>
                            )}

                            {/* Summary */}
                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal ({getCartCount()} {getCartCount() === 1 ? 'artículo' : 'artículos'})</span>
                                    <span className="font-semibold">S/ {getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Envío</span>
                                    <span className="font-semibold">
                                        {getCartTotal() >= 150 ? (
                                            <span className="text-green-600">Gratis</span>
                                        ) : (
                                            'S/ 10.00'
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-gray-900">
                                    S/ {(getCartTotal() + (getCartTotal() >= 150 ? 0 : 10)).toFixed(2)}
                                </span>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3">
                                <Link
                                    href="/checkout"
                                    className="block w-full bg-black text-white text-center px-6 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                                >
                                    Proceder al Pago
                                </Link>

                                <Link
                                    href="/productos"
                                    className="block w-full border-2 border-gray-300 text-gray-900 text-center px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Seguir Comprando
                                </Link>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <FiShield size={18} className="text-green-600" />
                                    <span>Compra 100% segura</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <FiTruck size={18} className="text-blue-600" />
                                    <span>Envío en 2-3 días hábiles</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <FiPackage size={18} className="text-purple-600" />
                                    <span>Devoluciones gratis 30 días</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}