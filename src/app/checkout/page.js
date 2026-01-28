'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { FiCheck, FiX, FiShoppingBag, FiTruck, FiCreditCard } from 'react-icons/fi'
import axios from 'axios'
import Image from 'next/image'

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

            const subtotal = items.reduce((sum, item) => sum + item.precioTotal, 0)
            const costoEnvio = subtotal >= 150 ? 0 : 10
            const total = subtotal + costoEnvio

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

            const { data } = await axios.post(`${API_URL}/orders`, orderData)
            clearCart()
            router.push(`/orden-confirmada/${data.orden._id}`)
        } catch (error) {
            console.error('Error completo:', error)
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <FiShoppingBag className="text-gray-400" size={40} />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-3">Tu carrito está vacío</h1>
                    <p className="text-gray-600 mb-8">Agrega productos para realizar tu compra</p>
                    <button
                        onClick={() => router.push('/productos')}
                        className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
                    >
                        Ir a Comprar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className={`flex items-start gap-3 p-4 rounded-lg shadow-lg max-w-md ${notification.type === 'success'
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}>
                        <div className={`flex-shrink-0 ${notification.type === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {notification.type === 'success' ? <FiCheck size={24} /> : <FiX size={24} />}
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

            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">Finalizar Compra</h1>
                    <p className="text-gray-600 mt-2">Completa tus datos para procesar tu pedido</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Formulario */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contacto */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                                        1
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900">Contacto</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                name="nombres"
                                                placeholder="Tu nombre"
                                                value={formData.nombres}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Apellidos
                                            </label>
                                            <input
                                                type="text"
                                                name="apellidos"
                                                placeholder="Tus apellidos"
                                                value={formData.apellidos}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="tu@email.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                name="telefono"
                                                placeholder="9XXXXXXXX"
                                                value={formData.telefono}
                                                onChange={handleChange}
                                                required
                                                maxLength="9"
                                                pattern="9[0-9]{8}"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            DNI
                                        </label>
                                        <input
                                            type="text"
                                            name="dni"
                                            placeholder="12345678"
                                            value={formData.dni}
                                            onChange={handleChange}
                                            required
                                            maxLength="8"
                                            pattern="[0-9]{8}"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Entrega */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                                        2
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900">Entrega</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                País / Región
                                            </label>
                                            <select
                                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                                                disabled
                                            >
                                                <option>Perú</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Departamento
                                            </label>
                                            <input
                                                type="text"
                                                name="departamento"
                                                placeholder="Lima"
                                                value={formData.departamento}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Provincia
                                            </label>
                                            <input
                                                type="text"
                                                name="provincia"
                                                placeholder="Lima"
                                                value={formData.provincia}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Distrito
                                        </label>
                                        <input
                                            type="text"
                                            name="distrito"
                                            placeholder="Ej: San Isidro"
                                            value={formData.distrito}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dirección
                                        </label>
                                        <input
                                            type="text"
                                            name="direccion"
                                            placeholder="Calle, número, urbanización"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Referencia (opcional)
                                        </label>
                                        <input
                                            type="text"
                                            name="referencia"
                                            placeholder="Casa azul, al costado del parque"
                                            value={formData.referencia}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            value={formData.telefono}
                                            disabled
                                            className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-50 text-gray-600"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            En caso de que sea necesario llamar para concretar la entrega
                                        </p>
                                    </div>

                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="mt-1 w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-black"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Guardar mi información y consultar más rápidamente la próxima vez
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Métodos de Envío */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <FiTruck size={24} className="text-gray-700" />
                                    <h2 className="text-xl font-semibold text-gray-900">Métodos de envío</h2>
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center justify-between p-4 border-2 border-black bg-blue-50 rounded-md cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="metodoEnvio"
                                                defaultChecked
                                                className="w-4 h-4 text-black focus:ring-black"
                                            />
                                            <span className="font-medium text-gray-900">
                                                {formData.departamento.toLowerCase() === 'lima' ? 'LIMA' : 'PROVINCIA'}
                                            </span>
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            {envio === 0 ? 'GRATIS' : `S/ ${envio.toFixed(2)}`}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Pago */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                                        3
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900">Pago</h2>
                                </div>

                                <p className="text-sm text-gray-600 mb-4">
                                    Todas las transacciones son seguras y están encriptadas.
                                </p>

                                <div className="space-y-3">
                                    <label className={`block p-4 border-2 rounded-md cursor-pointer transition-all ${formData.metodoPago === 'mercado_pago'
                                            ? 'border-black bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="metodoPago"
                                                    value="mercado_pago"
                                                    checked={formData.metodoPago === 'mercado_pago'}
                                                    onChange={handleChange}
                                                    className="w-4 h-4 text-black focus:ring-black"
                                                />
                                                <span className="font-medium text-gray-900">Mercado Pago</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded font-bold">MP</span>
                                                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">VISA</span>
                                                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">MC</span>
                                                <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded">+2</span>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`block p-4 border-2 rounded-md cursor-pointer transition-all ${formData.metodoPago === 'transferencia'
                                            ? 'border-black bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="metodoPago"
                                                value="transferencia"
                                                checked={formData.metodoPago === 'transferencia'}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-black focus:ring-black"
                                            />
                                            <span className="font-medium text-gray-900">Depósito Bancario</span>
                                        </div>
                                    </label>

                                    <label className={`block p-4 border-2 rounded-md cursor-pointer transition-all ${formData.metodoPago === 'yape'
                                            ? 'border-black bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="metodoPago"
                                                value="yape"
                                                checked={formData.metodoPago === 'yape'}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-black focus:ring-black"
                                            />
                                            <span className="font-medium text-gray-900">YAPE</span>
                                        </div>
                                    </label>

                                    <label className={`block border-2 rounded-md cursor-pointer transition-all ${formData.metodoPago === 'contra_entrega'
                                            ? 'border-black bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }`}>
                                        <div className="p-4">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="metodoPago"
                                                    value="contra_entrega"
                                                    checked={formData.metodoPago === 'contra_entrega'}
                                                    onChange={handleChange}
                                                    className="w-4 h-4 text-black focus:ring-black"
                                                />
                                                <span className="font-medium text-gray-900">Separar con 10 Soles</span>
                                            </div>
                                        </div>
                                        {formData.metodoPago === 'contra_entrega' && (
                                            <div className="px-4 pb-4 pt-2 border-t border-gray-200 bg-gray-50">
                                                <p className="text-sm text-gray-700">
                                                    Podrás reservar tus prendas y culminar el pago en un plazo no mayor a 48h como Max
                                                </p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Dirección de Facturación */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Dirección de facturación
                                </h2>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-4 border-2 border-black bg-blue-50 rounded-md cursor-pointer">
                                        <input
                                            type="radio"
                                            name="direccionFacturacion"
                                            defaultChecked
                                            className="w-4 h-4 text-black focus:ring-black"
                                        />
                                        <span className="text-gray-900">La misma dirección de envío</span>
                                    </label>

                                    <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
                                        <input
                                            type="radio"
                                            name="direccionFacturacion"
                                            className="w-4 h-4 text-black focus:ring-black"
                                        />
                                        <span className="text-gray-900">Usar una dirección de facturación distinta</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Resumen del Pedido - Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Resumen del pedido</h2>

                                {/* Items del carrito */}
                                <div className="space-y-4 mb-6">
                                    {cart.map((item, index) => {
                                        const precio = item.product.descuento?.activo
                                            ? item.product.precio * (1 - item.product.descuento.porcentaje / 100)
                                            : item.product.precio

                                        return (
                                            <div key={index} className="flex gap-4">
                                                <div className="relative flex-shrink-0">
                                                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                                                        {item.product.imagenesPrincipales?.[0]?.url && (
                                                            <img
                                                                src={item.product.imagenesPrincipales[0].url}
                                                                alt={item.product.nombre}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {item.product.nombre}
                                                    </p>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Talla: {item.variant.talla} | {item.variant.color.nombre}
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900 mt-1">
                                                        S/ {(precio * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Totales */}
                                <div className="space-y-3 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium text-gray-900">S/ {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Envío</span>
                                        <span className="font-medium text-gray-900">
                                            {envio === 0 ? (
                                                <span className="text-green-600">GRATIS</span>
                                            ) : (
                                                `S/ ${envio.toFixed(2)}`
                                            )}
                                        </span>
                                    </div>

                                    {envio === 0 && (
                                        <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                            <p className="text-xs text-green-700 flex items-center gap-2">
                                                <FiCheck className="flex-shrink-0" />
                                                Envío gratis por compra mayor a S/ 150
                                            </p>
                                        </div>
                                    )}

                                    {envio > 0 && subtotal < 150 && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                            <p className="text-xs text-blue-700">
                                                Agrega S/ {(150 - subtotal).toFixed(2)} más para envío gratis
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-base font-semibold text-gray-900 pt-3 border-t border-gray-200">
                                        <span>Total</span>
                                        <span className="flex items-baseline gap-1">
                                            <span className="text-xs font-normal text-gray-600">PEN</span>
                                            S/ {total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Procesando...
                                        </>
                                    ) : (
                                        'Finalizar el pedido'
                                    )}
                                </button>

                                <p className="text-xs text-center text-gray-500 mt-4">
                                    Al confirmar tu pedido, aceptas nuestros{' '}
                                    <a href="#" className="underline hover:text-gray-700">términos y condiciones</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

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