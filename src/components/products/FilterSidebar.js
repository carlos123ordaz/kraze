'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '@/app/config'


export default function FilterSidebar({ filters, onFilterChange }) {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/categories`)
            setCategories(data.categorias || [])
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const genders = [
        { value: '', label: 'Todos' },
        { value: 'mujer', label: 'Mujer' },
        { value: 'hombre', label: 'Hombre' },
        { value: 'unisex', label: 'Unisex' },
    ]

    return (
        <div className="space-y-8">
            {/* Gender */}
            <div>
                <h3 className="font-bold mb-4 uppercase text-sm tracking-wider">Género</h3>
                <div className="space-y-2">
                    {genders.map((gender) => (
                        <label key={gender.value} className="flex items-center cursor-pointer group">
                            <input
                                type="radio"
                                name="genero"
                                value={gender.value}
                                checked={filters.genero === gender.value}
                                onChange={(e) => onFilterChange({ genero: e.target.value })}
                                className="mr-3"
                            />
                            <span className="text-sm group-hover:text-primary transition-colors">
                                {gender.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
                <div>
                    <h3 className="font-bold mb-4 uppercase text-sm tracking-wider">Categoría</h3>
                    <div className="space-y-2">
                        <label className="flex items-center cursor-pointer group">
                            <input
                                type="radio"
                                name="categoria"
                                value=""
                                checked={filters.categoria === ''}
                                onChange={() => onFilterChange({ categoria: '' })}
                                className="mr-3"
                            />
                            <span className="text-sm group-hover:text-primary transition-colors">
                                Todas
                            </span>
                        </label>
                        {categories.map((category) => (
                            <label key={category._id} className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    name="categoria"
                                    value={category._id}
                                    checked={filters.categoria === category._id}
                                    onChange={(e) => onFilterChange({ categoria: e.target.value })}
                                    className="mr-3"
                                />
                                <span className="text-sm group-hover:text-primary transition-colors">
                                    {category.nombre}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Price Range */}
            <div>
                <h3 className="font-bold mb-4 uppercase text-sm tracking-wider">Precio</h3>
                <div className="space-y-3">
                    <input
                        type="number"
                        placeholder="Mínimo S/"
                        value={filters.precioMin}
                        onChange={(e) => onFilterChange({ precioMin: e.target.value })}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                    <input
                        type="number"
                        placeholder="Máximo S/"
                        value={filters.precioMax}
                        onChange={(e) => onFilterChange({ precioMax: e.target.value })}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                </div>
            </div>
        </div>
    )
}