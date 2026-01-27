'use client'

export default function ProductFilters({ filters, categories, onFilterChange, onClearFilters }) {
    const genders = [
        { value: '', label: 'Todos' },
        { value: 'mujer', label: 'Mujer' },
        { value: 'hombre', label: 'Hombre' },
        { value: 'unisex', label: 'Unisex' },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Filtros</h3>
                <button
                    onClick={onClearFilters}
                    className="text-sm text-accent hover:text-primary transition-colors"
                >
                    Limpiar
                </button>
            </div>

            {/* Gender Filter */}
            <div>
                <h4 className="font-medium mb-3">Género</h4>
                <div className="space-y-2">
                    {genders.map((gender) => (
                        <label key={gender.value} className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="genero"
                                value={gender.value}
                                checked={filters.genero === gender.value}
                                onChange={(e) => onFilterChange({ genero: e.target.value })}
                                className="mr-2"
                            />
                            <span className="text-sm">{gender.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Category Filter */}
            <div>
                <h4 className="font-medium mb-3">Categoría</h4>
                <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="categoria"
                            value=""
                            checked={filters.categoria === ''}
                            onChange={() => onFilterChange({ categoria: '' })}
                            className="mr-2"
                        />
                        <span className="text-sm">Todas</span>
                    </label>
                    {categories.map((category) => (
                        <label key={category._id} className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="categoria"
                                value={category._id}
                                checked={filters.categoria === category._id}
                                onChange={(e) => onFilterChange({ categoria: e.target.value })}
                                className="mr-2"
                            />
                            <span className="text-sm">{category.nombre}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Filter */}
            <div>
                <h4 className="font-medium mb-3">Precio</h4>
                <div className="space-y-2">
                    <input
                        type="number"
                        placeholder="Mínimo"
                        value={filters.precioMin}
                        onChange={(e) => onFilterChange({ precioMin: e.target.value })}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                    <input
                        type="number"
                        placeholder="Máximo"
                        value={filters.precioMax}
                        onChange={(e) => onFilterChange({ precioMax: e.target.value })}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                </div>
            </div>
        </div>
    )
}