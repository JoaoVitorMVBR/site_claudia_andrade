"use client"

import AddNewClothing from '@/components/administration/AddNewClothing';

export default function AddProductsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Lista de Produtos
      </h1>
      <AddNewClothing />
    </div>
  );
}