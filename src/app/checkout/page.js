'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { FiCheck, FiX } from 'react-icons/fi'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function CheckoutPage() {
    const router = useRouter()
    const { cart, getCartTotal, clearCart } = useCart()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState(null)
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        telefono: '',
        dni: '',
        direccion: '',
        referencia: '',
        distrito: '',
        provincia: '',
        departamento: '',
        metodoPago: 'yape',
        notasCliente: '',
    })

    // Autocompletar datos del usuario logeado
    useEffect(() => {
        if (user) {
            setFormData(prev => {
                const newData = {
                    ...prev,
                    nombres: user.nombres || prev.nombres,
                    apellidos: user.apellidos || prev.apellidos,
                    email: user.email || prev.email,
                    telefono: user.telefono || prev.telefono,
                    dni: user.dni || prev.dni,
                }

                // Si tiene direcciones, usar la dirección por defecto
                if (user.direcciones && user.direcciones.length > 0) {
                    const dirDefault = user.direcciones.find(d => d.isDefault) || user.direcciones[0]
                    if (dirDefault) {
                        newData.direccion = dirDefault.direccion || prev.direccion
                        newData.referencia = dirDefault.referencia || prev.referencia
                        newData.distrito = dirDefault.distrito || prev.distrito
                        newData.provincia = dirDefault.provincia || prev.provincia
                        newData.departamento = dirDefault.departamento || prev.departamento
                    }
                }

                return newData
            })
        }
    }, [user])

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 3500)
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const validateForm = () => {
        if (!formData.nombres.trim()) {
            showNotification('El nombre es requerido', 'error')
            return false
        }
        if (!formData.apellidos.trim()) {
            showNotification('Los apellidos son requeridos', 'error')
            return false
        }
        if (!formData.email.trim()) {
            showNotification('El email es requerido', 'error')
            return false
        }
        if (!formData.telefono.trim()) {
            showNotification('El teléfono es requerido', 'error')
            return false
        }
        if (formData.telefono.length !== 9 || !formData.telefono.startsWith('9')) {
            showNotification('El teléfono debe tener 9 dígitos y comenzar con 9', 'error')
            return false
        }
        if (!formData.dni.trim()) {
            showNotification('El DNI es requerido', 'error')
            return false
        }
        if (formData.dni.length !== 8) {
            showNotification('El DNI debe tener 8 dígitos', 'error')
            return false
        }
        if (!formData.direccion.trim()) {
            showNotification('La dirección es requerida', 'error')
            return false
        }
        if (!formData.distrito.trim()) {
            showNotification('El distrito es requerido', 'error')
            return false
        }
        if (!formData.provincia.trim()) {
            showNotification('La provincia es requerida', 'error')
            return false
        }
        if (!formData.departamento.trim()) {
            showNotification('El departamento es requerido', 'error')
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (cart.length === 0) {
            showNotification('Tu carrito está vacío', 'error')
            return
        }

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            // Preparar items del carrito
            const items = cart.map(item => {
                const precio = item.product.descuento?.activo
                    ? item.product.precio * (1 - item.product.descuento.porcentaje / 100)
                    : item.product.precio

                return {
                    producto: item.product._id,
                    variante: item.variant._id,
                    nombre: item.product.nombre,
                    talla: item.variant.talla,
                    color: {
                        nombre: item.variant.color.nombre,
                        codigoHex: item.variant.color.codigoHex
                    },
                    sku: item.variant.sku,
                    imagen: item.product.imagenesPrincipales?.[0]?.url || '',
                    cantidad: item.quantity,
                    precioUnitario: precio,
                    precioTotal: precio * item.quantity
                }
            })

            // Calcular totales
            const subtotal = items.reduce((sum, item) => sum + item.precioTotal, 0)
            const costoEnvio = subtotal >= 150 ? 0 : 10
            const total = subtotal + costoEnvio

            // Estructura de datos para crear orden
            const orderData = {
                cliente: {
                    nombres: formData.nombres.trim(),
                    apellidos: formData.apellidos.trim(),
                    email: formData.email.trim().toLowerCase(),
                    telefono: formData.telefono.trim(),
                    dni: formData.dni.trim()
                },
                direccionEnvio: {
                    direccion: formData.direccion.trim(),
                    referencia: formData.referencia.trim(),
                    distrito: formData.distrito.trim(),
                    provincia: formData.provincia.trim(),
                    departamento: formData.departamento.trim()
                },
                items: items,
                montos: {
                    subtotal: subtotal,
                    descuentos: 0,
                    costoEnvio: costoEnvio,
                    total: total
                },
                metodoPago: {
                    tipo: formData.metodoPago
                },
                envio: {
                    zona: formData.departamento.toLowerCase() === 'lima' ? 'lima' : 'provincia',
                    costo: costoEnvio,
                    tiempoEstimado: formData.departamento.toLowerCase() === 'lima' ? '2-3 días' : '3-5 días'
                },
                notasCliente: formData.notasCliente.trim(),
                usarCarrito: false
            }

            console.log('Enviando orden:', orderData)

            const { data } = await axios.post(`${API_URL}/orders`, orderData)

            console.log('Respuesta:', data)

            clearCart()
            router.push(`/orden-confirmada/${data.orden._id}`)
        } catch (error) {
            console.error('Error completo:', error)
            console.error('Respuesta del servidor:', error.response?.data)
            showNotification(
                error.response?.data?.mensaje || 'Error al procesar la orden. Por favor intenta de nuevo.',
                'error'
            )
        } finally {
            setLoading(false)
        }
    }

    const subtotal = getCartTotal()
    const envio = subtotal >= 150 ? 0 : 10
    const total = subtotal + envio

    if (cart.length === 0) {
        return (
            <div className="container-custom py-20 text-center">
                <h1 className="text-3xl font-serif font-bold mb-4">Tu carrito está vacío</h1>
                <p className="text-accent mb-6">Agrega productos para realizar tu compra</p>
                <button onClick={() => router.push('/productos')} className="btn-primary">
                    Ir a Comprar
                </button>
            </div>
        )
    }

    return (
        <div className="container-custom py-8">
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
                                {notification.type === 'success' ? '¡Éxito!' : 'Error'}
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

            <h1 className="text-3xl font-serif font-bold mb-8">Finalizar Compra</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Información Personal */}
                        <div>
                            <h2 className="text-xl font-serif font-bold mb-4">Información Personal</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="nombres"
                                    placeholder="Nombres *"
                                    value={formData.nombres}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                                />
                                <input
                                    type="text"
                                    name="apellidos"
                                    placeholder="Apellidos *"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email *"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                                />
                                <input
                                    type="tel"
                                    name="telefono"
                                    placeholder="Teléfono (9XXXXXXXX) *"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                    maxLength="9"
                                    pattern="9[0-9]{8}"
                                    className="border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                                />
                                <input
                                    type="text"
                                    name="dni"
                                    placeholder="DNI (8 dígitos) *"
                                    value={formData.dni}
                                    onChange={handleChange}
                                    required
                                    maxLength="8"
                                    pattern="[0-9]{8}"
                                    className="border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>

                        {/* Dirección de Envío */}
                        <div>
                            <h2 className="text-xl font-serif font-bold mb-4">Dirección de Envío</h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="direccion"
                                    placeholder="Dirección completa *"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                                />
                                <input
                                    type="text"
                                    name="referencia"
                                    placeholder="Referencia (ej: Casa azul, al costado del parque)"
                                    value={formData.referencia}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        name="distrito"
                                        placeholder="Distrito *"
                                        value={formData.distrito}
                                        onChange={handleChange}
                                        required
                                        className="border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                                    />
                                    <input
                                        type="text"
                                        name="provincia"
                                        placeholder="Provincia *"
                                        value={formData.provincia}
                                        onChange={handleChange}
                                        required
                                        className="border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                                    />
                                    <input
                                        type="text"
                                        name="departamento"
                                        placeholder="Departamento *"
                                        value={formData.departamento}
                                        onChange={handleChange}
                                        required
                                        className="border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Método de Pago */}
                        <div>
                            <h2 className="text-xl font-serif font-bold mb-4">Método de Pago</h2>
                            <div className="space-y-3">
                                <label className={`flex items-center p-4 border-2 cursor-pointer transition-colors ${formData.metodoPago === 'yape'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-300 hover:border-primary'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="metodoPago"
                                        value="yape"
                                        checked={formData.metodoPago === 'yape'}
                                        onChange={handleChange}
                                        className="mr-3"
                                    />
                                    <span className="font-medium">Yape</span>
                                </label>
                                <label className={`flex items-center p-4 border-2 cursor-pointer transition-colors ${formData.metodoPago === 'contra_entrega'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-300 hover:border-primary'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="metodoPago"
                                        value="contra_entrega"
                                        checked={formData.metodoPago === 'contra_entrega'}
                                        onChange={handleChange}
                                        className="mr-3"
                                    />
                                    <span className="font-medium">Contra Entrega</span>
                                </label>
                                <label className={`flex items-center p-4 border-2 cursor-pointer transition-colors ${formData.metodoPago === 'transferencia'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-300 hover:border-primary'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="metodoPago"
                                        value="transferencia"
                                        checked={formData.metodoPago === 'transferencia'}
                                        onChange={handleChange}
                                        className="mr-3"
                                    />
                                    <span className="font-medium">Transferencia Bancaria</span>
                                </label>
                            </div>
                        </div>

                        {/* Notas */}
                        <div>
                            <h2 className="text-xl font-serif font-bold mb-4">Notas del Pedido (Opcional)</h2>
                            <textarea
                                name="notasCliente"
                                rows="4"
                                placeholder="¿Alguna instrucción especial para tu pedido?"
                                value={formData.notasCliente}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary resize-none"
                            />
                        </div>
                    </div>

                    {/* Resumen */}
                    <div className="lg:col-span-1">
                        <div className="border border-gray-200 p-6 sticky top-24">
                            <h2 className="text-xl font-serif font-bold mb-6">Resumen del Pedido</h2>

                            {/* Items */}
                            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                                {cart.map((item, index) => {
                                    const precio = item.product.descuento?.activo
                                        ? item.product.precio * (1 - item.product.descuento.porcentaje / 100)
                                        : item.product.precio

                                    return (
                                        <div key={index} className="flex justify-between text-sm">
                                            <div className="flex-1">
                                                <p className="font-medium">{item.product.nombre}</p>
                                                <p className="text-xs text-accent">
                                                    Talla: {item.variant.talla} | Color: {item.variant.color.nombre}
                                                </p>
                                                <p className="text-xs text-accent">Cantidad: {item.quantity}</p>
                                            </div>
                                            <span className="font-medium">S/ {(precio * item.quantity).toFixed(2)}</span>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 border-t border-gray-200 pt-4">
                                <div className="flex justify-between">
                                    <span className="text-accent">Subtotal</span>
                                    <span>S/ {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-accent">Envío</span>
                                    <span>{envio === 0 ? 'Gratis' : `S/ ${envio.toFixed(2)}`}</span>
                                </div>
                                {envio === 0 && (
                                    <p className="text-xs text-green-600">
                                        ✓ Envío gratis por compra mayor a S/ 150
                                    </p>
                                )}
                                {envio > 0 && subtotal < 150 && (
                                    <p className="text-xs text-accent">
                                        Agrega S/ {(150 - subtotal).toFixed(2)} más para envío gratis
                                    </p>
                                )}
                                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-3">
                                    <span>Total</span>
                                    <span>S/ {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full mt-6 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Procesando...' : 'Confirmar Pedido'}
                            </button>

                            <p className="text-xs text-center text-accent mt-4">
                                Al confirmar tu pedido, aceptas nuestros términos y condiciones
                            </p>
                        </div>
                    </div>
                </div>
            </form>

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