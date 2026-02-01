'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { FiUser, FiX, FiCheck, FiEdit, FiTrash2 } from 'react-icons/fi'
import axios from 'axios'
import { API_URL } from '../../config'
import Link from 'next/link'

export default function ProfilePage() {
    const router = useRouter()
    const { user, loading: authLoading, checkAuth, logout } = useAuth()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [editingAddressId, setEditingAddressId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState(null)

    const [profileForm, setProfileForm] = useState({
        nombres: '',
        apellidos: ''
    })

    const [addressForm, setAddressForm] = useState({
        nombres: '',
        apellidos: '',
        direccion: '',
        referencia: '',
        ciudad: '',
        region: '',
        codigoPostal: '',
        telefono: ''
    })

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        } else if (user) {
            setProfileForm({
                nombres: user.nombres || '',
                apellidos: user.apellidos || ''
            })
        }
    }, [user, authLoading, router])

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 3500)
    }

    const handleProfileChange = (e) => {
        setProfileForm({
            ...profileForm,
            [e.target.name]: e.target.value
        })
    }

    const handleAddressChange = (e) => {
        setAddressForm({
            ...addressForm,
            [e.target.name]: e.target.value
        })
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await axios.put(`${API_URL}/auth/perfil`, profileForm)
            await checkAuth()
            showNotification('Perfil actualizado correctamente', 'success')
            setShowEditModal(false)
        } catch (error) {
            showNotification(error.response?.data?.mensaje || 'Error al actualizar perfil', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleAddressSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload = {
                nombres: addressForm.nombres,
                apellidos: addressForm.apellidos,
                telefono: addressForm.telefono,
                direccion: addressForm.direccion,
                referencia: addressForm.referencia,
                departamento: addressForm.region,
                provincia: addressForm.ciudad,
                distrito: addressForm.ciudad,
                codigoPostal: addressForm.codigoPostal
            }

            if (editingAddressId) {
                await axios.put(`${API_URL}/auth/direcciones/${editingAddressId}`, payload)
                showNotification('Dirección actualizada correctamente', 'success')
            } else {
                await axios.post(`${API_URL}/auth/direcciones`, payload)
                showNotification('Dirección agregada correctamente', 'success')
            }

            await checkAuth()
            setShowAddressModal(false)
            resetAddressForm()
        } catch (error) {
            showNotification(error.response?.data?.mensaje || 'Error al guardar dirección', 'error')
        } finally {
            setLoading(false)
        }
    }

    const resetAddressForm = () => {
        setAddressForm({
            nombres: user?.nombres || '',
            apellidos: user?.apellidos || '',
            direccion: '',
            referencia: '',
            ciudad: '',
            region: '',
            codigoPostal: '',
            telefono: user?.telefono || ''
        })
        setEditingAddressId(null)
    }

    const handleOpenAddressModal = (direccion = null) => {
        if (direccion) {
            setAddressForm({
                nombres: direccion.nombres || '',
                apellidos: direccion.apellidos || '',
                direccion: direccion.direccion || '',
                referencia: direccion.referencia || '',
                ciudad: direccion.distrito || '',
                region: direccion.departamento || '',
                codigoPostal: direccion.codigoPostal || '',
                telefono: direccion.telefono || ''
            })
            setEditingAddressId(direccion._id)
        } else {
            resetAddressForm()
        }
        setShowAddressModal(true)
    }

    const handleDeleteAddress = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta dirección?')) return

        try {
            await axios.delete(`${API_URL}/auth/direcciones/${id}`)
            showNotification('Dirección eliminada correctamente', 'success')
            await checkAuth()
        } catch (error) {
            showNotification(error.response?.data?.mensaje || 'Error al eliminar dirección', 'error')
        }
    }

    const handleSetDefaultAddress = async (id) => {
        try {
            await axios.put(`${API_URL}/auth/direcciones/${id}/default`)
            showNotification('Dirección predeterminada actualizada', 'success')
            await checkAuth()
        } catch (error) {
            showNotification(error.response?.data?.mensaje || 'Error al actualizar dirección', 'error')
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
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Perfil</h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}


                    {/* Main Content */}
                    <div className="lg:col-span-6">
                        {/* Perfil Info */}
                        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
                            <div className="max-w-2xl">
                                <div className="mb-6 pb-6 border-b border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Nombre</h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-700">{user.nombres} {user.apellidos}</p>
                                        <button
                                            onClick={() => setShowEditModal(true)}
                                            className="text-sm text-blue-600 hover:text-blue-700"
                                        >
                                            Editar
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Correo electrónico</h3>
                                    <p className="text-sm text-gray-700">{user.email}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Este correo electrónico se usa para iniciar sesión y actualizar pedidos.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Direcciones */}
                        <div className="bg-white border border-gray-200 rounded-lg p-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Direcciones</h2>

                            {!user.direcciones || user.direcciones.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 mb-4">No tienes direcciones guardadas.</p>
                                    <button
                                        onClick={() => handleOpenAddressModal()}
                                        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors font-medium"
                                    >
                                        Agregar dirección
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {user.direcciones.map((dir) => (
                                        <div key={dir._id} className="border border-gray-200 rounded-lg p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {dir.nombres} {dir.apellidos}
                                                    </p>
                                                    {dir.isDefault && (
                                                        <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                            Esta es mi dirección predeterminada
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleOpenAddressModal(dir)}
                                                        className="text-sm text-blue-600 hover:text-blue-700"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAddress(dir._id)}
                                                        className="text-sm text-red-600 hover:text-red-700"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="text-sm text-gray-700 space-y-1">
                                                <p>{dir.direccion}</p>
                                                {dir.referencia && <p>{dir.referencia}</p>}
                                                <p>{dir.distrito}, {dir.provincia}, {dir.departamento}</p>
                                                <p>Perú</p>
                                                <p>{dir.telefono}</p>
                                            </div>

                                            {!dir.isDefault && (
                                                <button
                                                    onClick={() => handleSetDefaultAddress(dir._id)}
                                                    className="mt-4 text-sm text-blue-600 hover:text-blue-700"
                                                >
                                                    Definir como predeterminada
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Editar Perfil */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Editar perfil</h2>
                            <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded">
                                <FiX size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="p-6">
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombres"
                                        value={profileForm.nombres}
                                        onChange={handleProfileChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 mb-2">Apellido</label>
                                    <input
                                        type="text"
                                        name="apellidos"
                                        value={profileForm.apellidos}
                                        onChange={handleProfileChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 mb-2">Correo electrónico</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Este correo electrónico se usa para iniciar sesión y actualizar pedidos.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Agregar/Editar Dirección */}
            {showAddressModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {editingAddressId ? 'Editar dirección' : 'Agregar dirección'}
                            </h2>
                            <button onClick={() => setShowAddressModal(false)} className="p-1 hover:bg-gray-100 rounded">
                                <FiX size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddressSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">País / Región</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" disabled>
                                        <option>Perú</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="nombres"
                                        placeholder="Nombre"
                                        value={addressForm.nombres}
                                        onChange={handleAddressChange}
                                        required
                                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        name="apellidos"
                                        placeholder="Apellido"
                                        value={addressForm.apellidos}
                                        onChange={handleAddressChange}
                                        required
                                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <input
                                    type="text"
                                    name="direccion"
                                    placeholder="Dirección"
                                    value={addressForm.direccion}
                                    onChange={handleAddressChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <input
                                    type="text"
                                    name="referencia"
                                    placeholder="Apartamento, local, etc. (opcional)"
                                    value={addressForm.referencia}
                                    onChange={handleAddressChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <div className="grid grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        name="ciudad"
                                        placeholder="Ciudad"
                                        value={addressForm.ciudad}
                                        onChange={handleAddressChange}
                                        required
                                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <select
                                        name="region"
                                        value={addressForm.region}
                                        onChange={handleAddressChange}
                                        required
                                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Región</option>

                                        <option value="Amazonas">Amazonas</option>
                                        <option value="Áncash">Áncash</option>
                                        <option value="Apurímac">Apurímac</option>
                                        <option value="Arequipa">Arequipa</option>
                                        <option value="Ayacucho">Ayacucho</option>
                                        <option value="Cajamarca">Cajamarca</option>
                                        <option value="Callao">Callao</option>
                                        <option value="Cusco">Cusco</option>
                                        <option value="Huancavelica">Huancavelica</option>
                                        <option value="Huánuco">Huánuco</option>
                                        <option value="Ica">Ica</option>
                                        <option value="Junín">Junín</option>
                                        <option value="La Libertad">La Libertad</option>
                                        <option value="Lambayeque">Lambayeque</option>
                                        <option value="Lima Metropolitana">Lima Metropolitana</option>
                                        <option value="Lima Provincias">Lima Provincias</option>
                                        <option value="Loreto">Loreto</option>
                                        <option value="Madre de Dios">Madre de Dios</option>
                                        <option value="Moquegua">Moquegua</option>
                                        <option value="Pasco">Pasco</option>
                                        <option value="Piura">Piura</option>
                                        <option value="Puno">Puno</option>
                                        <option value="San Martín">San Martín</option>
                                        <option value="Tacna">Tacna</option>
                                        <option value="Tumbes">Tumbes</option>
                                        <option value="Ucayali">Ucayali</option>
                                    </select>

                                    <input
                                        type="text"
                                        name="codigoPostal"
                                        placeholder="Cód. postal"
                                        value={addressForm.codigoPostal}
                                        onChange={handleAddressChange}
                                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <input
                                    type="tel"
                                    name="telefono"
                                    placeholder="Teléfono"
                                    value={addressForm.telefono}
                                    onChange={handleAddressChange}
                                    required
                                    pattern="9[0-9]{8}"
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                {!editingAddressId && (
                                    <label className="flex items-start gap-2 text-sm">
                                        <input type="checkbox" className="mt-0.5 rounded" />
                                        <span className="text-gray-700">Definir como dirección de envío predeterminada</span>
                                    </label>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddressModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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