'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import SearchModal from '../common/SearchModal'
import SideCart from '../cart/SideCart'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { getCartCount, isSideCartOpen, openSideCart, closeSideCart } = useCart()
    const { user } = useAuth()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navigation = [
        { name: 'Nuevo', href: '/productos?nuevo=true' },
        { name: 'Hombre', href: '/productos?genero=hombre' },
        { name: 'Mujer', href: '/productos?genero=mujer' },
        { name: 'Colecciones', href: '/colecciones' },
        { name: 'Ofertas', href: '/ofertas' },
    ]

    return (
        <>
            {/* Announcement Bar */}
            <div className="bg-black text-white text-center py-2.5 text-sm font-medium">
                <p className="animate-pulse-slow">
                    ✨ Envío gratis en compras mayores a S/ 150 | Código: ENVIOGRATIS
                </p>
            </div>

            {/* Main Header */}
            <header
                className={`bg-white border-b sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'border-gray-300 shadow-md' : 'border-gray-200'
                    }`}
            >
                <nav className="container-custom">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Mobile menu button */}
                        <button
                            className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Menú"
                        >
                            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>

                        {/* Desktop Navigation - Left */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {navigation.slice(0, 2).map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm font-medium text-gray-700 hover:text-black transition-colors uppercase tracking-wider relative group"
                                >
                                    {item.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
                                </Link>
                            ))}
                        </div>

                        {/* Logo */}
                        <Link
                            href="/"
                            className="text-2xl lg:text-3xl font-bold tracking-[0.2em] hover:tracking-[0.25em] transition-all"
                        >
                            KRAZE
                        </Link>

                        {/* Desktop Navigation - Right */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {navigation.slice(2).map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm font-medium text-gray-700 hover:text-black transition-colors uppercase tracking-wider relative group"
                                >
                                    {item.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
                                </Link>
                            ))}
                        </div>

                        {/* Icons */}
                        <div className="flex items-center space-x-4 lg:space-x-6">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Buscar"
                            >
                                <FiSearch size={20} />
                            </button>

                            <Link
                                href={user ? "/mi-cuenta" : "/login"}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative group"
                                aria-label={user ? "Mi cuenta" : "Iniciar sesión"}
                            >
                                <FiUser size={20} />
                                {user && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
                                )}
                            </Link>

                            <button
                                onClick={openSideCart}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                                aria-label="Carrito de compras"
                            >
                                <FiShoppingBag size={20} />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold animate-scale-in">
                                        {getCartCount()}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden py-6 border-t border-gray-200 animate-slide-down">
                            <div className="flex flex-col space-y-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-base font-medium text-gray-700 hover:text-black transition-colors uppercase tracking-wider px-4 py-2 hover:bg-gray-50 rounded-lg"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}

                                {user && (
                                    <>
                                        <hr className="border-gray-200" />
                                        <Link
                                            href="/mi-cuenta"
                                            className="text-base font-medium text-gray-700 hover:text-black transition-colors px-4 py-2 hover:bg-gray-50 rounded-lg"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Mi Cuenta
                                        </Link>
                                        <Link
                                            href="/mis-pedidos"
                                            className="text-base font-medium text-gray-700 hover:text-black transition-colors px-4 py-2 hover:bg-gray-50 rounded-lg"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Mis Pedidos
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </nav>
            </header>

            {/* Search Modal */}
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            {/* Side Cart */}
            <SideCart isOpen={isSideCartOpen} onClose={closeSideCart} />

            <style jsx>{`
                @keyframes scale-in {
                    from {
                        transform: scale(0);
                    }
                    to {
                        transform: scale(1);
                    }
                }
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
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
                @keyframes pulse-slow {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
            `}</style>
        </>
    )
}