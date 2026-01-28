'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiArrowRight, FiTrendingUp } from 'react-icons/fi'

export default function Hero() {
    return (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600)',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
                </div>
            </motion.div>

            {/* Floating Badges */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute top-24 left-8 md:left-16 lg:left-24 z-10"
            >
                <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <FiTrendingUp className="text-green-600" size={18} />
                    <span className="text-sm font-semibold text-gray-900">Nuevos Descuentos</span>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="absolute top-24 right-8 md:right-16 lg:right-24 z-10"
            >
                <div className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg">
                    <span className="text-sm font-bold">Hasta -60%</span>
                </div>
            </motion.div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <span className="inline-block bg-white/10 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/20">
                        Nueva Colección 2026
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                >
                    ESTILO
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                        ATEMPORAL
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-200 leading-relaxed"
                >
                    Descubre nuestra exclusiva colección de moda urbana con descuentos de hasta 60%
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link
                        href="/productos?genero=mujer"
                        className="group bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 w-full sm:w-auto justify-center"
                    >
                        Comprar Mujer
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/productos?genero=hombre"
                        className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm w-full sm:w-auto justify-center"
                    >
                        Comprar Hombre
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="flex flex-wrap justify-center gap-8 mt-16"
                >
                    <div className="text-center">
                        <div className="text-3xl font-bold mb-1">1000+</div>
                        <div className="text-sm text-gray-300">Productos</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold mb-1">5000+</div>
                        <div className="text-sm text-gray-300">Clientes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold mb-1">4.9★</div>
                        <div className="text-sm text-gray-300">Calificación</div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2"
                >
                    <span className="text-white text-xs uppercase tracking-wider">Desliza</span>
                    <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="w-1.5 h-3 bg-white rounded-full"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}