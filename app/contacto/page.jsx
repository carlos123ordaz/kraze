'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiPhone, FiMail, FiMapPin, FiSend, FiInstagram, FiMessageCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
    })
    const [enviando, setEnviando] = useState(false)
    const [enviado, setEnviado] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setEnviando(true)

        // Simular envío (aquí conectarías con tu API)
        setTimeout(() => {
            setEnviando(false)
            setEnviado(true)
            setFormData({
                nombre: '',
                email: '',
                telefono: '',
                asunto: '',
                mensaje: ''
            })

            // Resetear mensaje de éxito después de 5 segundos
            setTimeout(() => setEnviado(false), 5000)
        }, 1500)
    }

    const contactInfo = [
        {
            icon: <FiMessageCircle size={28} />,
            title: 'WhatsApp',
            info: '+51 904 435 631',
            link: 'https://wa.me/51904435631',
            linkText: 'Enviar mensaje',
            color: 'text-[#25D366]',
            bgColor: 'bg-[#25D366]/10'
        },
        {
            icon: <FiInstagram size={28} />,
            title: 'Instagram',
            info: '@kraze_peru',
            link: 'https://www.instagram.com/kraze_peru/',
            linkText: 'Seguir',
            color: 'text-pink-600',
            bgColor: 'bg-pink-600/10'
        },
        {
            icon: <FiMail size={28} />,
            title: 'Email',
            info: 'hola@krazeperu.com',
            link: 'mailto:hola@krazeperu.com',
            linkText: 'Enviar email',
            color: 'text-blue-600',
            bgColor: 'bg-blue-600/10'
        },
        {
            icon: <FiMapPin size={28} />,
            title: 'Ubicación',
            info: 'Lima, Perú',
            link: null,
            linkText: null,
            color: 'text-red-600',
            bgColor: 'bg-red-600/10'
        }
    ]

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-black text-white py-20">
                <div className="container-custom text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            CONTÁCTANOS
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            ¿Tienes alguna pregunta? Estamos aquí para ayudarte. Contáctanos por WhatsApp, Instagram o completa el formulario.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16 bg-gray-50">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                            >
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${item.bgColor} ${item.color} mb-4`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {item.info}
                                </p>
                                {item.link && (
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-2 ${item.color} font-medium hover:underline`}
                                    >
                                        {item.linkText} →
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content - Form & Quick Contact */}
            <section className="py-16">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h2 className="text-3xl font-bold mb-4">Envíanos un mensaje</h2>
                            <p className="text-gray-600 mb-8">
                                Completa el formulario y te responderemos lo antes posible
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-900 mb-2">
                                        Nombre completo *
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        placeholder="Juan Pérez"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                            placeholder="tu@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-900 mb-2">
                                            Teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            id="telefono"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                            placeholder="987 654 321"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="asunto" className="block text-sm font-medium text-gray-900 mb-2">
                                        Asunto *
                                    </label>
                                    <input
                                        type="text"
                                        id="asunto"
                                        name="asunto"
                                        value={formData.asunto}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        placeholder="¿En qué podemos ayudarte?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="mensaje" className="block text-sm font-medium text-gray-900 mb-2">
                                        Mensaje *
                                    </label>
                                    <textarea
                                        id="mensaje"
                                        name="mensaje"
                                        value={formData.mensaje}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                                        placeholder="Escribe tu mensaje aquí..."
                                    />
                                </div>

                                {enviado && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-green-800 font-medium">
                                            ¡Mensaje enviado exitosamente! Te responderemos pronto.
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={enviando}
                                    className="w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {enviando ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            Enviar Mensaje
                                            <FiSend size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>

                        {/* Quick Contact / FAQ */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <div className="sticky top-8">
                                <h2 className="text-3xl font-bold mb-4">Contacto rápido</h2>
                                <p className="text-gray-600 mb-8">
                                    ¿Necesitas una respuesta rápida? Contáctanos directamente:
                                </p>

                                {/* WhatsApp Card */}
                                <a
                                    href="https://wa.me/51904435631?text=Hola,%20tengo%20una%20consulta"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-2xl p-8 mb-6 transition-colors group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <FiMessageCircle size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
                                            <p className="text-green-50 mb-3">
                                                Chatea con nosotros ahora
                                            </p>
                                            <p className="text-2xl font-bold mb-4">+51 904 435 631</p>
                                            <div className="inline-flex items-center gap-2 bg-white text-[#25D366] px-4 py-2 rounded-lg font-medium group-hover:gap-3 transition-all">
                                                Abrir WhatsApp
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </a>

                                {/* Instagram Card */}
                                <a
                                    href="https://www.instagram.com/kraze_peru/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white rounded-2xl p-8 transition-colors group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <FiInstagram size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2">Instagram</h3>
                                            <p className="text-pink-50 mb-3">
                                                Síguenos para ver las últimas novedades
                                            </p>
                                            <p className="text-2xl font-bold mb-4">@kraze_peru</p>
                                            <div className="inline-flex items-center gap-2 bg-white text-pink-600 px-4 py-2 rounded-lg font-medium group-hover:gap-3 transition-all">
                                                Visitar perfil
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </a>

                                {/* FAQ / Info */}
                                <div className="mt-8 bg-gray-50 rounded-2xl p-6">
                                    <h3 className="font-bold text-gray-900 mb-4">Horario de atención</h3>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Lunes a Viernes: 9:00 AM - 8:00 PM
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Sábados: 10:00 AM - 6:00 PM
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                            Domingos: Cerrado
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-black text-white py-16">
                <div className="container-custom text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        ¿Prefieres comprar ahora?
                    </h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Explora nuestra colección completa de productos
                    </p>
                    <Link
                        href="/productos"
                        className="inline-block bg-white text-black px-8 py-4 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                    >
                        Ver Catálogo
                    </Link>
                </div>
            </section>
        </div>
    )
}