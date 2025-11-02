'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Search, Trash2, Loader2, X, Edit } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Product } from '@/types/products';
import { useRouter } from 'next/navigation'; // Para navegação

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');
  const router = useRouter(); // Para navegar ao editar

  const fetchProducts = useCallback(async (cursor: string | null = null, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);

    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    if (currentSearch) params.append('search', currentSearch);

    try {
      const res = await fetch(`/api/clothing/get/?${params}`);
      if (!res.ok) throw new Error('Falha na requisição');
      const data = await res.json();

      const items: Product[] = Array.isArray(data.items) ? data.items : [];

      if (append) {
        setProducts(prev => [...prev, ...items]);
      } else {
        setProducts(items);
      }

      setNextCursor(data.nextCursor || null);
      setHasMore(!!data.nextCursor);
    } catch (error) {
      console.error(error);
      setProducts([]);
      alert('Erro ao carregar vestidos.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [currentSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = () => {
    setCurrentSearch(searchTerm.trim());
    setNextCursor(null);
    setProducts([]);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentSearch, fetchProducts]);

  const loadMore = () => {
    if (nextCursor && !loadingMore) {
      fetchProducts(nextCursor, true);
    }
  };

  const toggleDestaque = async (productId: string, currentValue: boolean) => {
    const highlightedCount = products.filter(p => p.destaque).length;
    if (!currentValue && highlightedCount >= 3) {
      alert('Máximo de 3 itens em destaque permitidos.');
      return;
    }

    try {
      await updateDoc(doc(db, 'clothing', productId), { destaque: !currentValue });
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, destaque: !currentValue } : p));
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar destaque.');
    }
  };

  const handleRemove = async (productId: string) => {
    if (!confirm('Tem certeza?')) return;

    try {
      const res = await fetch(`/api/clothing/${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error('Falha ao deletar: ' + text);
      }

      setProducts(prev => prev.filter(p => p.id !== productId));
      alert('Removido com sucesso!');
    } catch (err: any) {
      console.error('Erro no fetch:', err);
      alert('Erro ao remover');
    }
  };

  const handleEdit = (productId: string) => {
    router.push(`/adm/produtos/update/${productId}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentSearch('');
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
      {/* Header com busca */}
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

      {/* Tabela Desktop */}
      <div className="md:overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="hidden md:table min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider">IMAGEM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider min-w-[150px]">NOME</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider">TIPO</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider">COR</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider">DESTAQUE</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider min-w-[140px]">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(products) && products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-[Poppins-light]">
                  <div className="relative h-10 w-10">
                    <Image
                      src={product.frontImageUrl}
                      alt={product.name}
                      fill
                      className="rounded-full object-cover"
                      sizes="40px"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwkHBgoJCAkLCwoMDxkQDw4ODx4WFxIZJCAmJSMgIyMjKC0fHB4oMjIyKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/2wBDAQoLCw4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4N/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAv/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/8QAFRABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A..."
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-[Poppins-light] text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-[Poppins-light] text-gray-500">{product.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-[Poppins-light] text-gray-500">{product.color}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <input
                    type="checkbox"
                    checked={product.destaque || false}
                    onChange={() => toggleDestaque(product.id, product.destaque || false)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex items-center justify-center gap-2">
                    {/* Botão Editar */}
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition duration-150"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {/* Botão Remover */}
                    <button
                      onClick={() => handleRemove(product.id)}
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

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {Array.isArray(products) && products.map((product) => (
            <div key={product.id} className="p-4 flex items-start gap-4">
              <div className="relative h-16 w-16 flex-shrink-0">
                <Image
                  src={product.frontImageUrl}
                  alt={product.name}
                  fill
                  className="rounded-full object-cover"
                  sizes="64px"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwkHBgoJCAkLCwoMDxkQDw4ODx4WFxIZJCAmJSMgIyMjKC0fHB4oMjIyKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/2wBDAQoLCw4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4N/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAv/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/8QAFRABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A..."
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
                    onChange={() => toggleDestaque(product.id, product.destaque || false)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label className="text-xs text-gray-600">Destaque</label>
                </div>
              </div>
              <div className="flex gap-1">
                {/* Editar (mobile) */}
                <button
                  onClick={() => handleEdit(product.id)}
                  className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition duration-150"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {/* Remover (mobile) */}
                <button
                  onClick={() => handleRemove(product.id)}
                  className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition duration-150"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botão Carregar Mais */}
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

      {/* Mensagem de vazio */}
      {(!Array.isArray(products) || products.length === 0) && !loading && (
        <p className="mt-8 text-center text-gray-500">
          {currentSearch ? `Nenhum vestido encontrado para "${currentSearch}".` : 'Nenhum vestido encontrado.'}
        </p>
      )}
    </div>
  );
};

export default ProductList;