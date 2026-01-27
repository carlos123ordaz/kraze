import Link from 'next/link'
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi'

export default function Footer() {
    return (
        <footer className="bg-primary text-secondary mt-20">
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo y Descripción */}
                    <div>
                        <h3 className="text-2xl font-serif font-bold mb-4">KRAZE</h3>
                        <p className="text-sm text-gray-300 mb-4">
                            Moda urbana con estilo único. Descubre las últimas tendencias.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-accent transition-colors">
                                <FiFacebook size={20} />
                            </a>
                            <a href="#" className="hover:text-accent transition-colors">
                                <FiInstagram size={20} />
                            </a>
                            <a href="#" className="hover:text-accent transition-colors">
                                <FiTwitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Comprar */}
                    <div>
                        <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Comprar</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/productos?genero=mujer" className="hover:text-accent transition-colors">
                                    Mujer
                                </Link>
                            </li>
                            <li>
                                <Link href="/productos?genero=hombre" className="hover:text-accent transition-colors">
                                    Hombre
                                </Link>
                            </li>
                            <li>
                                <Link href="/colecciones" className="hover:text-accent transition-colors">
                                    Colecciones
                                </Link>
                            </li>
                            <li>
                                <Link href="/ofertas" className="hover:text-accent transition-colors">
                                    Ofertas
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Ayuda */}
                    <div>
                        <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Ayuda</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/contacto" className="hover:text-accent transition-colors">
                                    Contacto
                                </Link>
                            </li>
                            <li>
                                <Link href="/envios" className="hover:text-accent transition-colors">
                                    Envíos y Devoluciones
                                </Link>
                            </li>
                            <li>
                                <Link href="/guia-tallas" className="hover:text-accent transition-colors">
                                    Guía de Tallas
                                </Link>
                            </li>
                            <li>
                                <Link href="/mi-cuenta" className="hover:text-accent transition-colors">
                                    Mi Cuenta
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-sm font-bold mb-4 uppercase tracking-wider">Newsletter</h4>
                        <p className="text-sm text-gray-300 mb-4">
                            Recibe ofertas exclusivas y novedades
                        </p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Email"
                                className="bg-transparent border border-secondary text-secondary px-4 py-2 text-sm w-full focus:outline-none"
                            />
                            <button type="submit" className="bg-secondary text-primary px-4 py-2 text-sm font-bold hover:bg-accent transition-colors">
                                →
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-300">
                    <p>© 2026 Kraze Store. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}