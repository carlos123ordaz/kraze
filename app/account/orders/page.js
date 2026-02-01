'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { FiUser, FiChevronRight } from 'react-icons/fi'
import axios from 'axios'
import Link from 'next/link'
import { API_URL } from '../../config'

export default function OrdersPage() {
    const router = useRouter()
    const { user, logout, loading } = useAuth()
    const [ordenes, setOrdenes] = useState([])
    const [loadingOrdenes, setLoadingOrdenes] = useState(true)
    const [showUserMenu, setShowUserMenu] = useState(false)

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

    const handleLogout = () => {
        if (confirm('¿Estás seguro de cerrar sesión?')) {
            logout()
            router.push('/')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-bold text-gray-900 tracking-wide">
                            KRAZE
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/productos" className="text-gray-700 hover:text-gray-900 font-medium">
                                Tienda
                            </Link>
                            <Link href="/account/orders" className="text-gray-700 hover:text-gray-900 font-medium">
                                Orders
                            </Link>
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                                >
                                    <FiUser size={20} />
                                </button>
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-200">
                                            <p className="text-sm text-gray-900 font-medium">
                                                {user.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/account/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            Perfil
                                        </Link>
                                        <Link
                                            href="/account/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            Configuración
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            Cerrar sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Title */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Pedidos</h1>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-6">
                        {loadingOrdenes ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent mb-4"></div>
                                    <p className="text-gray-600">Cargando pedidos...</p>
                                </div>
                            </div>
                        ) : ordenes.length === 0 ? (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Aún no tienes ningún pedido
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Ve a la tienda para realizar un pedido.
                                </p>
                                <Link
                                    href="/productos"
                                    className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors font-medium"
                                >
                                    Ir a la Tienda
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {ordenes.map((orden) => {
                                    const estadoConfig = {
                                        'pendiente_pago': { label: 'Pendiente de Pago', color: 'text-yellow-600' },
                                        'confirmado': { label: 'Confirmado', color: 'text-green-600' },
                                        'procesando': { label: 'Procesando', color: 'text-blue-600' },
                                        'enviado': { label: 'Enviado', color: 'text-purple-600' },
                                        'entregado': { label: 'Entregado', color: 'text-green-700' },
                                        'cancelado': { label: 'Cancelado', color: 'text-red-600' }
                                    }
                                    const config = estadoConfig[orden.estado] || estadoConfig['procesando']

                                    return (
                                        <div
                                            key={orden._id}
                                            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        #{orden.numeroOrden}
                                                    </p>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {new Date(orden.createdAt).toLocaleDateString('es-PE', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => router.push(`/orden-confirmada/${orden._id}`)}
                                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                                >
                                                    Ver pedido
                                                    <FiChevronRight size={16} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className={`text-sm font-medium ${config.color}`}>
                                                    {config.label}
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    S/ {(orden.montos?.total || 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}