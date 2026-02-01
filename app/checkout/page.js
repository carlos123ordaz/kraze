'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { FiCheck, FiX, FiShoppingBag, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import axios from 'axios'
import Image from 'next/image'
import { API_URL } from '../config'

export default function CheckoutPage() {
    const router = useRouter()
    const { cart, getCartTotal, clearCart } = useCart()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState(null)
    const [showOrderSummary, setShowOrderSummary] = useState(false)
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        telefono: '',
        dni: '',
        direccion: '',
        referencia: '',
        ciudad: '',
        region: '',
        codigoPostal: '',
        metodoPago: 'mercado_pago',
        metodoEnvio: 'lima',
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
                        newData.ciudad = dirDefault.distrito || prev.ciudad
                        newData.region = dirDefault.departamento || prev.region
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
        if (!formData.dni.trim() || formData.dni.length !== 8) {
            showNotification('El DNI debe tener 8 dígitos', 'error')
            return false
        }
        if (!formData.direccion.trim()) {
            showNotification('La dirección es requerida', 'error')
            return false
        }
        if (!formData.ciudad.trim()) {
            showNotification('La ciudad es requerida', 'error')
            return false
        }
        if (!formData.telefono.trim() || formData.telefono.length !== 9) {
            showNotification('El teléfono debe tener 9 dígitos', 'error')
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
            const costoEnvio = formData.metodoEnvio === 'lima' ? 10 : 15
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
                    distrito: formData.ciudad.trim(),
                    provincia: formData.ciudad.trim(),
                    departamento: formData.region.trim()
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
                    zona: formData.metodoEnvio,
                    costo: costoEnvio,
                    tiempoEstimado: formData.metodoEnvio === 'lima' ? '2-3 días' : '3-5 días'
                },
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
    const envio = formData.metodoEnvio === 'lima' ? 10 : 15
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
        <div className="min-h-screen bg-white flex flex-col">
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

            {/* Header */}
            <div className="border-b">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <Link href="/" className="text-2xl font-bold text-gray-900 tracking-wide">
                        KRAZE
                    </Link>
                </div>
            </div>

            {/* Mobile Order Summary Toggle */}
            <button
                type="button"
                onClick={() => setShowOrderSummary(!showOrderSummary)}
                className="lg:hidden w-full bg-gray-50 border-b border-gray-200 px-4 py-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    {showOrderSummary ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                    <span className="text-sm font-medium text-blue-600">
                        {showOrderSummary ? 'Ocultar' : 'Mostrar'} resumen del pedido
                    </span>
                </div>
                <span className="text-base font-semibold">
                    <span className="text-xs font-normal text-gray-600 mr-1">PEN</span>
                    S/ {total.toFixed(2)}
                </span>
            </button>

            {/* Mobile Order Summary Content */}
            {showOrderSummary && (
                <div className="lg:hidden bg-gray-50 border-b border-gray-200 px-4 py-6">
                    <div className="max-w-md mx-auto space-y-4">
                        {cart.map((item, index) => {
                            const precio = item.product.descuento?.activo
                                ? item.product.precio * (1 - item.product.descuento.porcentaje / 100)
                                : item.product.precio

                            return (
                                <div key={index} className="flex gap-4">
                                    <div className="relative flex-shrink-0">
                                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 overflow-hidden">
                                            {item.product.imagenesPrincipales?.[0]?.url && (
                                                <img
                                                    src={item.product.imagenesPrincipales[0].url}
                                                    alt={item.product.nombre}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 truncate">
                                            {item.product.nombre}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-0.5">
                                            {item.variant.talla}
                                        </p>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        S/ {(precio * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            )
                        })}

                        <div className="border-t border-gray-200 pt-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Subtotal</span>
                                <span className="text-gray-900">S/ {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Envío</span>
                                <span className="text-gray-900">S/ {envio.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-base font-semibold pt-3 border-t border-gray-200">
                                <span className="text-gray-900">Total</span>
                                <span className="text-gray-900">
                                    <span className="text-xs font-normal text-gray-600 mr-1">PEN</span>
                                    S/ {total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col lg:flex-row">
                <form onSubmit={handleSubmit} className="w-full flex flex-col lg:flex-row">
                    {/* Formulario - Lado Izquierdo con fondo blanco */}
                    <div className="w-full lg:w-1/2 bg-white px-4 py-8 flex justify-center lg:justify-end order-2 lg:order-1">
                        <div className="w-full max-w-xl space-y-6">
                            {/* Contacto */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Contacto</h2>
                                    {
                                        !user && (
                                            <button type="button" onClick={() => router.push('/login')} className="text-sm text-blue-600 hover:underline">
                                                Iniciar sesión
                                            </button>
                                        )
                                    }
                                </div>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email o número de teléfono móvil"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />

                                <label className="flex items-center gap-2 mt-3">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                        Enviarme novedades y ofertas por correo electrónico
                                    </span>
                                </label>
                            </div>

                            {/* Entrega */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Entrega</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-gray-700 mb-1">País / Región</label>
                                        <select
                                            className="w-full px-3 py-3 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            disabled
                                        >
                                            <option>Perú</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                name="nombres"
                                                placeholder="Nombre"
                                                value={formData.nombres}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                name="apellidos"
                                                placeholder="Apellidos"
                                                value={formData.apellidos}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            name="dni"
                                            placeholder="DNI"
                                            value={formData.dni}
                                            onChange={handleChange}
                                            required
                                            maxLength="8"
                                            pattern="[0-9]{8}"
                                            className="w-full px-3 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            name="direccion"
                                            placeholder="Dirección"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            name="referencia"
                                            placeholder="Casa, apartamento, etc. (opcional)"
                                            value={formData.referencia}
                                            onChange={handleChange}
                                            className="w-full px-3 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                name="ciudad"
                                                placeholder="Ciudad"
                                                value={formData.ciudad}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <select
                                                name="region"
                                                value={formData.region}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                            >
                                                <option value="">Región</option>
                                                <option value="Amazonas">Amazonas</option>
                                                <option value="Áncash">Áncash</option>
                                                <option value="Apurímac">Apurímac</option>
                                                <option value="Arequipa">Arequipa</option>
                                                <option value="Ayacucho">Ayacucho</option>
                                                <option value="Cajamarca">Cajamarca</option>
                                                <option value="Callao">Callao</option>
                                                <option value="Cusco">Cusco</option>
                                                <option value="Huancavelica">Huancavelica</option>
                                                <option value="Huánuco">Huánuco</option>
                                                <option value="Ica">Ica</option>
                                                <option value="Junín">Junín</option>
                                                <option value="La Libertad">La Libertad</option>
                                                <option value="Lambayeque">Lambayeque</option>
                                                <option value="Lima (Metropolitana)">Lima (Metropolitana)</option>
                                                <option value="Lima (Provincias)">Lima (Provincias)</option>
                                                <option value="Loreto">Loreto</option>
                                                <option value="Madre de Dios">Madre de Dios</option>
                                                <option value="Moquegua">Moquegua</option>
                                                <option value="Pasco">Pasco</option>
                                                <option value="Piura">Piura</option>
                                                <option value="Puno">Puno</option>
                                                <option value="San Martín">San Martín</option>
                                                <option value="Tacna">Tacna</option>
                                                <option value="Tumbes">Tumbes</option>
                                                <option value="Ucayali">Ucayali</option>
                                            </select>

                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                name="codigoPostal"
                                                placeholder="Código postal (opc.)"
                                                value={formData.codigoPostal}
                                                onChange={handleChange}
                                                className="w-full px-3 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            placeholder="Teléfono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            required
                                            maxLength="9"
                                            pattern="9[0-9]{8}"
                                            className="w-full px-3 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            En caso de que sea necesario llamar para concretar la entrega
                                        </p>
                                    </div>

                                    <label className="flex items-start gap-2">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 mt-0.5 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Guardar mi información y consultar más rápidamente la próxima vez
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Métodos de envío */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Métodos de envío</h2>

                                <div className="space-y-3">
                                    <label className={`flex items-center justify-between p-4 border-2 rounded cursor-pointer transition-all ${formData.metodoEnvio === 'lima'
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="metodoEnvio"
                                                value="lima"
                                                checked={formData.metodoEnvio === 'lima'}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium text-gray-900">LIMA</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">S/ 10.00</span>
                                    </label>

                                    <label className={`flex items-center justify-between p-4 border-2 rounded cursor-pointer transition-all ${formData.metodoEnvio === 'provincia'
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="metodoEnvio"
                                                value="provincia"
                                                checked={formData.metodoEnvio === 'provincia'}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium text-gray-900">PROVINCIA</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">S/ 15.00</span>
                                    </label>
                                </div>
                            </div>

                            {/* Pago */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">Pago</h2>
                                <p className="text-xs text-gray-600 mb-4">
                                    Todas las transacciones son seguras y están encriptadas.
                                </p>

                                <div className="space-y-3">
                                    <label className={`block border-2 rounded cursor-pointer transition-all ${formData.metodoPago === 'mercado_pago'
                                        ? 'border-blue-600'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}>
                                        <div className={`p-4 ${formData.metodoPago === 'mercado_pago' ? 'bg-blue-50' : ''}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="metodoPago"
                                                        value="mercado_pago"
                                                        checked={formData.metodoPago === 'mercado_pago'}
                                                        onChange={handleChange}
                                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm font-medium text-gray-900">Mercado Pago</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded font-bold">MP</span>
                                                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">VISA</span>
                                                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">MC</span>
                                                    <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded">+2</span>
                                                </div>
                                            </div>
                                        </div>
                                        {formData.metodoPago === 'mercado_pago' && (
                                            <div className="p-4 bg-gray-50 border-t border-gray-300">
                                                <p className="text-xs text-gray-600">
                                                    Se te redirigirá a Mercado Pago para que completes la compra.
                                                </p>
                                            </div>
                                        )}
                                    </label>

                                    <label className={`flex items-center p-4 border-2 rounded cursor-pointer transition-all ${formData.metodoPago === 'transferencia'
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="metodoPago"
                                            value="transferencia"
                                            checked={formData.metodoPago === 'transferencia'}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 mr-3"
                                        />
                                        <span className="text-sm font-medium text-gray-900">Depósito Bancario</span>
                                    </label>

                                    <label className={`block border-2 rounded cursor-pointer transition-all ${formData.metodoPago === 'yape'
                                        ? 'border-blue-600'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}>
                                        <div className={`p-4 ${formData.metodoPago === 'contra_entrega' ? 'bg-blue-50' : ''}`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="metodoPago"
                                                    value="yape"
                                                    checked={formData.metodoPago === 'yape'}
                                                    onChange={handleChange}
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm font-medium text-gray-900">Yape</span>
                                            </div>
                                        </div>
                                        {formData.metodoPago === 'yape' && (
                                            <div className="p-4 bg-gray-50 border-t border-gray-300">
                                                <p className="text-xs text-gray-600">
                                                    <span>Yape/Plin: 938717041 </span> <br />
                                                    <span>JeanCarlos Sot*</span>
                                                </p>
                                            </div>
                                        )}
                                    </label>
                                    <label className={`block border-2 rounded cursor-pointer transition-all ${formData.metodoPago === 'contra_entrega'
                                        ? 'border-blue-600'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}>
                                        <div className={`p-4 ${formData.metodoPago === 'contra_entrega' ? 'bg-blue-50' : ''}`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="metodoPago"
                                                    value="contra_entrega"
                                                    checked={formData.metodoPago === 'contra_entrega'}
                                                    onChange={handleChange}
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm font-medium text-gray-900">Contra entrega</span>
                                            </div>
                                        </div>
                                        {formData.metodoPago === 'contra_entrega' && (
                                            <div className="p-4 bg-gray-50 border-t border-gray-300">
                                                <p className="text-xs text-gray-600">
                                                    Paga tu pedido al momento de recibirlo. Compra con total confianza y seguridad: solo pagas cuando el producto llegue a tus manos.
                                                </p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Dirección de facturación */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Dirección de facturación</h2>

                                <div className="space-y-3">
                                    <label className="flex items-center p-4 border-2 border-blue-600 bg-blue-50 rounded cursor-pointer">
                                        <input
                                            type="radio"
                                            name="direccionFacturacion"
                                            defaultChecked
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 mr-3"
                                        />
                                        <span className="text-sm text-gray-900">La misma dirección de envío</span>
                                    </label>

                                    <label className="flex items-center p-4 border-2 border-gray-300 rounded cursor-pointer hover:border-gray-400">
                                        <input
                                            type="radio"
                                            name="direccionFacturacion"
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 mr-3"
                                        />
                                        <span className="text-sm text-gray-900">Usar una dirección de facturación distinta</span>
                                    </label>
                                </div>
                            </div>

                            {/* Botón Pagar ahora */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                                    'Pagar ahora'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Resumen del Pedido - Lado Derecho con fondo gris (Hidden on mobile) */}
                    <div className="hidden lg:flex w-full lg:w-1/2 bg-gray-50 px-4 py-8 border-l border-gray-200 justify-start order-1 lg:order-2">
                        <div className="w-full max-w-md">
                            {/* Items del carrito */}
                            <div className="space-y-4 mb-6">
                                {cart.map((item, index) => {
                                    const precio = item.product.descuento?.activo
                                        ? item.product.precio * (1 - item.product.descuento.porcentaje / 100)
                                        : item.product.precio

                                    return (
                                        <div key={index} className="flex gap-4">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 overflow-hidden">
                                                    {item.product.imagenesPrincipales?.[0]?.url && (
                                                        <img
                                                            src={item.product.imagenesPrincipales[0].url}
                                                            alt={item.product.nombre}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900 truncate">
                                                    {item.product.nombre}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-0.5">
                                                    {item.variant.talla}
                                                </p>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                S/ {(precio * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-700">Subtotal</span>
                                    <span className="text-gray-900">S/ {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-700">Envío</span>
                                    <span className="text-gray-900">S/ {envio.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-base font-semibold pt-3 border-t border-gray-200">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-gray-900">
                                        <span className="text-xs font-normal text-gray-600 mr-1">PEN</span>
                                        S/ {total.toFixed(2)}
                                    </span>
                                </div>
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