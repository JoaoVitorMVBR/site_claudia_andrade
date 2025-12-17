import React from "react";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import { Product } from "@/types/products";

interface ProductCardProps {
  product: Product;
  onToggleDestaque: (productId: string, currentValue: boolean) => void;
  onEdit: (productId: string) => void;
  onRemove: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onToggleDestaque,
  onEdit,
  onRemove,
}) => {
  return (
    <div className="p-4 flex items-start gap-4">
      <div className="relative h-16 w-16 flex-shrink-0">
        <Image
          src={product.frontImageUrl}
          alt={product.name}
          fill
          className="rounded-full object-cover"
          sizes="64px"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
        <div className="text-xs text-gray-500 mt-1">
          <span>Tipo: {product.type}</span> <br />
          <span>Cor: {product.color}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="checkbox"
            checked={product.destaque || false}
            onChange={() => onToggleDestaque(product.id, product.destaque || false)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label className="text-xs text-gray-600">Destaque</label>
        </div>
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onEdit(product.id)}
          className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition duration-150"
          title="Editar"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onRemove(product.id)}
          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition duration-150"
          title="Remover"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
