'use client';

import React from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProductList } from './hooks/useProductList';
import { ProductTable } from './components/ProductList/ProductTable';
import { ProductCard } from './components/ProductList/ProductCard';

const ProductList: React.FC = () => {
  const router = useRouter();
  const {
    products,
    loading,
    loadingMore,
    hasMore,
    searchTerm,
    currentSearch,
    setSearchTerm,
    handleSearch,
    clearSearch,
    loadMore,
    toggleDestaque,
    handleRemove,
  } = useProductList();

  const handleEdit = (productId: string) => {
    router.push(`/adm/produtos/update/${productId}`);
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex-1 p-8 text-center">
        <Loader2 className="mx-auto animate-spin w-8 h-8 text-blue-600" />
        <p className="text-gray-500 mt-2">Carregando vestidos...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 font-[Poppins-light]">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Listar/Gerenciar Vestidos
        </h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Poppins-light]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-600 hover:text-blue-800"
              title="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          {currentSearch && (
            <button onClick={clearSearch} className="p-2 text-gray-500 hover:text-gray-700" title="Limpar busca">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      <div className="md:overflow-x-auto bg-white rounded-lg shadow-md">
        <ProductTable
          products={products}
          onToggleDestaque={toggleDestaque}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />

        <div className="md:hidden divide-y divide-gray-200">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggleDestaque={toggleDestaque}
              onEdit={handleEdit}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </div>

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Carregando...
              </>
            ) : (
              'Carregar mais'
            )}
          </button>
        </div>
      )}

      {(!Array.isArray(products) || products.length === 0) && !loading && (
        <p className="mt-8 text-center text-gray-500">
          {currentSearch ? `Nenhum vestido encontrado para "${currentSearch}".` : 'Nenhum vestido encontrado.'}
        </p>
      )}
    </div>
  );
};

export default ProductList;
