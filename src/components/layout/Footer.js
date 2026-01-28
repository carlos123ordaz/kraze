'use client'

import Link from 'next/link'
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin, FiCreditCard, FiShield, FiTruck } from 'react-icons/fi'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-900 text-white mt-20">
            {/* Newsletter Section */}
            <div className="bg-black border-b border-gray-800">
                <div className="container-custom py-12">
                    <div className="max-w-4xl mx-auto text-center">
                        <h3 className="text-2xl md:text-3xl font-bold mb-3">
                            Suscríbete a Nuestro Newsletter
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Recibe ofertas exclusivas, novedades y tendencias directamente en tu correo
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                            <input
                                type="email"
                                placeholder="Tu correo electrónico"
                                className="flex-1 bg-gray-800 border border-gray-700 text-white px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-white text-black px-8 py-4 rounded-lg font-bold hover:bg-gray-200 transition-colors whitespace-nowrap"
                            >
                                Suscribirse
                            </button>
                        </form>
                        <p className="text-xs text-gray-500 mt-4">
                            Al suscribirte, aceptas recibir correos de marketing. Puedes cancelar en cualquier momento.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Logo y Descripción */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block mb-4">
                            <h3 className="text-3xl font-bold tracking-[0.2em] hover:tracking-[0.25em] transition-all">
                                KRAZE
                            </h3>
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Moda urbana con estilo único. Descubre las últimas tendencias y expresa tu personalidad a través de la ropa.
                        </p>

                        {/* Social Media */}
                        <div className="flex items-center gap-3 mb-6">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-all"
                                aria-label="Facebook"
                            >
                                <FiFacebook size={18} />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-all"
                                aria-label="Instagram"
                            >
                                <FiInstagram size={18} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-all"
                                aria-label="Twitter"
                            >
                                <FiTwitter size={18} />
                            </a>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <FiMail size={16} />
                                <a href="mailto:hola@krazestore.com" className="hover:text-white transition-colors">
                                    hola@krazestore.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiPhone size={16} />
                                <a href="tel:+51987654321" className="hover:text-white transition-colors">
                                    +51 987 654 321
                                </a>
                            </div>
                            <div className="flex items-start gap-2">
                                <FiMapPin size={16} className="mt-0.5" />
                                <span>Av. Larco 1234, Miraflores<br />Lima, Perú</span>
                            </div>
                        </div>
                    </div>

                    {/* Comprar */}
                    <div>
                        <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Comprar</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/productos?genero=mujer" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></span>
                                    Mujer
                                </Link>
                            </li>
                            <li>
                                <Link href="/productos?genero=hombre" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></span>
                                    Hombre
                                </Link>
                            </li>
                            <li>
                                <Link href="/productos?nuevo=true" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></span>
                                    Nuevos
                                </Link>
                            </li>
                            <li>
                                <Link href="/colecciones" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></span>
                                    Colecciones
                                </Link>
                            </li>
                            <li>
                                <Link href="/ofertas" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></span>
                                    Ofertas
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Ayuda */}
                    <div>
                        <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Ayuda</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/contacto" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></span>
                                    Contacto
                                </Link>
                            </li>
                            <li>
                                <Link href="/envios" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></span>
                                    Envíos y Devoluciones
                                </Link>
                            </li>
                            <li>
                                <Link href="/guia-tallas" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></span>
                                    Guía de Tallas
                                </Link>
                            </li>
                            <li>
                                <Link href="/mi-cuenta" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></span>
                                    Mi Cuenta
                                </Link>
                            </li>
                            <li>
                                <Link href="/preguntas-frecuentes" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></span>
                                    Preguntas Frecuentes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/terminos" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></span>
                                    Términos y Condiciones
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacidad" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></span>
                                    Política de Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></span>
                                    Política de Cookies
                                </Link>
                            </li>
                            <li>
                                <Link href="/libro-reclamaciones" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></span>
                                    Libro de Reclamaciones
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-gray-800">
                <div className="container-custom py-8">
                    <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <FiTruck size={20} />
                            <span>Envío Seguro</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiShield size={20} />
                            <span>Compra Protegida</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiCreditCard size={20} />
                            <span>Pagos Seguros</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container-custom py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                        <p>© {currentYear} Kraze Store. Todos los derechos reservados.</p>
                        <div className="flex items-center gap-6">
                            <span>Hecho con ❤️ en Perú</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}