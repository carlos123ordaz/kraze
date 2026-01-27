'use client'

import { useEffect, useState } from 'react'
import { FiStar } from 'react-icons/fi'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function ProductReviews({ productId }) {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchReviews()
    }, [productId])

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/reviews?producto=${productId}&estado=aprobado`)
            setReviews(data.resenas || [])
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <FiStar
                key={index}
                className={`${index < rating ? 'fill-current' : ''}`}
                size={16}
            />
        ))
    }

    if (loading) {
        return <div className="text-center py-8">Cargando reseñas...</div>
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif font-bold mb-8">
                Reseñas ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
                <p className="text-accent text-center py-8">
                    Aún no hay reseñas para este producto
                </p>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-200 pb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex text-primary">
                                    {renderStars(review.calificacion)}
                                </div>
                                <span className="text-sm text-accent">
                                    por {review.usuario?.nombres || 'Anónimo'}
                                </span>
                            </div>
                            {review.titulo && (
                                <h4 className="font-medium mb-2">{review.titulo}</h4>
                            )}
                            <p className="text-accent">{review.comentario}</p>
                            <p className="text-xs text-accent mt-2">
                                {new Date(review.createdAt).toLocaleDateString('es-PE')}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}