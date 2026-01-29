'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
    const [cart, setCart] = useState([])
    const [isSideCartOpen, setIsSideCartOpen] = useState(false)

    // Cargar carrito del localStorage al iniciar
    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            setCart(JSON.parse(savedCart))
        }
    }, [])

    // Guardar carrito en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    // Función normal: agrega al carrito Y abre el sidebar
    const addToCart = (product, variant, quantity = 1) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) =>
                    item.product._id === product._id &&
                    item.variant.talla === variant.talla &&
                    item.variant.color.codigoHex === variant.color.codigoHex
            )

            if (existingItem) {
                return prevCart.map((item) =>
                    item.product._id === product._id &&
                        item.variant.talla === variant.talla &&
                        item.variant.color.codigoHex === variant.color.codigoHex
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }

            return [...prevCart, { product, variant, quantity }]
        })

        // Abrir el carrito lateral cuando se agrega un producto
        setIsSideCartOpen(true)
    }

    // Función silenciosa: agrega al carrito SIN abrir el sidebar
    // Útil para "Comprar Ahora" donde se redirige directo al checkout
    const addToCartSilent = (product, variant, quantity = 1) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) =>
                    item.product._id === product._id &&
                    item.variant.talla === variant.talla &&
                    item.variant.color.codigoHex === variant.color.codigoHex
            )

            if (existingItem) {
                return prevCart.map((item) =>
                    item.product._id === product._id &&
                        item.variant.talla === variant.talla &&
                        item.variant.color.codigoHex === variant.color.codigoHex
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }

            return [...prevCart, { product, variant, quantity }]
        })

        // NO abrir el carrito lateral
    }

    const openSideCart = () => setIsSideCartOpen(true)
    const closeSideCart = () => setIsSideCartOpen(false)

    const removeFromCart = (productId, variantId) => {
        setCart((prevCart) =>
            prevCart.filter(
                (item) => !(item.product._id === productId && item.variant._id === variantId)
            )
        )
    }

    const updateQuantity = (productId, variantId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId, variantId)
            return
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.product._id === productId && item.variant._id === variantId
                    ? { ...item, quantity }
                    : item
            )
        )
    }

    const clearCart = () => {
        setCart([])
    }

    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            const precio = item.product.descuento?.activo
                ? item.product.precio * (1 - item.product.descuento.porcentaje / 100)
                : item.product.precio
            return total + precio * item.quantity
        }, 0)
    }

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0)
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                addToCartSilent, // Nueva función
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
                isSideCartOpen,
                openSideCart,
                closeSideCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart debe ser usado dentro de CartProvider')
    }
    return context
}