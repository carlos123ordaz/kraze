'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ProductGallery({ images = [] }) {
    const [selectedImage, setSelectedImage] = useState(0)

    if (images.length === 0) {
        return (
            <div className="aspect-[3/4] bg-light-gray flex items-center justify-center">
                <p className="text-accent">Sin imágenes</p>
            </div>
        )
    }

    return (
        <div>
            {/* Main Image */}
            <div className="aspect-[3/4] relative mb-4 overflow-hidden bg-light-gray">
                <Image
                    src={images[selectedImage]?.url || '/placeholder.jpg'}
                    alt="Producto"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`aspect-square relative overflow-hidden bg-light-gray border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'
                                }`}
                        >
                            <Image
                                src={image.url}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}