'use client'

import { useEffect, useState } from 'react'
import { FiStar, FiThumbsUp, FiFlag, FiEdit, FiTrash2 } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { API_URL } from '@/app/config'

export default function ProductReviews({ productId }) {
    const { user } = useAuth()
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [canReview, setCanReview] = useState(false)
    const [reviewData, setReviewData] = useState({
        calificacion: 5,
        titulo: '',
        comentario: '',
        aspectos: {
            calidad: 5,
            tallaje: 'perfecto',
            comodidad: 5,
            calce: 'perfecto'
        },
        tallaComprada: '',
        alturaUsuario: '',
        pesoUsuario: ''
    })
    const [filter, setFilter] = useState('recientes')
    const [ratingFilter, setRatingFilter] = useState(null)

    useEffect(() => {
        fetchReviews()
        if (user) {
            checkCanReview()
        }
    }, [productId, user, filter, ratingFilter])

    const fetchReviews = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                ordenarPor: filter
            })
            if (ratingFilter) {
                params.append('calificacion', ratingFilter)
            }

            const { data } = await axios.get(`${API_URL}/reviews/producto/${productId}?${params}`)
            setReviews(data.reviews || [])
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const checkCanReview = async () => {
        try {
            // Verificar si el usuario puede dejar reseña
            const { data } = await axios.get(`${API_URL}/reviews/puede-revisar/${productId}`)
            console.log('puede: ', data.puede)
            setCanReview(data.puede)
        } catch (error) {
            setCanReview(false)
        }
    }

    const handleSubmitReview = async (e) => {
        e.preventDefault()

        if (!user) {
            alert('Debes iniciar sesión para dejar una reseña')
            return
        }

        try {
            await axios.post(`${API_URL}/reviews/producto/${productId}`, reviewData)
            alert('¡Reseña enviada! Será revisada antes de publicarse.')
            setShowForm(false)
            setReviewData({
                calificacion: 5,
                titulo: '',
                comentario: '',
                aspectos: {
                    calidad: 5,
                    tallaje: 'perfecto',
                    comodidad: 5,
                    calce: 'perfecto'
                },
                tallaComprada: '',
                alturaUsuario: '',
                pesoUsuario: ''
            })
            fetchReviews()
        } catch (error) {
            alert(error.response?.data?.mensaje || 'Error al enviar reseña')
        }
    }

    const handleVoteUtility = async (reviewId, voto) => {
        if (!user) {
            alert('Debes iniciar sesión para votar')
            return
        }

        try {
            await axios.post(`${API_URL}/reviews/${reviewId}/votar`, { voto })
            fetchReviews()
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const renderStars = (rating, interactive = false, onChange = null) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <FiStar
                key={index}
                className={`${index < rating ? 'fill-current text-primary' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:text-primary' : ''}`}
                size={interactive ? 24 : 16}
                onClick={() => interactive && onChange && onChange(index + 1)}
            />
        ))
    }

    const getTallajeText = (tallaje) => {
        const textos = {
            'muy_pequeno': 'Muy pequeño',
            'pequeno': 'Pequeño',
            'perfecto': 'Perfecto',
            'grande': 'Grande',
            'muy_grande': 'Muy grande'
        }
        return textos[tallaje] || tallaje
    }

    const getCalceText = (calce) => {
        const textos = {
            'ajustado': 'Ajustado',
            'perfecto': 'Perfecto',
            'holgado': 'Holgado'
        }
        return textos[calce] || calce
    }

    if (loading) {
        return <div className="text-center py-8">Cargando reseñas...</div>
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif font-bold">
                    Reseñas ({reviews.length})
                </h2>

                {user && canReview && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary"
                    >
                        Escribir Reseña
                    </button>
                )}
            </div>

            {/* Formulario de Nueva Reseña */}
            {showForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <h3 className="text-xl font-serif font-bold mb-4">Escribe tu Reseña</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        {/* Calificación General */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Calificación General *
                            </label>
                            <div className="flex gap-1">
                                {renderStars(reviewData.calificacion, true, (rating) =>
                                    setReviewData({ ...reviewData, calificacion: rating })
                                )}
                            </div>
                        </div>

                        {/* Título */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Título de tu reseña
                            </label>
                            <input
                                type="text"
                                value={reviewData.titulo}
                                onChange={(e) => setReviewData({ ...reviewData, titulo: e.target.value })}
                                placeholder="Resume tu experiencia"
                                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-primary"
                                maxLength={100}
                            />
                        </div>

                        {/* Comentario */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Comentario *
                            </label>
                            <textarea
                                value={reviewData.comentario}
                                onChange={(e) => setReviewData({ ...reviewData, comentario: e.target.value })}
                                placeholder="Cuéntanos sobre el producto (mínimo 10 caracteres)"
                                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-primary"
                                rows={4}
                                required
                                minLength={10}
                                maxLength={1000}
                            />
                            <p className="text-xs text-accent mt-1">
                                {reviewData.comentario.length}/1000 caracteres
                            </p>
                        </div>

                        {/* Aspectos del Producto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Calidad */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Calidad</label>
                                <div className="flex gap-1">
                                    {renderStars(reviewData.aspectos.calidad, true, (rating) =>
                                        setReviewData({
                                            ...reviewData,
                                            aspectos: { ...reviewData.aspectos, calidad: rating }
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Comodidad */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Comodidad</label>
                                <div className="flex gap-1">
                                    {renderStars(reviewData.aspectos.comodidad, true, (rating) =>
                                        setReviewData({
                                            ...reviewData,
                                            aspectos: { ...reviewData.aspectos, comodidad: rating }
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Tallaje */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Tallaje</label>
                                <select
                                    value={reviewData.aspectos.tallaje}
                                    onChange={(e) => setReviewData({
                                        ...reviewData,
                                        aspectos: { ...reviewData.aspectos, tallaje: e.target.value }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-primary"
                                >
                                    <option value="muy_pequeno">Muy pequeño</option>
                                    <option value="pequeno">Pequeño</option>
                                    <option value="perfecto">Perfecto</option>
                                    <option value="grande">Grande</option>
                                    <option value="muy_grande">Muy grande</option>
                                </select>
                            </div>

                            {/* Calce */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Calce</label>
                                <select
                                    value={reviewData.aspectos.calce}
                                    onChange={(e) => setReviewData({
                                        ...reviewData,
                                        aspectos: { ...reviewData.aspectos, calce: e.target.value }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-primary"
                                >
                                    <option value="ajustado">Ajustado</option>
                                    <option value="perfecto">Perfecto</option>
                                    <option value="holgado">Holgado</option>
                                </select>
                            </div>
                        </div>

                        {/* Información Adicional */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Talla Comprada</label>
                                <input
                                    type="text"
                                    value={reviewData.tallaComprada}
                                    onChange={(e) => setReviewData({ ...reviewData, tallaComprada: e.target.value })}
                                    placeholder="Ej: M"
                                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Tu Altura</label>
                                <input
                                    type="text"
                                    value={reviewData.alturaUsuario}
                                    onChange={(e) => setReviewData({ ...reviewData, alturaUsuario: e.target.value })}
                                    placeholder="Ej: 1.70m"
                                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Tu Peso</label>
                                <input
                                    type="text"
                                    value={reviewData.pesoUsuario}
                                    onChange={(e) => setReviewData({ ...reviewData, pesoUsuario: e.target.value })}
                                    placeholder="Ej: 65kg"
                                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3">
                            <button type="submit" className="btn-primary">
                                Enviar Reseña
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="btn-secondary"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filtros */}
            <div className="flex flex-wrap gap-4 mb-6">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-primary"
                >
                    <option value="recientes">Más Recientes</option>
                    <option value="antiguos">Más Antiguos</option>
                    <option value="mejor_valorados">Mejor Valorados</option>
                    <option value="peor_valorados">Peor Valorados</option>
                    <option value="mas_utiles">Más Útiles</option>
                </select>

                <select
                    value={ratingFilter || ''}
                    onChange={(e) => setRatingFilter(e.target.value ? Number(e.target.value) : null)}
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-primary"
                >
                    <option value="">Todas las calificaciones</option>
                    <option value="5">5 estrellas</option>
                    <option value="4">4 estrellas</option>
                    <option value="3">3 estrellas</option>
                    <option value="2">2 estrellas</option>
                    <option value="1">1 estrella</option>
                </select>
            </div>

            {/* Lista de Reseñas */}
            {reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-accent mb-4">
                        {ratingFilter
                            ? `No hay reseñas con ${ratingFilter} estrellas`
                            : 'Aún no hay reseñas para este producto'}
                    </p>
                    {user && canReview && !showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn-primary"
                        >
                            Sé el primero en opinar
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="border border-gray-200 rounded-lg p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex text-primary">
                                            {renderStars(review.calificacion)}
                                        </div>
                                        {review.compraVerificada && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                Compra verificada
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-accent">
                                        por {review.usuario?.nombres || 'Usuario'} •{' '}
                                        {new Date(review.createdAt).toLocaleDateString('es-PE', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Título */}
                            {review.titulo && (
                                <h4 className="font-semibold mb-2">{review.titulo}</h4>
                            )}

                            {/* Comentario */}
                            <p className="text-accent mb-4">{review.comentario}</p>

                            {/* Aspectos */}
                            {review.aspectos && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                                    {review.aspectos.calidad && (
                                        <div>
                                            <span className="text-accent">Calidad:</span>
                                            <div className="flex text-primary">
                                                {renderStars(review.aspectos.calidad)}
                                            </div>
                                        </div>
                                    )}
                                    {review.aspectos.comodidad && (
                                        <div>
                                            <span className="text-accent">Comodidad:</span>
                                            <div className="flex text-primary">
                                                {renderStars(review.aspectos.comodidad)}
                                            </div>
                                        </div>
                                    )}
                                    {review.aspectos.tallaje && (
                                        <div>
                                            <span className="text-accent">Tallaje:</span>
                                            <p className="font-medium">{getTallajeText(review.aspectos.tallaje)}</p>
                                        </div>
                                    )}
                                    {review.aspectos.calce && (
                                        <div>
                                            <span className="text-accent">Calce:</span>
                                            <p className="font-medium">{getCalceText(review.aspectos.calce)}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Info adicional */}
                            {(review.tallaComprada || review.alturaUsuario || review.pesoUsuario) && (
                                <div className="text-sm text-accent mb-4">
                                    {review.tallaComprada && <span>Talla: {review.tallaComprada} • </span>}
                                    {review.alturaUsuario && <span>Altura: {review.alturaUsuario} • </span>}
                                    {review.pesoUsuario && <span>Peso: {review.pesoUsuario}</span>}
                                </div>
                            )}

                            {/* Utilidad */}
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => handleVoteUtility(review._id, 'util')}
                                    disabled={!user}
                                    className="flex items-center gap-2 text-sm text-accent hover:text-primary transition-colors disabled:opacity-50"
                                >
                                    <FiThumbsUp size={16} />
                                    Útil ({review.utilidad?.util || 0})
                                </button>
                                <span className="text-sm text-accent">
                                    {review.utilidad?.noUtil || 0} personas no lo encontraron útil
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}