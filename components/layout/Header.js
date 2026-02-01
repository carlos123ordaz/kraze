'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import SearchModal from '../common/SearchModal'
import SideCart from '../cart/SideCart'
import Image from 'next/image'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [visible, setVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const { getCartCount, isSideCartOpen, openSideCart, closeSideCart } = useCart()
    const { user } = useAuth()

    useEffect(() => {
        const controlHeader = () => {
            const currentScrollY = window.scrollY

            if (currentScrollY < 10) {
                // Siempre mostrar el header en la parte superior
                setVisible(true)
            } else if (currentScrollY > lastScrollY) {
                // Scrolling hacia abajo - ocultar header
                setVisible(false)
                setMobileMenuOpen(false) // Cerrar menú móvil al hacer scroll
            } else {
                // Scrolling hacia arriba - mostrar header
                setVisible(true)
            }

            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', controlHeader)

        return () => {
            window.removeEventListener('scroll', controlHeader)
        }
    }, [lastScrollY])

    const navigation = [
        { name: 'Inicio', href: '/' },
        { name: 'Catálogo', href: '/productos' },
        // { name: 'Packs', href: '/packs' },
        { name: 'Contacto', href: '/contacto' },
    ]

    return (
        <>
            {/* Main Header - Fondo Negro estilo Savage */}
            <header className={`bg-black text-white sticky top-0 z-50 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'
                }`}>
                <div className="container-custom">
                    <div className="flex items-center justify-between py-6 lg:py-8">
                        {/* Left Icons */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                                aria-label="Buscar"
                            >
                                <FiSearch size={22} className="text-white" />
                            </button>

                            {/* Mobile menu button */}
                            <button
                                className="lg:hidden p-2 hover:bg-gray-800 rounded-full transition-colors"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Menú"
                            >
                                {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                            </button>
                        </div>

                        {/* Logo Central - Estilo Savage */}
                        <Link href="/" className="flex-shrink-0">
                            <div className="text-center">
                                <Image
                                    src="https://storage.googleapis.com/quotizador/productos/Captura%20de%20pantalla%202026-01-28%20220250.png"
                                    alt="Kraze"
                                    width={200}
                                    height={80}
                                    className="h-14 md:h-20 w-auto"
                                    priority
                                />
                            </div>
                        </Link>

                        {/* Right Icons */}
                        <div className="flex items-center gap-4">
                            <Link
                                href={user ? "/account/orders" : "/login"}
                                className="p-2 hover:bg-gray-800 rounded-full transition-colors relative"
                                aria-label={user ? "Mi cuenta" : "Iniciar sesión"}
                            >
                                <FiUser size={22} className="text-white" />
                                {user && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-black"></span>
                                )}
                            </Link>

                            <button
                                onClick={openSideCart}
                                className="p-2 hover:bg-gray-800 rounded-full transition-colors relative"
                                aria-label="Carrito de compras"
                            >
                                <FiShoppingBag size={22} className="text-white" />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                        {getCartCount()}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Navigation Menu - Desktop */}
                    <nav className="hidden lg:block border-t border-gray-800">
                        <ul className="flex items-center justify-center gap-12 py-4">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-white hover:text-gray-300 transition-colors font-medium uppercase tracking-wide"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden py-6 border-t border-gray-800 animate-slide-down">
                            <div className="flex flex-col space-y-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-base font-medium text-white hover:text-gray-300 transition-colors uppercase tracking-wide px-4 py-2 hover:bg-gray-800 rounded-lg"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}

                                {user && (
                                    <>
                                        <hr className="border-gray-800" />
                                        <Link
                                            href="/account/orders"
                                            className="text-base font-medium text-white hover:text-gray-300 transition-colors px-4 py-2 hover:bg-gray-800 rounded-lg"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Mi Cuenta
                                        </Link>
                                        <Link
                                            href="/mis-pedidos"
                                            className="text-base font-medium text-white hover:text-gray-300 transition-colors px-4 py-2 hover:bg-gray-800 rounded-lg"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Mis Pedidos
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Search Modal */}
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            {/* Side Cart */}
            <SideCart isOpen={isSideCartOpen} onClose={closeSideCart} />

            <style jsx>{`
                @keyframes slide-down {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
            `}</style>
        </>
    )
}