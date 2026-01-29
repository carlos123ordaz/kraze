'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Hero() {
    // Productos destacados para mostrar en el hero
    const featuredProducts = [
        {
            image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
            title: 'Colección Urbana',
            category: 'HOODIES',
            link: '/productos?categoria=hoodies'
        },
        {
            image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
            title: 'Estilo Oversize',
            category: 'BUZOS',
            link: '/productos?categoria=buzos'
        },
        {
            image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800',
            title: 'Esenciales',
            category: 'POLOS',
            link: '/productos?categoria=polos'
        }
    ]

    return (
        <section className="relative bg-black text-white min-h-screen flex justify-center pt-10 md:pt-20">
            <div className="w-full px-4 md:px-6 lg:px-8">
                {/* Tarjetas de Producto - Scroll horizontal en mobile, grid en desktop */}
                <div className="md:hidden">
                    {/* Mobile: Scroll horizontal */}
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                        {featuredProducts.map((product, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="flex-shrink-0 w-[75vw] snap-center"
                            >
                                <Link
                                    href={product.link}
                                    className="group block bg-white rounded-2xl overflow-hidden"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                        <Image
                                            src={product.image}
                                            alt={product.title}
                                            fill
                                            sizes="75vw"
                                            className="object-cover"
                                            priority={index === 0}
                                        />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Indicador de scroll */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                        {featuredProducts.map((_, index) => (
                            <div
                                key={index}
                                className="w-2 h-2 rounded-full bg-gray-600"
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop: Grid de 3 columnas */}
                <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-8 max-w-[1400px] mx-auto">
                    {featuredProducts.map((product, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="w-full"
                        >
                            <Link
                                href={product.link}
                                className="group block bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        priority={index === 0}
                                    />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>



            <style jsx>{`
                /* Ocultar scrollbar pero mantener funcionalidad */
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    )
}