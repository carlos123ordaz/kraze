'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                const { data } = await axios.get(`${API_URL}/auth/perfil`)
                setUser(data.usuario)
            } catch (error) {
                localStorage.removeItem('token')
                delete axios.defaults.headers.common['Authorization']
            }
        }
        setLoading(false)
    }

    const login = async (email, password) => {
        const { data } = await axios.post(`${API_URL}/auth/login`, { email, password })
        localStorage.setItem('token', data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        setUser(data.usuario)
        return data
    }

    const register = async (userData) => {
        const { data } = await axios.post(`${API_URL}/auth/registrar`, userData)
        localStorage.setItem('token', data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        setUser(data.usuario)
        return data
    }

    const logout = () => {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider')
    }
    return context
}