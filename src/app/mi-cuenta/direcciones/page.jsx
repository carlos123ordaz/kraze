'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiCheck, FiX, FiMapPin } from 'react-icons/fi'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

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

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-serif font-bold">Mis Direcciones</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary flex items-center gap-2"
                >
                    <FiPlus /> Agregar Dirección
                </button>
            </div>

            {direcciones.length === 0 ? (
                <div className="text-center py-12 border border-gray-200 rounded-lg">
                    <FiMapPin className="mx-auto mb-4 text-accent" size={48} />
                    <p className="text-accent mb-4">No tienes direcciones guardadas</p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn-primary"
                    >
                        Agregar Primera Dirección
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {direcciones.map((dir) => (
                        <div
                            key={dir._id}
                            className={`border-2 p-6 rounded-lg ${dir.isDefault ? 'border-primary bg-primary/5' : 'border-gray-200'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">
                                        {dir.label === 'casa' ? '🏠' :
                                            dir.label === 'trabajo' ? '💼' :
                                                '📍'}
                                    </span>
                                    <h3 className="font-bold capitalize">{dir.label}</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(dir)}
                                        className="text-primary hover:text-primary/80"
                                    >
                                        <FiEdit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dir._id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="text-sm space-y-1 mb-4">
                                <p className="font-medium">{dir.nombres} {dir.apellidos}</p>
                                <p className="text-accent">{dir.direccion}</p>
                                {dir.referencia && (
                                    <p className="text-accent text-xs">Ref: {dir.referencia}</p>
                                )}
                                <p className="text-accent">{dir.distrito}, {dir.provincia}</p>
                                <p className="text-accent">{dir.departamento}</p>
                                <p className="text-accent">Tel: {dir.telefono}</p>
                            </div>

                            {dir.isDefault ? (
                                <span className="inline-block text-xs bg-primary text-white px-3 py-1 rounded">
                                    Predeterminada
                                </span>
                            ) : (
                                <button
                                    onClick={() => handleSetDefault(dir._id)}
                                    className="text-xs text-primary hover:underline"
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-serif font-bold mb-6">
                                {editingId ? 'Editar Dirección' : 'Nueva Dirección'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Etiqueta</label>
                                    <select
                                        name="label"
                                        value={formData.label}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary rounded"
                                    >
                                        <option value="casa">🏠 Casa</option>
                                        <option value="trabajo">💼 Trabajo</option>
                                        <option value="otro">📍 Otro</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Nombres *</label>
                                        <input
                                            type="text"
                                            name="nombres"
                                            value={formData.nombres}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary rounded"
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
                                            className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary rounded"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">DNI *</label>
                                        <input
                                            type="text"
                                            name="dni"
                                            value={formData.dni}
                                            onChange={handleChange}
                                            required
                                            maxLength="8"
                                            pattern="[0-9]{8}"
                                            className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary rounded"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Teléfono *</label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            required
                                            pattern="9[0-9]{8}"
                                            placeholder="9XXXXXXXX"
                                            className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary rounded"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Dirección *</label>
                                    <input
                                        type="text"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                        required
                                        placeholder="Calle, Avenida, Jirón, Número"
                                        className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Referencia</label>
                                    <input
                                        type="text"
                                        name="referencia"
                                        value={formData.referencia}
                                        onChange={handleChange}
                                        placeholder="Casa azul, al costado del parque..."
                                        className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary rounded"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Departamento *</label>
                                        <input
                                            type="text"
                                            name="departamento"
                                            value={formData.departamento}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary rounded"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Provincia *</label>
                                        <input
                                            type="text"
                                            name="provincia"
                                            value={formData.provincia}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary rounded"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Distrito *</label>
                                        <input
                                            type="text"
                                            name="distrito"
                                            value={formData.distrito}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-primary rounded"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 btn-secondary py-3"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 btn-primary py-3 disabled:opacity-50"
                                    >
                                        {loading ? 'Guardando...' : 'Guardar Dirección'}
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
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}