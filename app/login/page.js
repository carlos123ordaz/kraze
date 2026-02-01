'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
    const router = useRouter()
    const { login, user, loading: authLoading } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Redirigir si ya está logeado
    useEffect(() => {
        if (!authLoading && user) {
            router.push('/account/orders')
        }
    }, [user, authLoading, router])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(formData.email, formData.password)
            router.push('/account/orders')
        } catch (error) {
            setError(error.response?.data?.mensaje || 'Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    // Mostrar loading mientras verifica autenticación
    if (authLoading) {
        return (
            <div className="container-custom py-20 text-center">
                <p>Cargando...</p>
            </div>
        )
    }

    // Si ya está logeado, no mostrar el form (mientras redirecciona)
    if (user) {
        return null
    }

    return (
        <div className="container-custom py-12">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-serif font-bold mb-8 text-center">Iniciar Sesión</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 disabled:opacity-50"
                    >
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    <p className="text-sm text-accent">
                        ¿No tienes cuenta?{' '}
                        <Link href="/registro" className="text-primary font-medium hover:underline">
                            Regístrate aquí
                        </Link>
                    </p>
                    <p className="text-sm">
                        <Link href="/recuperar-password" className="text-accent hover:text-primary">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}