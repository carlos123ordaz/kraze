'use client'

import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiX, FiTrash2 } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'

export default function SideCart({ isOpen, onClose }) {
    const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart()

    if (!isOpen) return null

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Side Cart */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-secondary z-50 shadow-2xl flex flex-col transform transition-transform">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-serif font-bold">Tu Carrito</h2>
                        <p className="text-sm text-accent mt-1">
                            {getCartCount()} {getCartCount() === 1 ? 'artículo' : 'artículos'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-accent hover:text-primary transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-accent mb-4">Tu carrito está vacío</p>
                            <button
                                onClick={onClose}
                                className="text-primary hover:underline text-sm"
                            >
                                Continuar comprando
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
                                        className="flex gap-4 pb-4 border-b border-gray-200"
                                    >
                                        {/* Image */}
                                        <div className="relative w-20 h-28 flex-shrink-0 bg-light-gray rounded">
                                            <Image
                                                src={item.product.imagenesPrincipales?.[0]?.url || '/placeholder.jpg'}
                                                alt={item.product.nombre}
                                                fill
                                                className="object-cover rounded"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-sm mb-1 truncate">
                                                {item.product.nombre}
                                            </h3>
                                            <p className="text-xs text-accent mb-2">
                                                Talla: {item.variant.talla} | Color: {item.variant.color.nombre}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.product._id,
                                                            item.variant._id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    className="w-6 h-6 border border-gray-300 hover:border-primary transition-colors text-xs flex items-center justify-center"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.product._id,
                                                            item.variant._id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    className="w-6 h-6 border border-gray-300 hover:border-primary transition-colors text-xs flex items-center justify-center"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <p className="font-bold text-sm">
                                                    S/ {(precio * item.quantity).toFixed(2)}
                                                </p>
                                                <button
                                                    onClick={() => removeFromCart(item.product._id, item.variant._id)}
                                                    className="text-accent hover:text-red-600 transition-colors"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
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
                    <div className="border-t border-gray-200 p-6 space-y-4">
                        {/* Free Shipping Progress */}
                        {getCartTotal() < 150 && (
                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-accent mb-2">
                                    <span>¡Envío gratis a partir de S/ 150!</span>
                                    <span>S/ {(150 - getCartTotal()).toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all"
                                        style={{ width: `${Math.min((getCartTotal() / 150) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {getCartTotal() >= 150 && (
                            <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                                <p className="text-sm text-green-700 text-center font-medium">
                                    ¡Felicidades! Tienes envío gratis 🎉
                                </p>
                            </div>
                        )}

                        {/* Totals */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-accent">Subtotal</span>
                                <span className="font-medium">S/ {getCartTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-accent">Envío</span>
                                <span className="font-medium">
                                    {getCartTotal() >= 150 ? 'Gratis' : 'S/ 10.00'}
                                </span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 flex justify-between">
                                <span className="font-bold">Total</span>
                                <span className="font-bold text-lg">
                                    S/ {(getCartTotal() + (getCartTotal() >= 150 ? 0 : 10)).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <Link
                            href="/checkout"
                            onClick={onClose}
                            className="btn-primary w-full block text-center py-3 mb-2"
                        >
                            Finalizar Compra
                        </Link>
                        <Link
                            href="/carrito"
                            onClick={onClose}
                            className="btn-secondary w-full block text-center py-3"
                        >
                            Ver Carrito Completo
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}