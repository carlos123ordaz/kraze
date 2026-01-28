'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { FiArrowLeft, FiCheck, FiX } from 'react-icons/fi'
import axios from 'axios'
import { API_URL } from '@/app/config'


export default function EditarPerfilPage() {
    const router = useRouter()
    const { user, loading: authLoading, checkAuth } = useAuth()
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        telefono: '',
        dni: '',
        fechaNacimiento: '',
        genero: '',
    })
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        } else if (user) {
            setFormData({
                nombres: user.nombres || '',
                apellidos: user.apellidos || '',
                telefono: user.telefono || '',
                dni: user.dni || '',
                fechaNacimiento: user.fechaNacimiento ? user.fechaNacimiento.split('T')[0] : '',
                genero: user.genero || '',
            })
        }
    }, [user, authLoading, router])

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await axios.put(`${API_URL}/auth/perfil`, formData)
            await checkAuth() // Actualizar datos del usuario
            showNotification('Perfil actualizado correctamente', 'success')
            setTimeout(() => router.push('/mi-cuenta'), 1500)
        } catch (error) {
            showNotification(
                error.response?.data?.mensaje || 'Error al actualizar perfil',
                'error'
            )
        } finally {
            setLoading(false)
        }
    }

    if (authLoading) {
        return (
            <div className="container-custom py-20 text-center">
                <p>Cargando...</p>
            </div>
        )
    }

    if (!user) {
        return null
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
                            {notification.type === 'success' ? <FiCheck size={24} /> : <FiX size={24} />}
                        </div>
                        <p className={`text-sm ${notification.type === 'success' ? 'text-green-900' : 'text-red-900'
                            }`}>
                            {notification.message}
                        </p>
                    </div>
                </div>
            )}

            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-accent hover:text-primary mb-6"
            >
                <FiArrowLeft /> Volver
            </button>

            <h1 className="text-3xl font-serif font-bold mb-8">Editar Perfil</h1>

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nombres *</label>
                            <input
                                type="text"
                                name="nombres"
                                value={formData.nombres}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Apellidos *</label>
                            <input
                                type="text"
                                name="apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">DNI</label>
                            <input
                                type="text"
                                name="dni"
                                value={formData.dni}
                                onChange={handleChange}
                                maxLength="8"
                                pattern="[0-9]{8}"
                                placeholder="8 dígitos"
                                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Teléfono</label>
                            <input
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                pattern="9[0-9]{8}"
                                placeholder="9XXXXXXXX"
                                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                name="fechaNacimiento"
                                value={formData.fechaNacimiento}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Género</label>
                            <select
                                name="genero"
                                value={formData.genero}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary"
                            >
                                <option value="">Seleccionar...</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                                <option value="otro">Otro</option>
                                <option value="prefiero_no_decir">Prefiero no decir</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn-secondary px-8 py-3"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary px-8 py-3 disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
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