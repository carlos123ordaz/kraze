'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FiTrash2 } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart()

    if (cart.length === 0) {
        return (
            <div className="container-custom py-20 text-center">
                <h1 className="text-3xl font-serif font-bold mb-4">Tu carrito está vacío</h1>
                <p className="text-accent mb-8">Agrega productos para continuar</p>
                <Link href="/productos" className="btn-primary">
                    Ir a Comprar
                </Link>
            </div>
        )
    }

    return (
        <div className="container-custom py-8">
            <h1 className="text-3xl font-serif font-bold mb-8">Carrito de Compras</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item, index) => {
                        const precio = item.product.descuento?.activo
                            ? item.product.precio * (1 - item.product.descuento.porcentaje / 100)
                            : item.product.precio

                        return (
                            <div
                                key={index}
                                className="flex gap-4 p-4 border border-gray-200 rounded-lg"
                            >
                                {/* Image */}
                                <div className="relative w-24 h-32 flex-shrink-0 bg-light-gray">
                                    <Image
                                        src={item.product.imagenesPrincipales?.[0]?.url || '/placeholder.jpg'}
                                        alt={item.product.nombre}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <h3 className="font-medium mb-1">{item.product.nombre}</h3>
                                    <p className="text-sm text-accent mb-2">
                                        Talla: {item.variant.talla} | Color: {item.variant.color.nombre}
                                    </p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.product._id,
                                                    item.variant._id,
                                                    item.quantity - 1
                                                )
                                            }
                                            className="w-8 h-8 border border-gray-300 hover:border-primary transition-colors text-sm"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.product._id,
                                                    item.variant._id,
                                                    item.quantity + 1
                                                )
                                            }
                                            className="w-8 h-8 border border-gray-300 hover:border-primary transition-colors text-sm"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p className="font-bold">S/ {(precio * item.quantity).toFixed(2)}</p>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFromCart(item.product._id, item.variant._id)}
                                    className="text-accent hover:text-red-600 transition-colors"
                                >
                                    <FiTrash2 size={20} />
                                </button>
                            </div>
                        )
                    })}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="border border-gray-200 rounded-lg p-6 sticky top-24">
                        <h2 className="text-xl font-serif font-bold mb-6">Resumen del Pedido</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-accent">Subtotal</span>
                                <span>S/ {getCartTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-accent">Envío</span>
                                <span>{getCartTotal() >= 150 ? 'Gratis' : 'S/ 10.00'}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>
                                    S/{' '}
                                    {(getCartTotal() + (getCartTotal() >= 150 ? 0 : 10)).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <Link href="/checkout" className="btn-primary w-full block text-center py-4 mb-3">
                            Proceder al Pago
                        </Link>

                        <Link
                            href="/productos"
                            className="btn-secondary w-full block text-center py-4"
                        >
                            Seguir Comprando
                        </Link>

                        {getCartTotal() < 150 && (
                            <p className="text-xs text-accent mt-4 text-center">
                                Agrega S/ {(150 - getCartTotal()).toFixed(2)} más para envío gratis
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}