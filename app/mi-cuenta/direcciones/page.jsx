'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiCheck, FiX, FiMapPin, FiHome, FiBriefcase } from 'react-icons/fi'
import axios from 'axios'
import { API_URL } from '@/app/config'



export default function DireccionesPage() {
    const router = useRouter()
    const { user, loading: authLoading, checkAuth } = useAuth()
    const [direcciones, setDirecciones] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState(null)
    const [formData, setFormData] = useState({
        label: 'casa',
        nombres: '',
        apellidos: '',
        dni: '',
        telefono: '',
        direccion: '',
        referencia: '',
        departamento: '',
        provincia: '',
        distrito: '',
        codigoPostal: '',
        ubicacion: {
            latitud: -12.046374,
            longitud: -77.042793
        }
    })

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        } else if (user) {
            setDirecciones(user.direcciones || [])
            if (!formData.nombres && user) {
                setFormData(prev => ({
                    ...prev,
                    nombres: user.nombres || '',
                    apellidos: user.apellidos || '',
                    dni: user.dni || '',
                    telefono: user.telefono || ''
                }))
            }
        }
    }, [user, authLoading, router])

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 3500)
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const resetForm = () => {
        setFormData({
            label: 'casa',
            nombres: user?.nombres || '',
            apellidos: user?.apellidos || '',
            dni: user?.dni || '',
            telefono: user?.telefono || '',
            direccion: '',
            referencia: '',
            departamento: '',
            provincia: '',
            distrito: '',
            codigoPostal: '',
            ubicacion: {
                latitud: -12.046374,
                longitud: -77.042793
            }
        })
        setEditingId(null)
    }

    const handleOpenModal = (direccion = null) => {
        if (direccion) {
            setFormData({
                label: direccion.label || 'casa',
                nombres: direccion.nombres || '',
                apellidos: direccion.apellidos || '',
                dni: direccion.dni || '',
                telefono: direccion.telefono || '',
                direccion: direccion.direccion || '',
                referencia: direccion.referencia || '',
                departamento: direccion.departamento || '',
                provincia: direccion.provincia || '',
                distrito: direccion.distrito || '',
                codigoPostal: direccion.codigoPostal || '',
                ubicacion: direccion.ubicacion || { latitud: -12.046374, longitud: -77.042793 }
            })
            setEditingId(direccion._id)
        } else {
            resetForm()
        }
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        resetForm()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (editingId) {
                await axios.put(`${API_URL}/auth/direcciones/${editingId}`, formData)
                showNotification('Dirección actualizada correctamente', 'success')
            } else {
                await axios.post(`${API_URL}/auth/direcciones`, formData)
                showNotification('Dirección agregada correctamente', 'success')
            }

            await checkAuth()
            handleCloseModal()
        } catch (error) {
            showNotification(
                error.response?.data?.mensaje || 'Error al guardar dirección',
                'error'
            )
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta dirección?')) return

        try {
            await axios.delete(`${API_URL}/auth/direcciones/${id}`)
            showNotification('Dirección eliminada correctamente', 'success')
            await checkAuth()
        } catch (error) {
            showNotification(
                error.response?.data?.mensaje || 'Error al eliminar dirección',
                'error'
            )
        }
    }

    const handleSetDefault = async (id) => {
        try {
            await axios.put(`${API_URL}/auth/direcciones/${id}/default`)
            showNotification('Dirección predeterminada actualizada', 'success')
            await checkAuth()
        } catch (error) {
            showNotification(
                error.response?.data?.mensaje || 'Error al actualizar dirección',
                'error'
            )
        }
    }

    const getIcon = (label) => {
        switch (label) {
            case 'casa':
                return <FiHome size={24} />
            case 'trabajo':
                return <FiBriefcase size={24} />
            default:
                return <FiMapPin size={24} />
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
        <div className="min-h-screen bg-gray-50">
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
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                    >
                        <FiArrowLeft size={20} />
                        <span className="font-medium">Volver</span>
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Mis Direcciones</h1>
                            <p className="text-gray-600">Administra tus direcciones de envío</p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <FiPlus size={20} />
                            <span>Nueva Dirección</span>
                        </button>
                    </div>
                </div>

                {/* Direcciones */}
                {direcciones.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiMapPin size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes direcciones guardadas</h3>
                            <p className="text-gray-600 mb-8">
                                Agrega una dirección para que tus compras lleguen más rápido
                            </p>
                            <button
                                onClick={() => handleOpenModal()}
                                className="bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                            >
                                <FiPlus size={20} />
                                Agregar Primera Dirección
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {direcciones.map((dir) => (
                            <div
                                key={dir._id}
                                className={`bg-white rounded-2xl shadow-sm p-6 transition-all hover:shadow-md ${dir.isDefault ? 'ring-2 ring-black' : ''
                                    }`}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${dir.isDefault ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {getIcon(dir.label)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 capitalize text-lg">
                                                {dir.label}
                                            </h3>
                                            {dir.isDefault && (
                                                <span className="text-xs text-gray-600">Dirección predeterminada</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenModal(dir)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <FiEdit size={18} className="text-gray-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(dir._id)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <FiTrash2 size={18} className="text-red-600" />
                                        </button>
                                    </div>
                                </div>

                                {/* Información */}
                                <div className="space-y-2 mb-4">
                                    <p className="font-semibold text-gray-900">
                                        {dir.nombres} {dir.apellidos}
                                    </p>
                                    <p className="text-gray-700">{dir.direccion}</p>
                                    {dir.referencia && (
                                        <p className="text-sm text-gray-600">📍 {dir.referencia}</p>
                                    )}
                                    <p className="text-gray-700">
                                        {dir.distrito}, {dir.provincia}, {dir.departamento}
                                    </p>
                                    <p className="text-gray-600 text-sm">📱 {dir.telefono}</p>
                                    <p className="text-gray-600 text-sm">🪪 DNI: {dir.dni}</p>
                                </div>

                                {/* Footer */}
                                {!dir.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(dir._id)}
                                        className="text-sm text-gray-900 font-medium hover:underline"
                                    >
                                        Establecer como predeterminada
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
                            {/* Modal Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingId ? 'Editar Dirección' : 'Nueva Dirección'}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Etiqueta */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                                            Tipo de dirección
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { value: 'casa', icon: '🏠', label: 'Casa' },
                                                { value: 'trabajo', icon: '💼', label: 'Trabajo' },
                                                { value: 'otro', icon: '📍', label: 'Otro' }
                                            ].map((option) => (
                                                <label
                                                    key={option.value}
                                                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.label === option.value
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="label"
                                                        value={option.value}
                                                        checked={formData.label === option.value}
                                                        onChange={handleChange}
                                                        className="sr-only"
                                                    />
                                                    <span className="text-2xl mb-1">{option.icon}</span>
                                                    <span className="text-sm font-medium">{option.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Información Personal */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Información Personal</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Nombres *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nombres"
                                                    value={formData.nombres}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Apellidos *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="apellidos"
                                                    value={formData.apellidos}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    DNI *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="dni"
                                                    value={formData.dni}
                                                    onChange={handleChange}
                                                    required
                                                    maxLength="8"
                                                    pattern="[0-9]{8}"
                                                    placeholder="12345678"
                                                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Teléfono *
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="telefono"
                                                    value={formData.telefono}
                                                    onChange={handleChange}
                                                    required
                                                    pattern="9[0-9]{8}"
                                                    placeholder="9XXXXXXXX"
                                                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dirección */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Dirección de Entrega</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Dirección completa *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="direccion"
                                                    value={formData.direccion}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Av. Principal 123, Edificio ABC, Dpto 401"
                                                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Referencia
                                                </label>
                                                <input
                                                    type="text"
                                                    name="referencia"
                                                    value={formData.referencia}
                                                    onChange={handleChange}
                                                    placeholder="Edificio blanco al costado del parque..."
                                                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Departamento *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="departamento"
                                                        value={formData.departamento}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Lima"
                                                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Provincia *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="provincia"
                                                        value={formData.provincia}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Lima"
                                                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Distrito *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="distrito"
                                                        value={formData.distrito}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Miraflores"
                                                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Guardando...
                                                </span>
                                            ) : (
                                                'Guardar Dirección'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

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
                    @keyframes fade-in {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                    @keyframes scale-in {
                        from {
                            transform: scale(0.95);
                            opacity: 0;
                        }
                        to {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                    .animate-slide-in {
                        animation: slide-in 0.3s ease-out;
                    }
                    .animate-fade-in {
                        animation: fade-in 0.2s ease-out;
                    }
                    .animate-scale-in {
                        animation: scale-in 0.3s ease-out;
                    }
                `}</style>
            </div>
        </div>
    )
}