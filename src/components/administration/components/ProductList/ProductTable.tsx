import React from "react";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import { Product } from "@/types/products";

interface ProductTableProps {
  products: Product[];
  onToggleDestaque: (productId: string, currentValue: boolean) => void;
  onEdit: (productId: string) => void;
  onRemove: (productId: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onToggleDestaque,
  onEdit,
  onRemove,
}) => {
  return (
    <table className="hidden md:table min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider">
            IMAGEM
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider min-w-[150px]">
            NOME
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider">
            TIPO
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider">
            COR
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider">
            DESTAQUE
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider min-w-[140px]">
            AÇÕES
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.map((product) => (
          <tr key={product.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-[Poppins-light]">
              <div className="relative h-10 w-10">
                <Image
                  src={product.frontImageUrl}
                  alt={product.name}
                  fill
                  className="rounded-full object-cover"
                  sizes="40px"
                />
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-[Poppins-light] text-gray-900">
              {product.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-[Poppins-light] text-gray-500">
              {product.type}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-[Poppins-light] text-gray-500">
              {product.color}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
              <input
                type="checkbox"
                checked={product.destaque || false}
                onChange={() => onToggleDestaque(product.id, product.destaque || false)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
              <div className="flex items-center justify-center gap-2">
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
