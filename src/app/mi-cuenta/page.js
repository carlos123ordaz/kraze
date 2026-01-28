'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { FiUser, FiShoppingBag, FiMapPin, FiEdit, FiPlus, FiLogOut, FiPackage, FiClock, FiCheckCircle, FiTrendingUp, FiChevronRight } from 'react-icons/fi'
import axios from 'axios'
import Link from 'next/link'
import { API_URL } from '../config'

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

    const estadoConfig = {
        'pendiente_pago': { label: 'Pendiente de Pago', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: FiClock },
        'confirmado': { label: 'Confirmado', color: 'text-green-600', bg: 'bg-green-50', icon: FiCheckCircle },
        'procesando': { label: 'Procesando', color: 'text-blue-600', bg: 'bg-blue-50', icon: FiPackage },
        'enviado': { label: 'Enviado', color: 'text-purple-600', bg: 'bg-purple-50', icon: FiTrendingUp },
        'en_transito': { label: 'En Tránsito', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: FiTrendingUp },
        'en_reparto': { label: 'En Reparto', color: 'text-orange-600', bg: 'bg-orange-50', icon: FiTrendingUp },
        'entregado': { label: 'Entregado', color: 'text-green-700', bg: 'bg-green-100', icon: FiCheckCircle },
        'cancelado': { label: 'Cancelado', color: 'text-red-600', bg: 'bg-red-50', icon: FiClock }
    }

    const handleLogout = () => {
        if (confirm('¿Estás seguro de cerrar sesión?')) {
            logout()
            router.push('/')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent mb-4"></div>
                    <p className="text-gray-600">Cargando tu cuenta...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    // Calcular estadísticas
    const totalGastado = ordenes.reduce((sum, orden) => sum + (orden.montos?.total || 0), 0)
    const ordenesEntregadas = ordenes.filter(o => o.estado === 'entregado').length
    const ordenesPendientes = ordenes.filter(o => ['pendiente_pago', 'confirmado', 'procesando'].includes(o.estado)).length

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container-custom py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        ¡Hola, {user.nombres}! 👋
                    </h1>
                    <p className="text-gray-600">Gestiona tu cuenta y revisa tus pedidos</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <FiShoppingBag className="text-blue-600" size={24} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{ordenes.length}</p>
                        <p className="text-sm text-gray-600">Total Órdenes</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <FiCheckCircle className="text-green-600" size={24} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{ordenesEntregadas}</p>
                        <p className="text-sm text-gray-600">Entregadas</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <FiClock className="text-orange-600" size={24} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{ordenesPendientes}</p>
                        <p className="text-sm text-gray-600">Pendientes</p>
                    </div>

                    <div className="bg-gradient-to-br from-black to-gray-800 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <FiTrendingUp className="text-white" size={24} />
                        </div>
                        <p className="text-2xl font-bold text-white">S/ {totalGastado.toFixed(0)}</p>
                        <p className="text-sm text-gray-300">Total Gastado</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Información Personal */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                    <FiUser className="text-white" size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Mi Perfil</h2>
                            </div>
                            <button
                                onClick={() => router.push('/mi-cuenta/editar')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Editar perfil"
                            >
                                <FiEdit className="text-gray-600" size={20} />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="text-xs text-gray-600 mb-1">Nombre completo</p>
                                <p className="font-semibold text-gray-900">{user.nombres} {user.apellidos}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 mb-1">Correo electrónico</p>
                                <p className="font-medium text-gray-900 text-sm">{user.email}</p>
                            </div>
                            {user.telefono && (
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">Teléfono</p>
                                    <p className="font-medium text-gray-900">{user.telefono}</p>
                                </div>
                            )}
                            {user.dni && (
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">DNI</p>
                                    <p className="font-medium text-gray-900">{user.dni}</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <FiLogOut size={20} />
                            Cerrar Sesión
                        </button>
                    </div>

                    {/* Direcciones */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                    <FiMapPin className="text-white" size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Direcciones</h2>
                            </div>
                            <button
                                onClick={() => router.push('/mi-cuenta/direcciones')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Gestionar direcciones"
                            >
                                {user.direcciones?.length > 0 ? (
                                    <FiEdit className="text-gray-600" size={20} />
                                ) : (
                                    <FiPlus className="text-gray-600" size={20} />
                                )}
                            </button>
                        </div>

                        {user.direcciones?.length > 0 ? (
                            <div className="space-y-3">
                                {user.direcciones.slice(0, 2).map((dir, index) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex items-start gap-3 mb-2">
                                            <span className="text-xl">
                                                {dir.label === 'casa' ? '🏠' :
                                                    dir.label === 'trabajo' ? '💼' : '📍'}
                                            </span>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900 capitalize text-sm mb-1">
                                                    {dir.label}
                                                </p>
                                                <p className="text-xs text-gray-700">{dir.direccion}</p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {dir.distrito}, {dir.provincia}
                                                </p>
                                            </div>
                                        </div>
                                        {dir.isDefault && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                Predeterminada
                                            </span>
                                        )}
                                    </div>
                                ))}
                                {user.direcciones.length > 2 && (
                                    <button
                                        onClick={() => router.push('/mi-cuenta/direcciones')}
                                        className="w-full text-sm text-gray-900 font-medium hover:underline flex items-center justify-center gap-2 py-2"
                                    >
                                        Ver todas ({user.direcciones.length})
                                        <FiChevronRight size={16} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiMapPin size={24} className="text-gray-400" />
                                </div>
                                <p className="text-gray-600 text-sm mb-4">Sin direcciones guardadas</p>
                                <button
                                    onClick={() => router.push('/mi-cuenta/direcciones')}
                                    className="text-sm text-black font-semibold hover:underline"
                                >
                                    Agregar dirección
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                                <FiShoppingBag className="text-white" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Acciones Rápidas</h2>
                        </div>

                        <div className="space-y-3">
                            <Link
                                href="/productos"
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                            >
                                <span className="font-medium text-gray-900">Explorar Productos</span>
                                <FiChevronRight className="text-gray-400 group-hover:text-gray-900 transition-colors" size={20} />
                            </Link>
                            <Link
                                href="/ofertas"
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                            >
                                <span className="font-medium text-gray-900">Ver Ofertas</span>
                                <FiChevronRight className="text-gray-400 group-hover:text-gray-900 transition-colors" size={20} />
                            </Link>
                            <button
                                onClick={() => router.push('/mi-cuenta/editar')}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group w-full text-left"
                            >
                                <span className="font-medium text-gray-900">Editar Perfil</span>
                                <FiChevronRight className="text-gray-400 group-hover:text-gray-900 transition-colors" size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Órdenes Recientes */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Mis Pedidos</h2>
                        {ordenes.length > 3 && (
                            <Link href="/mis-pedidos" className="text-sm font-semibold text-gray-900 hover:underline flex items-center gap-1">
                                Ver todos
                                <FiChevronRight size={16} />
                            </Link>
                        )}
                    </div>

                    {loadingOrdenes ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent mb-4"></div>
                                <p className="text-gray-600">Cargando pedidos...</p>
                            </div>
                        </div>
                    ) : ordenes.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiShoppingBag size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sin pedidos todavía</h3>
                            <p className="text-gray-600 mb-6">Comienza a explorar nuestros productos</p>
                            <button
                                onClick={() => router.push('/productos')}
                                className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                            >
                                Ir a Comprar
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {ordenes.slice(0, 5).map((orden) => {
                                const config = estadoConfig[orden.estado] || estadoConfig['procesando']
                                const Icon = config.icon

                                return (
                                    <div
                                        key={orden._id}
                                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <p className="font-bold text-lg text-gray-900">{orden.numeroOrden}</p>
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
                                                        <Icon size={14} />
                                                        {config.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    {new Date(orden.createdAt).toLocaleDateString('es-PE', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>

                                                {/* Items Preview */}
                                                <div className="flex flex-wrap gap-2">
                                                    {orden.items?.slice(0, 3).map((item, index) => (
                                                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                                            {item.nombre} × {item.cantidad}
                                                        </span>
                                                    ))}
                                                    {orden.items?.length > 3 && (
                                                        <span className="text-xs text-gray-600 px-3 py-1">
                                                            +{orden.items.length - 3} más
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600 mb-1">Total</p>
                                                    <p className="font-bold text-xl text-gray-900">
                                                        S/ {(orden.montos?.total || 0).toFixed(2)}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => router.push(`/orden-confirmada/${orden._id}`)}
                                                    className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap flex items-center gap-2 group-hover:scale-105"
                                                >
                                                    Ver Detalles
                                                    <FiChevronRight size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}