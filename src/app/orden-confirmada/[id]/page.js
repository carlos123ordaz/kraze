'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiCheckCircle, FiPackage } from 'react-icons/fi'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

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
            // Obtener token si existe
            const token = localStorage.getItem('token')
            const headers = token ? { Authorization: `Bearer ${token}` } : {}

            const { data } = await axios.get(`${API_URL}/orders/${params.id}`, { headers })
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
            <div className="container-custom py-20 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                <p className="mt-4">Cargando orden...</p>
            </div>
        )
    }

    if (error || !orden) {
        return (
            <div className="container-custom py-20 text-center">
                <p className="text-accent mb-4">{error || 'Orden no encontrada'}</p>
                <Link href="/" className="btn-primary">
                    Ir al Inicio
                </Link>
            </div>
        )
    }

    // Mapear nombres de métodos de pago
    const metodoPagoNombres = {
        'yape': 'Yape',
        'contra_entrega': 'Contra Entrega',
        'transferencia': 'Transferencia Bancaria',
        'mercado_pago': 'Mercado Pago'
    }

    // Mapear estados
    const estadoNombres = {
        'pendiente_pago': 'Pendiente de Pago',
        'confirmado': 'Confirmado',
        'procesando': 'Procesando',
        'enviado': 'Enviado',
        'en_transito': 'En Tránsito',
        'en_reparto': 'En Reparto',
        'entregado': 'Entregado',
        'cancelado': 'Cancelado'
    }

    return (
        <div className="container-custom py-12">
            <div className="max-w-2xl mx-auto">
                {/* Header de Confirmación */}
                <div className="text-center mb-8">
                    <FiCheckCircle className="mx-auto mb-4 text-green-600" size={64} />
                    <h1 className="text-3xl font-serif font-bold mb-2">
                        ¡Pedido Confirmado!
                    </h1>
                    <p className="text-accent">
                        Gracias por tu compra
                    </p>
                </div>

                {/* Número de Orden */}
                <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg mb-6 text-center">
                    <p className="text-sm text-accent mb-2">
                        Tu número de orden es:
                    </p>
                    <p className="text-2xl font-bold text-primary">
                        {orden.numeroOrden}
                    </p>
                </div>

                {/* Detalles del Cliente */}
                <div className="bg-light-gray p-6 rounded-lg mb-6">
                    <h2 className="font-bold mb-4 flex items-center gap-2">
                        <FiPackage />
                        Información del Pedido
                    </h2>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-accent">Cliente:</span>
                            <span className="font-medium">
                                {orden.cliente.nombres} {orden.cliente.apellidos}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-accent">Email:</span>
                            <span>{orden.cliente.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-accent">Teléfono:</span>
                            <span>{orden.cliente.telefono}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-accent">DNI:</span>
                            <span>{orden.cliente.dni}</span>
                        </div>
                    </div>
                </div>

                {/* Dirección de Envío */}
                <div className="bg-light-gray p-6 rounded-lg mb-6">
                    <h2 className="font-bold mb-4">Dirección de Envío</h2>
                    <div className="text-sm space-y-2">
                        <p>{orden.direccionEnvio.direccion}</p>
                        {orden.direccionEnvio.referencia && (
                            <p className="text-accent">Ref: {orden.direccionEnvio.referencia}</p>
                        )}
                        <p>
                            {orden.direccionEnvio.distrito}, {orden.direccionEnvio.provincia}, {orden.direccionEnvio.departamento}
                        </p>
                    </div>
                </div>

                {/* Productos */}
                <div className="bg-light-gray p-6 rounded-lg mb-6">
                    <h2 className="font-bold mb-4">Productos</h2>
                    <div className="space-y-3">
                        {orden.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                <div className="flex-1">
                                    <p className="font-medium">{item.nombre}</p>
                                    <p className="text-xs text-accent">
                                        Talla: {item.talla} | Color: {item.color.nombre}
                                    </p>
                                    <p className="text-xs text-accent">
                                        Cantidad: {item.cantidad}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">S/ {item.precioTotal.toFixed(2)}</p>
                                    <p className="text-xs text-accent">
                                        S/ {item.precioUnitario.toFixed(2)} c/u
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resumen de Pago */}
                <div className="bg-light-gray p-6 rounded-lg mb-6">
                    <h2 className="font-bold mb-4">Resumen de Pago</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-accent">Subtotal:</span>
                            <span>S/ {orden.montos.subtotal.toFixed(2)}</span>
                        </div>
                        {orden.montos.descuentos > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Descuentos:</span>
                                <span>- S/ {orden.montos.descuentos.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-accent">Envío:</span>
                            <span>
                                {orden.montos.costoEnvio === 0
                                    ? 'Gratis'
                                    : `S/ ${orden.montos.costoEnvio.toFixed(2)}`
                                }
                            </span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2 mt-2">
                            <span>Total:</span>
                            <span>S/ {orden.montos.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-300 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-accent">Método de Pago:</span>
                            <span className="font-medium">
                                {metodoPagoNombres[orden.metodoPago.tipo] || orden.metodoPago.tipo}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-accent">Estado:</span>
                            <span className={`font-medium ${orden.estado === 'pendiente_pago' ? 'text-yellow-600' :
                                orden.estado === 'confirmado' ? 'text-green-600' :
                                    'text-primary'
                                }`}>
                                {estadoNombres[orden.estado] || orden.estado}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Instrucciones de Pago según el método */}
                {orden.metodoPago.tipo === 'yape' && orden.metodoPago.estado === 'pendiente' && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-lg mb-6">
                        <h3 className="font-bold mb-3 text-yellow-900">
                            📱 Instrucciones de Pago - Yape
                        </h3>
                        <div className="text-sm space-y-2 text-yellow-900">
                            <p>Por favor realiza el pago Yape al siguiente número:</p>
                            <p className="text-2xl font-bold my-3">904 435 631</p>
                            <p>Monto a pagar: <strong>S/ {orden.montos.total.toFixed(2)}</strong></p>
                            <p className="mt-4 pt-4 border-t border-yellow-300">
                                Una vez realizado el pago, envía el comprobante por WhatsApp al mismo número
                                indicando tu número de orden: <strong>{orden.numeroOrden}</strong>
                            </p>
                        </div>
                    </div>
                )}

                {orden.metodoPago.tipo === 'transferencia' && orden.metodoPago.estado === 'pendiente' && (
                    <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg mb-6">
                        <h3 className="font-bold mb-3 text-blue-900">
                            🏦 Instrucciones de Pago - Transferencia Bancaria
                        </h3>
                        <div className="text-sm space-y-2 text-blue-900">
                            <p className="mb-3">Realiza la transferencia a la siguiente cuenta:</p>
                            <div className="bg-white p-4 rounded border border-blue-200 space-y-1">
                                <p><strong>Banco:</strong> BCP</p>
                                <p><strong>Tipo de Cuenta:</strong> Cuenta Corriente</p>
                                <p><strong>Número de Cuenta:</strong> 191-123456789-0-00</p>
                                <p><strong>CCI:</strong> 002-191-001234567890-00</p>
                                <p><strong>Titular:</strong> Tu Tienda SAC</p>
                                <p className="text-lg font-bold pt-2 border-t border-blue-200">
                                    Monto: S/ {orden.montos.total.toFixed(2)}
                                </p>
                            </div>
                            <p className="mt-4 pt-4 border-t border-blue-300">
                                Envía el comprobante de transferencia por WhatsApp indicando tu número de orden:
                                <strong> {orden.numeroOrden}</strong>
                            </p>
                        </div>
                    </div>
                )}

                {orden.metodoPago.tipo === 'contra_entrega' && (
                    <div className="bg-green-50 border-2 border-green-200 p-6 rounded-lg mb-6">
                        <h3 className="font-bold mb-3 text-green-900">
                            💵 Pago Contra Entrega
                        </h3>
                        <p className="text-sm text-green-900">
                            Pagarás <strong>S/ {orden.montos.total.toFixed(2)}</strong> en efectivo
                            al recibir tu pedido. Asegúrate de tener el monto exacto o cambio.
                        </p>
                    </div>
                )}

                {/* Confirmación por Email */}
                <div className="text-center text-sm text-accent mb-8">
                    <p>
                        Hemos enviado un correo de confirmación a{' '}
                        <strong className="text-primary">{orden.cliente.email}</strong> con los detalles de tu pedido.
                    </p>
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/productos" className="btn-secondary text-center">
                        Seguir Comprando
                    </Link>
                    <Link href="/" className="btn-primary text-center">
                        Ir al Inicio
                    </Link>
                </div>
            </div>
        </div>
    )
}