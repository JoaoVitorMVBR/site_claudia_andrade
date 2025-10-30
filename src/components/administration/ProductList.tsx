'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Search, Trash2, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Product } from '@/types/products';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: '', color: '', size: '' });

  // Fetch com debounce
  const fetchProducts = useCallback(async (cursor: string | null = null, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);

    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    if (searchTerm) params.append('search', searchTerm);
    if (filters.type) params.append('type', filters.type);
    if (filters.color) params.append('color', filters.color);
    if (filters.size) params.append('size', filters.size);

    try {
      const res = await fetch(`/api/?${params}`);
      if (!res.ok) throw new Error('Falha na requisição');

      const data = await res.json();

      // GARANTE QUE items SEMPRE SEJA UM ARRAY
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
      setProducts([]); // ← sempre array em caso de erro
      alert('Erro ao carregar vestidos.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchTerm, filters]);

  // Carregar inicial
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounce na busca/filtro
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts([]);
      setNextCursor(null);
      fetchProducts();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, filters, fetchProducts]);

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

    console.log('Chamando DELETE para ID:', productId);

    try {
      const res = await fetch(`/api/clothing/${productId}`, {
        method: 'DELETE',
      });

      console.log('Resposta da API:', res.status, res.ok);

      if (!res.ok) {
        const text = await res.text();
        console.error('Erro da API:', text);
        throw new Error('Falha ao deletar');
      }

      setProducts(prev => prev.filter(p => p.id !== productId));
      alert('Removido com sucesso!');
    } catch (err: any) {
      console.error('Erro no fetch:', err);
      alert('Erro ao remover');
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filterOptions = useMemo(() => {
    const types = Array.from(new Set(products.map(p => p.type))).sort();
    const colors = Array.from(new Set(products.map(p => p.color))).sort();
    const sizes = Array.from(new Set(products.map(p => p.size))).sort();
    return { types, colors, sizes };
  }, [products]);

  const filteredProducts = products; // já filtrado no backend

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
      {/* Header e Filtros */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 font-[Poppins-light]">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Listar/Gerenciar Vestidos
        </h1>
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome ou tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Poppins-light]"
          />
        </div>
      </header>

      <div className="mb-6 flex flex-wrap gap-3">
        <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)} className="flex-1 min-w-[120px] py-2 px-3 border border-gray-300 rounded-lg text-sm md:text-base focus:ring-blue-500 focus:border-blue-500 font-[Poppins-light]">
          <option value="">Todos os Tipos</option>
          {filterOptions.types.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={filters.color} onChange={(e) => handleFilterChange('color', e.target.value)} className="flex-1 min-w-[120px] py-2 px-3 border border-gray-300 rounded-lg text-sm md:text-base focus:ring-blue-500 focus:border-blue-500 font-[Poppins-light]">
          <option value="">Todas as Cores</option>
          {filterOptions.colors.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={filters.size} onChange={(e) => handleFilterChange('size', e.target.value)} className="flex-1 min-w-[120px] py-2 px-3 border border-gray-300 rounded-lg text-sm md:text-base focus:ring-blue-500 focus:border-blue-500 font-[Poppins-light]">
          <option value="">Todos os Tamanhos</option>
          {filterOptions.sizes.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {(filters.type || filters.color || filters.size || searchTerm) && (
          <button onClick={() => { setSearchTerm(''); setFilters({ type: '', color: '', size: '' }); }} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150 min-w-fit font-[Poppins-light]">
            Limpar
          </button>
        )}
      </div>

      {/* Tabela e Cards */}
      <div className="md:overflow-x-auto bg-white rounded-lg shadow-md">
        {/* Tabela Desktop */}
        <table className="hidden md:table min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider">IMAGEM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider min-w-[150px]">NOME</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider">TIPO</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider">COR</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider">TAM</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider">DESTAQUE</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider min-w-[100px]">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* PROTEÇÃO: só faz map se for array */}
            {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-[Poppins-light] text-gray-500">{product.size}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <input
                    type="checkbox"
                    checked={product.destaque || false}
                    onChange={() => toggleDestaque(product.id, product.destaque || false)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button onClick={() => handleRemove(product.id)} className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition duration-150" title="Remover">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {/* MESMA PROTEÇÃO NO MOBILE */}
          {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
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
                  <span>Cor: {product.color}</span> <br />
                  <span>Tamanho: {product.size}</span>
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
              <div>
                <button onClick={() => handleRemove(product.id)} className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition duration-150" title="Remover">
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

      {/* Mensagem de vazio ou erro */}
      {(!Array.isArray(filteredProducts) || filteredProducts.length === 0) && !loading && (
        <p className="mt-8 text-center text-gray-500">Nenhum vestido encontrado.</p>
      )}
    </div>
  );
};

export default ProductList;