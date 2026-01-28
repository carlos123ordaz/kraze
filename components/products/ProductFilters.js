'use client'

import { useState, useEffect } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

export default function ProductFilters({ filters, categories, priceRange, onFilterChange, onClearFilters }) {
    const [openSections, setOpenSections] = useState({
        genero: true,
        categoria: true,
        precio: true,
    })

    const [localPriceRange, setLocalPriceRange] = useState({
        min: filters.precioMin || priceRange.min,
        max: filters.precioMax || priceRange.max,
    })

    const [activeThumb, setActiveThumb] = useState(null)

    useEffect(() => {
        setLocalPriceRange({
            min: filters.precioMin || priceRange.min,
            max: filters.precioMax || priceRange.max,
        })
    }, [filters.precioMin, filters.precioMax, priceRange])

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    const genders = [
        { value: '', label: 'Todos' },
        { value: 'mujer', label: 'Mujer' },
        { value: 'hombre', label: 'Hombre' },
        { value: 'unisex', label: 'Unisex' },
    ]

    // Calcular el porcentaje para la visualización del rango
    const getPercent = (value) => {
        return ((value - priceRange.min) / (priceRange.max - priceRange.min)) * 100
    }

    const minPercent = getPercent(localPriceRange.min)
    const maxPercent = getPercent(localPriceRange.max)

    const handleMinChange = (e) => {
        const value = Math.min(Number(e.target.value), localPriceRange.max - 1)
        setLocalPriceRange(prev => ({ ...prev, min: value }))
    }

    const handleMaxChange = (e) => {
        const value = Math.max(Number(e.target.value), localPriceRange.min + 1)
        setLocalPriceRange(prev => ({ ...prev, max: value }))
    }

    const handlePriceChangeComplete = () => {
        setActiveThumb(null)
        onFilterChange({
            precioMin: localPriceRange.min,
            precioMax: localPriceRange.max,
        })
    }

    const handleMinInputChange = (e) => {
        const value = Number(e.target.value)
        if (value >= priceRange.min && value < localPriceRange.max) {
            setLocalPriceRange(prev => ({ ...prev, min: value }))
        }
    }

    const handleMaxInputChange = (e) => {
        const value = Number(e.target.value)
        if (value <= priceRange.max && value > localPriceRange.min) {
            setLocalPriceRange(prev => ({ ...prev, max: value }))
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                    <button
                        onClick={onClearFilters}
                        className="text-sm text-gray-600 hover:text-gray-900 underline transition-colors"
                    >
                        Limpiar todo
                    </button>
                </div>
            </div>

            <div className="divide-y divide-gray-200">
                {/* Gender Filter */}
                <div className="p-6">
                    <button
                        onClick={() => toggleSection('genero')}
                        className="flex items-center justify-between w-full mb-4"
                    >
                        <h4 className="font-semibold text-gray-900">Género</h4>
                        {openSections.genero ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                    </button>

                    {openSections.genero && (
                        <div className="space-y-3">
                            {genders.map((gender) => (
                                <label
                                    key={gender.value}
                                    className="flex items-center cursor-pointer group"
                                >
                                    <input
                                        type="radio"
                                        name="genero"
                                        value={gender.value}
                                        checked={filters.genero === gender.value}
                                        onChange={(e) => onFilterChange({ genero: e.target.value })}
                                        className="w-4 h-4 text-black border-gray-300 focus:ring-2 focus:ring-black cursor-pointer"
                                    />
                                    <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                                        {gender.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Category Filter */}
                <div className="p-6">
                    <button
                        onClick={() => toggleSection('categoria')}
                        className="flex items-center justify-between w-full mb-4"
                    >
                        <h4 className="font-semibold text-gray-900">Categoría</h4>
                        {openSections.categoria ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                    </button>

                    {openSections.categoria && (
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    name="categoria"
                                    value=""
                                    checked={filters.categoria === ''}
                                    onChange={() => onFilterChange({ categoria: '' })}
                                    className="w-4 h-4 text-black border-gray-300 focus:ring-2 focus:ring-black cursor-pointer"
                                />
                                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                                    Todas
                                </span>
                            </label>
                            {categories.map((category) => (
                                <label
                                    key={category._id}
                                    className="flex items-center cursor-pointer group"
                                >
                                    <input
                                        type="radio"
                                        name="categoria"
                                        value={category._id}
                                        checked={filters.categoria === category._id}
                                        onChange={(e) => onFilterChange({ categoria: e.target.value })}
                                        className="w-4 h-4 text-black border-gray-300 focus:ring-2 focus:ring-black cursor-pointer"
                                    />
                                    <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                                        {category.nombre}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price Range Filter */}
                <div className="p-6">
                    <button
                        onClick={() => toggleSection('precio')}
                        className="flex items-center justify-between w-full mb-4"
                    >
                        <h4 className="font-semibold text-gray-900">Precio</h4>
                        {openSections.precio ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                    </button>

                    {openSections.precio && (
                        <div className="space-y-6">
                            {/* Price Display */}
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-700 font-medium">
                                    S/ {localPriceRange.min}
                                </span>
                                <span className="text-gray-400">—</span>
                                <span className="text-gray-700 font-medium">
                                    S/ {localPriceRange.max}
                                </span>
                            </div>

                            {/* Dual Range Slider Container */}
                            <div className="relative h-2 mb-2">
                                {/* Track Background */}
                                <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>

                                {/* Active Range */}
                                <div
                                    className="absolute h-2 bg-black rounded-full pointer-events-none"
                                    style={{
                                        left: `${minPercent}%`,
                                        width: `${maxPercent - minPercent}%`,
                                    }}
                                ></div>

                                {/* Min Range Input */}
                                <input
                                    type="range"
                                    min={priceRange.min}
                                    max={priceRange.max}
                                    step="1"
                                    value={localPriceRange.min}
                                    onChange={handleMinChange}
                                    onMouseDown={() => setActiveThumb('min')}
                                    onMouseUp={handlePriceChangeComplete}
                                    onTouchStart={() => setActiveThumb('min')}
                                    onTouchEnd={handlePriceChangeComplete}
                                    className="range-slider-min"
                                    style={{ zIndex: activeThumb === 'min' ? 5 : 3 }}
                                />

                                {/* Max Range Input */}
                                <input
                                    type="range"
                                    min={priceRange.min}
                                    max={priceRange.max}
                                    step="1"
                                    value={localPriceRange.max}
                                    onChange={handleMaxChange}
                                    onMouseDown={() => setActiveThumb('max')}
                                    onMouseUp={handlePriceChangeComplete}
                                    onTouchStart={() => setActiveThumb('max')}
                                    onTouchEnd={handlePriceChangeComplete}
                                    className="range-slider-max"
                                    style={{ zIndex: activeThumb === 'max' ? 5 : 4 }}
                                />
                            </div>

                            {/* Price Inputs */}
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Mínimo</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                            S/
                                        </span>
                                        <input
                                            type="number"
                                            min={priceRange.min}
                                            max={localPriceRange.max - 1}
                                            value={localPriceRange.min}
                                            onChange={handleMinInputChange}
                                            onBlur={handlePriceChangeComplete}
                                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Máximo</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                            S/
                                        </span>
                                        <input
                                            type="number"
                                            min={localPriceRange.min + 1}
                                            max={priceRange.max}
                                            value={localPriceRange.max}
                                            onChange={handleMaxInputChange}
                                            onBlur={handlePriceChangeComplete}
                                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .range-slider-min,
                .range-slider-max {
                    position: absolute;
                    width: 100%;
                    height: 8px;
                    top: 0;
                    left: 0;
                    appearance: none;
                    -webkit-appearance: none;
                    background: transparent;
                    pointer-events: none;
                    cursor: pointer;
                }

                .range-slider-min::-webkit-slider-thumb,
                .range-slider-max::-webkit-slider-thumb {
                    appearance: none;
                    -webkit-appearance: none;
                    pointer-events: auto;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #000;
                    cursor: grab;
                    border: 3px solid #fff;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                    transition: transform 0.1s ease, box-shadow 0.1s ease;
                }

                .range-slider-min::-moz-range-thumb,
                .range-slider-max::-moz-range-thumb {
                    pointer-events: auto;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #000;
                    cursor: grab;
                    border: 3px solid #fff;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                    transition: transform 0.1s ease, box-shadow 0.1s ease;
                }

                .range-slider-min:active::-webkit-slider-thumb,
                .range-slider-max:active::-webkit-slider-thumb {
                    cursor: grabbing;
                    transform: scale(1.1);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }

                .range-slider-min:active::-moz-range-thumb,
                .range-slider-max:active::-moz-range-thumb {
                    cursor: grabbing;
                    transform: scale(1.1);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }

                .range-slider-min::-webkit-slider-thumb:hover,
                .range-slider-max::-webkit-slider-thumb:hover {
                    transform: scale(1.05);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }

                .range-slider-min::-moz-range-thumb:hover,
                .range-slider-max::-moz-range-thumb:hover {
                    transform: scale(1.05);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }

                .range-slider-min:focus,
                .range-slider-max:focus {
                    outline: none;
                }

                .range-slider-min::-webkit-slider-runnable-track,
                .range-slider-max::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 8px;
                    cursor: pointer;
                }

                .range-slider-min::-moz-range-track,
                .range-slider-max::-moz-range-track {
                    width: 100%;
                    height: 8px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    )
}