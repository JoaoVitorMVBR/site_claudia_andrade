'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Search, Edit, Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Tipo do produto (ajuste se necessário)
interface Product {
  id: string;
  name: string;
  type: string;
  color: string;
  size: string;
  frontImageUrl: string;
  backImageUrl: string;
  destaque?: boolean;
  createdAt?: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    color: '',
    size: '',
  });

  // CARREGA TODOS OS VESTIDOS DO FIRESTORE EM TEMPO REAL
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'clothing'),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(data);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao carregar produtos:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // FILTRAGEM E BUSCA
  const filteredProducts = useMemo(() => {
    let current = products;

    if (searchTerm) {
      current = current.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return current.filter(p => {
      if (filters.type && p.type !== filters.type) return false;
      if (filters.color && p.color !== filters.color) return false;
      if (filters.size && p.size !== filters.size) return false;
      return true;
    });
  }, [products, searchTerm, filters]);

  // LIMITE DE 3 DESTAQUES
  const toggleDestaque = async (productId: string, currentValue: boolean) => {
    const highlightedCount = products.filter(p => p.destaque).length;

    if (!currentValue && highlightedCount >= 3) {
      alert('Máximo de 3 itens em destaque permitidos.');
      return;
    }

    try {
      await updateDoc(doc(db, 'clothing', productId), {
        destaque: !currentValue,
      });
    } catch (error) {
      console.error('Erro ao atualizar destaque:', error);
      alert('Erro ao salvar destaque.');
    }
  };

  // REMOVER VESTIDO
  const handleRemove = async (productId: string) => {
    if (!window.confirm('Tem certeza que deseja remover este vestido?')) return;

    try {
      await deleteDoc(doc(db, 'clothing', productId));
      alert('Vestido removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover:', error);
      alert('Erro ao remover o vestido.');
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // OPÇÕES DE FILTRO (dinâmicas do banco)
  const filterOptions = useMemo(() => {
    const types = Array.from(new Set(products.map(p => p.type))).sort();
    const colors = Array.from(new Set(products.map(p => p.color))).sort();
    const sizes = Array.from(new Set(products.map(p => p.size))).sort();
    return { types, colors, sizes };
  }, [products]);

  if (loading) {
    return (
      <div className="flex-1 p-8 text-center">
        <p className="text-gray-500">Carregando vestidos...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8">
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

      {/* FILTROS */}
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="flex-1 min-w-[120px] py-2 px-3 border border-gray-300 rounded-lg text-sm md:text-base focus:ring-blue-500 focus:border-blue-500 font-[Poppins-light]"
        >
          <option value="">Todos os Tipos</option>
          {filterOptions.types.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select
          value={filters.color}
          onChange={(e) => handleFilterChange('color', e.target.value)}
          className="flex-1 min-w-[120px] py-2 px-3 border border-gray-300 rounded-lg text-sm md:text-base focus:ring-blue-500 focus:border-blue-500 font-[Poppins-light]"
        >
          <option value="">Todas as Cores</option>
          {filterOptions.colors.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select
          value={filters.size}
          onChange={(e) => handleFilterChange('size', e.target.value)}
          className="flex-1 min-w-[120px] py-2 px-3 border border-gray-300 rounded-lg text-sm md:text-base focus:ring-blue-500 focus:border-blue-500 font-[Poppins-light]"
        >
          <option value="">Todos os Tamanhos</option>
          {filterOptions.sizes.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {(filters.type || filters.color || filters.size || searchTerm) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({ type: '', color: '', size: '' });
            }}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150 min-w-fit font-[Poppins-light]"
          >
            Limpar
          </button>
        )}
      </div>

      {/* LISTA */}
      <div className="md:overflow-x-auto bg-white rounded-lg shadow-md">
        {/* TABELA DESKTOP */}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider">
                TAM
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider">
                DESTAQUE
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase font-[Poppins-light] tracking-wider min-w-[100px]">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                {/* IMAGEM DA FRENTE */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-[Poppins-light]">
                  <div className="relative h-10 w-10">
                    <Image
                      src={product.frontImageUrl}
                      alt={product.name}
                      fill
                      className="rounded-full object-cover"
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-[Poppins-light] text-gray-500">
                  {product.size}
                </td>
                {/* CHECKBOX DESTAQUE */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <input
                    type="checkbox"
                    checked={product.destaque || false}
                    onChange={() => toggleDestaque(product.id, product.destaque || false)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition duration-150"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* CARDS MOBILE */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredProducts.map((product) => (
            <div key={product.id} className="p-4 flex items-start gap-4">
              <div className="relative h-16 w-16 flex-shrink-0">
                <Image
                  src={product.frontImageUrl}
                  alt={product.name}
                  fill
                  className="rounded-full object-cover"
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
                    id={`destaque-${product.id}`}
                    checked={product.destaque || false}
                    onChange={() => toggleDestaque(product.id, product.destaque || false)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`destaque-${product.id}`} className="text-xs text-gray-600">
                    Destaque
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-2">
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

      {filteredProducts.length === 0 && !loading && (
        <p className="mt-8 text-center text-gray-500">
          Nenhum vestido encontrado.
        </p>
      )}
    </div>
  );
};

export default ProductList;