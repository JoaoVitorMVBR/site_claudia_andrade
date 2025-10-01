"use client"

import ProductList from '@/components/administration/ProductList';

export default function ProductsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Lista de Produtos
      </h1>
      <ProductList />
    </div>
  );
}