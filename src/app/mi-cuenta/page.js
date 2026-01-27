'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { FiUser, FiShoppingBag, FiMapPin, FiEdit, FiPlus } from 'react-icons/fi'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function MiCuentaPage() {
    const router = useRouter()
    const { user, logout, loading } = useAuth()
    const [ordenes, setOrdenes] = useState([])
    const [loadingOrdenes, setLoadingOrdenes] = useState(true)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        } else if (user) {
            fetchOrdenes()
        }
    }, [user, loading])

    const fetchOrdenes = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/orders/mis-ordenes`)
            setOrdenes(data.ordenes || [])
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoadingOrdenes(false)
        }
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

    if (loading) {
        return (
            <div className="container-custom py-20 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                <p className="mt-4">Cargando...</p>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="container-custom py-8">
            <h1 className="text-3xl font-serif font-bold mb-8">Mi Cuenta</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Información Personal */}
                <div className="border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <FiUser size={24} />
                            <h2 className="text-xl font-serif font-bold">Información Personal</h2>
                        </div>
                        <button
                            onClick={() => router.push('/mi-cuenta/editar')}
                            className="text-primary hover:text-primary/80"
                            title="Editar perfil"
                        >
                            <FiEdit size={20} />
                        </button>
                    </div>
                    <div className="space-y-2 text-sm">
                        <p><strong>Nombre:</strong> {user.nombres} {user.apellidos}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        {user.telefono && <p><strong>Teléfono:</strong> {user.telefono}</p>}
                        {user.dni && <p><strong>DNI:</strong> {user.dni}</p>}
                    </div>
                    <button
                        onClick={logout}
                        className="btn-secondary w-full mt-6"
                    >
                        Cerrar Sesión
                    </button>
                </div>

                {/* Direcciones */}
                <div className="border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <FiMapPin size={24} />
                            <h2 className="text-xl font-serif font-bold">Direcciones</h2>
                        </div>
                        <button
                            onClick={() => router.push('/mi-cuenta/direcciones')}
                            className="text-primary hover:text-primary/80"
                            title="Gestionar direcciones"
                        >
                            <FiPlus size={20} />
                        </button>
                    </div>
                    {user.direcciones?.length > 0 ? (
                        <div className="space-y-3">
                            {user.direcciones.slice(0, 2).map((dir, index) => (
                                <div key={index} className="text-sm p-3 bg-light-gray rounded">
                                    {dir.label && (
                                        <p className="font-medium capitalize mb-1">
                                            {dir.label === 'casa' ? '🏠 Casa' :
                                                dir.label === 'trabajo' ? '💼 Trabajo' :
                                                    '📍 Otro'}
                                        </p>
                                    )}
                                    <p className="text-accent">{dir.direccion}</p>
                                    <p className="text-accent text-xs">{dir.distrito}, {dir.provincia}</p>
                                    {dir.isDefault && (
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded mt-1 inline-block">
                                            Predeterminada
                                        </span>
                                    )}
                                </div>
                            ))}
                            {user.direcciones.length > 2 && (
                                <button
                                    onClick={() => router.push('/mi-cuenta/direcciones')}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Ver todas ({user.direcciones.length})
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-accent text-sm mb-3">No tienes direcciones guardadas</p>
                            <button
                                onClick={() => router.push('/mi-cuenta/direcciones')}
                                className="text-sm text-primary hover:underline"
                            >
                                Agregar dirección
                            </button>
                        </div>
                    )}
                </div>

                {/* Estadísticas */}
                <div className="border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FiShoppingBag size={24} />
                        <h2 className="text-xl font-serif font-bold">Estadísticas</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-accent">Total de órdenes</span>
                            <span className="font-bold">{ordenes.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-accent">Total gastado</span>
                            <span className="font-bold">
                                S/ {ordenes.reduce((sum, orden) => sum + (orden.montos?.total || 0), 0).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Órdenes Recientes */}
            <div className="mt-12">
                <h2 className="text-2xl font-serif font-bold mb-6">Mis Órdenes</h2>

                {loadingOrdenes ? (
                    <div className="text-center py-12">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                        <p className="mt-4">Cargando órdenes...</p>
                    </div>
                ) : ordenes.length === 0 ? (
                    <div className="text-center py-12 border border-gray-200 rounded-lg">
                        <p className="text-accent mb-4">No tienes órdenes todavía</p>
                        <button
                            onClick={() => router.push('/productos')}
                            className="btn-primary"
                        >
                            Ir a Comprar
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {ordenes.map((orden) => (
                            <div
                                key={orden._id}
                                className="border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <p className="font-bold text-lg mb-1">{orden.numeroOrden}</p>
                                        <p className="text-sm text-accent">
                                            {new Date(orden.createdAt).toLocaleDateString('es-PE', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-sm text-accent mb-1">Estado</p>
                                            <p className={`font-medium ${orden.estado === 'pendiente_pago' ? 'text-yellow-600' :
                                                    orden.estado === 'confirmado' ? 'text-green-600' :
                                                        orden.estado === 'entregado' ? 'text-blue-600' :
                                                            orden.estado === 'cancelado' ? 'text-red-600' :
                                                                'text-primary'
                                                }`}>
                                                {estadoNombres[orden.estado] || orden.estado}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-accent mb-1">Total</p>
                                            <p className="font-bold text-lg">
                                                S/ {(orden.montos?.total || 0).toFixed(2)}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => router.push(`/orden-confirmada/${orden._id}`)}
                                            className="btn-secondary whitespace-nowrap"
                                        >
                                            Ver Detalles
                                        </button>
                                    </div>
                                </div>

                                {/* Items Preview */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-accent mb-2">
                                        {orden.items?.length || 0} {orden.items?.length === 1 ? 'producto' : 'productos'}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {orden.items?.slice(0, 3).map((item, index) => (
                                            <div key={index} className="text-xs bg-light-gray px-3 py-1 rounded">
                                                {item.nombre || 'Producto'} x{item.cantidad}
                                            </div>
                                        ))}
                                        {orden.items?.length > 3 && (
                                            <div className="text-xs text-accent px-3 py-1">
                                                +{orden.items.length - 3} más
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}