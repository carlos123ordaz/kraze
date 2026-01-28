'use client'

import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiX, FiTrash2, FiShoppingBag, FiTruck, FiPackage } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'

export default function SideCart({ isOpen, onClose }) {
    const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart()

    if (!isOpen) return null

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
                onClick={onClose}
            />

            {/* Side Cart */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="bg-black text-white px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                            <FiShoppingBag size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Tu Carrito</h2>
                            <p className="text-xs text-gray-300">
                                {getCartCount()} {getCartCount() === 1 ? 'artículo' : 'artículos'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {cart.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiShoppingBag size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tu carrito está vacío</h3>
                            <p className="text-gray-600 mb-6">Agrega productos para comenzar tu compra</p>
                            <button
                                onClick={onClose}
                                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                            >
                                Continuar Comprando
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item, index) => {
                                const precio = item.product.descuento?.activo
                                    ? item.product.precio * (1 - item.product.descuento.porcentaje / 100)
                                    : item.product.precio

                                return (
                                    <div
                                        key={`${item.product._id}-${item.variant._id}-${index}`}
                                        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex gap-4">
                                            {/* Image */}
                                            <div className="relative w-24 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                                <Image
                                                    src={item.product.imagenesPrincipales?.[0]?.url || '/placeholder.jpg'}
                                                    alt={item.product.nombre}
                                                    fill
                                                    className="object-cover"
                                                />
                                                {item.product.descuento?.activo && (
                                                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                                                        -{item.product.descuento.porcentaje}%
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 pr-2">
                                                        {item.product.nombre}
                                                    </h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.product._id, item.variant._id)}
                                                        className="p-1 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                                                        title="Eliminar"
                                                    >
                                                        <FiTrash2 size={16} className="text-red-600" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                        {item.variant.talla}
                                                    </span>
                                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center gap-1">
                                                        <span
                                                            className="w-3 h-3 rounded-full border border-gray-300"
                                                            style={{ backgroundColor: item.variant.color.codigoHex }}
                                                        ></span>
                                                        {item.variant.color.nombre}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.product._id,
                                                                    item.variant._id,
                                                                    item.quantity - 1
                                                                )
                                                            }
                                                            className="w-7 h-7 bg-white hover:bg-gray-200 rounded-md transition-colors text-sm font-bold flex items-center justify-center"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-semibold">
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
                                                            className="w-7 h-7 bg-white hover:bg-gray-200 rounded-md transition-colors text-sm font-bold flex items-center justify-center"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-right">
                                                        {item.product.descuento?.activo && (
                                                            <p className="text-xs text-gray-500 line-through">
                                                                S/ {(item.product.precio * item.quantity).toFixed(2)}
                                                            </p>
                                                        )}
                                                        <p className="font-bold text-gray-900">
                                                            S/ {(precio * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="border-t border-gray-200 bg-white p-6 space-y-4">
                        {/* Free Shipping Progress */}
                        {getCartTotal() < 150 ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <FiTruck className="text-blue-600" size={20} />
                                        <span className="text-sm font-semibold text-blue-900">
                                            Envío gratis desde S/ 150
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-blue-600">
                                        S/ {(150 - getCartTotal()).toFixed(2)}
                                    </span>
                                </div>
                                <div className="w-full bg-blue-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min((getCartTotal() / 150) * 100, 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-blue-700 mt-2">
                                    Te faltan S/ {(150 - getCartTotal()).toFixed(2)} para envío gratis
                                </p>
                            </div>
                        ) : (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FiTruck className="text-white" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-green-900">¡Envío gratis!</p>
                                    <p className="text-xs text-green-700">Tu pedido califica para envío sin costo</p>
                                </div>
                            </div>
                        )}

                        {/* Totals */}
                        <div className="space-y-3 py-4 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold text-gray-900">S/ {getCartTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Envío</span>
                                <span className="font-semibold text-gray-900">
                                    {getCartTotal() >= 150 ? (
                                        <span className="text-green-600">Gratis</span>
                                    ) : (
                                        'S/ 10.00'
                                    )}
                                </span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="font-bold text-2xl text-gray-900">
                                    S/ {(getCartTotal() + (getCartTotal() >= 150 ? 0 : 10)).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3">
                            <Link
                                href="/checkout"
                                onClick={onClose}
                                className="block w-full bg-black text-white text-center px-6 py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                            >
                                Finalizar Compra
                            </Link>
                            <Link
                                href="/carrito"
                                onClick={onClose}
                                className="block w-full border-2 border-black text-black text-center px-6 py-4 rounded-lg font-bold hover:bg-black hover:text-white transition-colors"
                            >
                                Ver Carrito Completo
                            </Link>
                        </div>

                        {/* Trust Badge */}
                        <div className="flex items-center justify-center gap-6 text-xs text-gray-600 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-1">
                                <FiPackage size={14} />
                                <span>Envío seguro</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FiTruck size={14} />
                                <span>2-3 días Lima</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out;
                }
            `}</style>
        </>
    )
}