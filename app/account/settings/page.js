'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { FiUser, FiCheck, FiX } from 'react-icons/fi'
import Link from 'next/link'

export default function SettingsPage() {
    const router = useRouter()
    const { user, logout, loading: authLoading } = useAuth()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 3500)
    }

    const handleLogoutAllSessions = () => {
        if (confirm('¿Estás seguro de cerrar todas las sesiones? También se cerrará tu sesión en este dispositivo.')) {
            logout()
            showNotification('Todas las sesiones fueron cerradas correctamente', 'success')
            setTimeout(() => router.push('/'), 1500)
        }
    }

    const handleLogout = () => {
        if (confirm('¿Estás seguro de cerrar sesión?')) {
            logout()
            router.push('/')
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-600">Cargando...</p>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className={`flex items-start gap-3 p-4 rounded-lg shadow-lg max-w-md ${notification.type === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                        }`}>
                        <div className={`flex-shrink-0 ${notification.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {notification.type === 'success' ? <FiCheck size={24} /> : <FiX size={24} />}
                        </div>
                        <div className="flex-1">
                            <p className={`font-medium ${notification.type === 'success' ? 'text-green-900' : 'text-red-900'}`}>
                                {notification.type === 'success' ? '¡Éxito!' : 'Error'}
                            </p>
                            <p className={`text-sm mt-1 ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                                {notification.message}
                            </p>
                        </div>
                    </div>
                </div>
            )}

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
                                            <p className="text-sm text-gray-900 font-medium">{user.email}</p>
                                        </div>
                                        <Link href="/account/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            Perfil
                                        </Link>
                                        <Link href="/account/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            Configuración
                                        </Link>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
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
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Configuración</h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-sm font-semibold text-gray-900">Perfil</h2>
                                    <Link
                                        href="/account/profile"
                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        ✎
                                    </Link>
                                </div>
                                <p className="text-sm text-gray-700 mb-1">{user.nombres || ''} {user.apellidos || ''}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-semibold text-gray-900">Direcciones</h2>
                                    <Link
                                        href="/account/profile"
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        + Agregar
                                    </Link>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>ℹ️ No se agregaron direcciones.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white border border-gray-200 rounded-lg">
                            {/* Cerrar todas las sesiones */}
                            <div className="p-8">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-base font-semibold text-gray-900 mb-2">
                                            Cerrar todas las sesiones
                                        </h2>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Si perdiste un dispositivo o tienes inquietudes relacionadas con la seguridad, cierra todas las sesiones para garantizar la seguridad de tu cuenta.
                                        </p>
                                        <button
                                            onClick={handleLogoutAllSessions}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Cerrar todas las sesiones
                                        </button>
                                        <p className="text-xs text-gray-500 mt-2">
                                            También se cerrará tu sesión en este dispositivo.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}