'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920)',
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center text-secondary px-4"
            >
                <p className="text-sm tracking-widest uppercase mb-4">Nueva Colección</p>
                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
                    ESTILO ATEMPORAL
                </h1>
                <p className="text-lg mb-8 max-w-md mx-auto">
                    Descubre nuestra colección de moda urbana con descuentos de hasta 60%
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center text-white">
                    <Link href="/productos?genero=mujer" className="btn-secondary text-white border-white">
                        Comprar Mujer
                    </Link>
                    <Link href="/productos?genero=hombre" className="btn-primary">
                        Comprar Hombre
                    </Link>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-6 h-10 border-2 border-secondary rounded-full flex items-start justify-center p-2"
                >
                    <div className="w-1 h-2 bg-secondary rounded-full"></div>
                </motion.div>
            </div>
        </section>
    )
}