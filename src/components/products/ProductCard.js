import Link from 'next/link'
import Image from 'next/image'

export default function ProductCard({ product }) {
    return (
        <Link href={`/producto/${product.slug || product._id}`} className="group">
            <div className="relative aspect-[3/4] overflow-hidden bg-light-gray mb-3">
                <Image
                    src={product.imagenesPrincipales?.[0]?.url || '/placeholder.jpg'}
                    alt={product.nombre}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.nuevo && (
                    <span className="absolute top-4 left-4 bg-primary text-secondary px-3 py-1 text-xs uppercase tracking-wide">
                        Nuevo
                    </span>
                )}
                {product.descuento?.activo && (
                    <span className="absolute top-4 right-4 bg-red-600 text-secondary px-3 py-1 text-xs uppercase tracking-wide">
                        -{product.descuento.porcentaje}%
                    </span>
                )}
            </div>
            <div>
                <p className="text-xs text-accent uppercase tracking-wide mb-1">
                    {product.categoria?.nombre || 'Sin categoría'}
                </p>
                <h3 className="font-medium mb-2">{product.nombre}</h3>
                <div className="flex items-center gap-2">
                    {product.descuento?.activo ? (
                        <>
                            <span className="text-accent line-through">S/ {product.precio.toFixed(2)}</span>
                            <span className="font-bold">
                                S/ {(product.precio * (1 - product.descuento.porcentaje / 100)).toFixed(2)}
                            </span>
                        </>
                    ) : (
                        <span className="font-bold">S/ {product.precio.toFixed(2)}</span>
                    )}
                </div>
            </div>
        </Link>
    )
}