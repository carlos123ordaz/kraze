'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import SearchModal from '../common/SearchModal'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const { getCartCount } = useCart()

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
            <div className="bg-primary text-secondary text-center py-2 text-sm">
                <p>Envío gratis en compras mayores a S/ 150</p>
            </div>

            {/* Main Header */}
            <header className="bg-secondary border-b border-gray-200 sticky top-0 z-50">
                <nav className="container-custom">
                    <div className="flex items-center justify-between h-16">
                        {/* Mobile menu button */}
                        <button
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-8">
                            {navigation.slice(0, 2).map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm font-medium hover:text-accent transition-colors uppercase tracking-wide"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Logo */}
                        <Link href="/" className="text-2xl font-serif font-bold tracking-wider">
                            KRAZE
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-8">
                            {navigation.slice(2).map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm font-medium hover:text-accent transition-colors uppercase tracking-wide"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Icons */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="hover:text-accent transition-colors"
                            >
                                <FiSearch size={20} />
                            </button>
                            <Link href="/login" className="hover:text-accent transition-colors">
                                <FiUser size={20} />
                            </Link>
                            <Link href="/carrito" className="hover:text-accent transition-colors relative">
                                <FiShoppingBag size={20} />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-secondary text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                        {getCartCount()}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200">
                            <div className="flex flex-col space-y-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-sm font-medium hover:text-accent transition-colors uppercase tracking-wide"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </nav>
            </header>

            {/* Search Modal */}
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    )
}