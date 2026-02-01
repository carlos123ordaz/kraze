'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiCheckCircle, FiPackage, FiMail } from 'react-icons/fi'
import axios from 'axios'
import { API_URL } from '@/app/config'

export default function OrdenConfirmadaPage() {
    const params = useParams()
    const router = useRouter()
    const [orden, setOrden] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (params.id) {
            fetchOrden()
        }
    }, [params.id])

    const fetchOrden = async () => {
        try {
            const token = localStorage.getItem('token')
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            const { data } = await axios.get(`${API_URL}/orders/id/${params.id}`, { headers })
            setOrden(data.orden)
        } catch (error) {
            console.error('Error al cargar orden:', error)
            setError(error.response?.data?.mensaje || 'Error al cargar la orden')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Cargando orden...</p>
                </div>
            </div>
        )
    }

    if (error || !orden) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'Orden no encontrada'}</p>
                    <Link href="/" className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800">
                        Ir al Inicio
                    </Link>
                </div>
            </div>
        )
    }

    // Mapear nombres de métodos de pago
    const metodoPagoNombres = {
        'yape': 'Yape/Plin',
        'contra_entrega': 'Separar con 10 Soles',
        'transferencia': 'Depósito Bancario',
        'mercado_pago': 'Mercado Pago'
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <Link href="/" className="text-2xl font-bold text-gray-900 tracking-wide">
                        KRAZE
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
                <div className="lg:flex lg:gap-12">
                    {/* Columna Izquierda - Información Principal */}
                    <div className="lg:w-1/2 mb-8 lg:mb-0">
                        {/* Confirmación */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                    <FiCheckCircle className="text-white" size={28} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Confirmación N°{orden.numeroOrden}</p>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        ¡Gracias, {orden.cliente.nombres}!
                                    </h1>
                                </div>
                            </div>
                        </div>

                        {/* Estado del Pedido */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                            <h2 className="font-semibold text-gray-900 mb-4">Tu pedido está confirmado</h2>

                            {/* Instrucciones de Pago según el método */}
                            {orden.metodoPago.tipo === 'yape' && (
                                <div className="space-y-3 text-sm text-gray-700">
                                    <p className="flex items-start gap-2">
                                        <span className="text-green-600 mt-0.5">✓</span>
                                        <span>Yape/Plin: 938 717 041</span>
                                    </p>
                                    <p className="mt-4 font-medium text-gray-900">
                                        {orden.cliente.nombres} {orden.cliente.apellidos}
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">
                                        Una vez realizado el pago es necesario que tomes una captura de pantalla y
                                        la envíes al siguiente número:
                                    </p>
                                    <p className="font-semibold text-gray-900 text-base">991 858 888</p>
                                    <p className="text-gray-600">Con tu número de orden.</p>
                                </div>
                            )}

                            {orden.metodoPago.tipo === 'transferencia' && (
                                <div className="space-y-3 text-sm text-gray-700">
                                    <p className="flex items-start gap-2">
                                        <span className="text-green-600 mt-0.5">✓</span>
                                        <span>BCP 193-26979632-0-51</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="text-green-600 mt-0.5">✓</span>
                                        <span>BBVA 0011-0814-0226510287</span>
                                    </p>
                                    <p className="mt-4 font-medium text-gray-900">
                                        {orden.cliente.nombres} {orden.cliente.apellidos}
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">
                                        Una vez realizada la transferencia, envía el comprobante por WhatsApp al:
                                    </p>
                                    <p className="font-semibold text-gray-900 text-base">938 717 041</p>
                                    <p className="text-gray-600">Con tu número de orden: {orden.numeroOrden}</p>
                                </div>
                            )}

                            {orden.metodoPago.tipo === 'contra_entrega' && (
                                <div className="space-y-3 text-sm text-gray-700">
                                    <p className="text-gray-600 leading-relaxed">
                                        Has elegido el método de pago <span className="font-medium text-gray-900">contraentrega</span>.
                                        El pago se realizará al momento de recibir tu pedido.
                                    </p>

                                    <p className="flex items-start gap-2">
                                        <span className="text-green-600 mt-0.5">✓</span>
                                        <span>Paga en efectivo o por el medio acordado al recibir el producto.</span>
                                    </p>

                                    <p className="flex items-start gap-2">
                                        <span className="text-green-600 mt-0.5">✓</span>
                                        <span>El repartidor se comunicará contigo antes de la entrega.</span>
                                    </p>

                                    <p className="mt-4 font-medium text-gray-900">
                                        {orden.cliente.nombres} {orden.cliente.apellidos}
                                    </p>

                                    <p className="text-gray-600">
                                        Número de orden: <span className="font-medium text-gray-900">{orden.numeroOrden}</span>
                                    </p>

                                    <p className="text-amber-700 font-medium mt-3">
                                        Asegúrate de contar con el monto exacto al momento de la entrega.
                                    </p>
                                </div>
                            )}


                            {orden.metodoPago.tipo === 'mercado_pago' && (
                                <div className="space-y-3 text-sm text-gray-700">
                                    <p className="text-green-600 font-medium">
                                        Tu pago ha sido procesado correctamente.
                                    </p>
                                    <p className="text-gray-600">
                                        Recibirás un correo de confirmación con los detalles de tu pedido.
                                    </p>
                                </div>
                            )}

                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <label className="flex items-start gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" className="mt-0.5 rounded border-gray-300" />
                                    <span className="text-gray-700">Enviarme novedades y ofertas por correo electrónico</span>
                                </label>
                            </div>
                        </div>

                        {/* Detalles del pedido */}
                        <div className="border-t border-gray-200 pt-6">
                            <h2 className="font-semibold text-gray-900 mb-4">Detalles del pedido</h2>

                            <div className="space-y-6">
                                {/* Información de contacto */}
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 mb-2">Información de contacto</h3>
                                        <p className="text-sm text-gray-600">{orden.cliente.email}</p>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 mb-2">Métodos de pago</h3>
                                        <p className="text-sm text-gray-600">
                                            {metodoPagoNombres[orden.metodoPago.tipo] || orden.metodoPago.tipo} - <span className="font-semibold">S/ {orden.montos.total.toFixed(2)} PEN</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Dirección de envío */}
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 mb-2">Dirección de envío</h3>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p>{orden.cliente.nombres} {orden.cliente.apellidos}</p>
                                            <p>{orden.cliente.dni}</p>
                                            <p>{orden.direccionEnvio.direccion}</p>
                                            {orden.direccionEnvio.referencia && (
                                                <p>{orden.direccionEnvio.referencia}</p>
                                            )}
                                            <p>Av. Lima 1161</p>
                                            <p>{orden.direccionEnvio.distrito} {orden.direccionEnvio.provincia}</p>
                                            <p>{orden.direccionEnvio.departamento}</p>
                                            <p>Perú</p>
                                            <p>{orden.cliente.telefono}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 mb-2">Dirección de facturación</h3>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p>{orden.cliente.nombres} {orden.cliente.apellidos}</p>
                                            <p>{orden.cliente.dni}</p>
                                            <p>{orden.direccionEnvio.direccion}</p>
                                            {orden.direccionEnvio.referencia && (
                                                <p>{orden.direccionEnvio.referencia}</p>
                                            )}
                                            <p>Av. Lima 1161</p>
                                            <p>{orden.direccionEnvio.distrito} {orden.direccionEnvio.provincia}</p>
                                            <p>{orden.direccionEnvio.departamento}</p>
                                            <p>Perú</p>
                                            <p>{orden.cliente.telefono}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Método de envío */}
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Método de envío</h3>
                                    <p className="text-sm text-gray-600">
                                        {orden.envio.zona === 'lima' ? 'LIMA' : 'PROVINCIA'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha - Resumen del Pedido */}
                    <div className="lg:w-1/2">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-4">
                            {/* Productos */}
                            <div className="space-y-4 mb-6">
                                {orden.items.map((item, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-16 h-16 bg-gray-200 rounded border border-gray-300 overflow-hidden">
                                                {item.imagen && (
                                                    <img
                                                        src={item.imagen}
                                                        alt={item.nombre}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                                {item.cantidad}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900 font-medium">
                                                {item.nombre}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {item.talla}
                                            </p>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            S/ {item.precioTotal.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totales */}
                            <div className="border-t border-gray-200 pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">S/ {orden.montos.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Envío</span>
                                    <span className="text-gray-900">
                                        {orden.montos.costoEnvio === 0 ? 'Gratis' : `S/ ${orden.montos.costoEnvio.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-base font-semibold pt-3 border-t border-gray-200">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-gray-900">
                                        <span className="text-xs font-normal text-gray-600 mr-1">PEN</span>
                                        S/ {orden.montos.total.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="mt-6 space-y-3">
                            <Link
                                href="/productos"
                                className="block w-full bg-black text-white text-center py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
                            >
                                Seguir Comprando
                            </Link>
                            <Link
                                href="/"
                                className="block w-full bg-white text-black border-2 border-black text-center py-3 rounded-md hover:bg-gray-50 transition-colors font-medium"
                            >
                                Ir al Inicio
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer simple */}
            <div className="border-t mt-12">
                <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
                    <p>Todos los derechos reservados KRAZE</p>
                </div>
            </div>
        </div>
    )
}