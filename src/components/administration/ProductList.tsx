import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, Edit, Trash2 } from 'lucide-react';
import { products as initialProducts } from '../../data/products'; // Ajuste o caminho
import { Product } from '../../types'; // Importa o tipo

// Assumindo que você tem uma lista de opções de filtro nos seus dados:
const filterOptions = {
    types: Array.from(new Set(initialProducts.map(p => p.type))),
    colors: Array.from(new Set(initialProducts.map(p => p.color))),
    sizes: Array.from(new Set(initialProducts.map(p => p.size))),
};

// ----------------------------------------------------------------------

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    color: '',
    size: '',
  });

  // Lógica de Filtragem e Busca (mantida)
  const filteredProducts = useMemo(() => {
    let currentProducts = initialProducts;

    if (searchTerm) {
        currentProducts = currentProducts.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    return currentProducts.filter(product => {
        if (filters.type && product.type !== filters.type) return false;
        if (filters.color && product.color !== filters.color) return false;
        if (filters.size && product.size !== filters.size) return false;
        return true;
    });
  }, [searchTerm, filters]);


  // Funções CRUD e Filtro (mantidas)
  const handleEdit = (product: Product) => alert(`Preparando para editar o produto: ${product.name}`);
  
  const handleRemove = (productId: number) => {
    if (window.confirm('Tem certeza que deseja remover esta peça?')) {
      setProducts(products.filter(p => p.id !== productId));
      alert('Peça removida com sucesso!');
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="flex-1 p-4 md:p-8">
      
      {/* 1. Header and Search (Usando Flexbox para o alinhamento do título e futuros botões) */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Listar/Gerenciar Peças
        </h1>
        
        {/* Campo de Busca Principal - Ocupa a largura total no mobile */}
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome ou tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </header>

      {/* 2. Filtros Responsivos (Usando Flexbox e wrap) */}
      <div className="mb-6 flex flex-wrap gap-3"> 
        
          {/* Filtro por Tipo */}
          <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="flex-1 min-w-[120px] py-2 px-3 border border-gray-300 rounded-lg text-sm md:text-base focus:ring-blue-500 focus:border-blue-500"
          >
              <option value="">Todos os Tipos</option>
              {filterOptions.types.map(option => (
                  <option key={option} value={option}>{option}</option>
              ))}
          </select>

          {/* Filtro por Cor */}
          <select
              value={filters.color}
              onChange={(e) => handleFilterChange('color', e.target.value)}
              className="flex-1 min-w-[120px] py-2 px-3 border border-gray-300 rounded-lg text-sm md:text-base focus:ring-blue-500 focus:border-blue-500"
          >
              <option value="">Todas as Cores</option>
              {filterOptions.colors.map(option => (
                  <option key={option} value={option}>{option}</option>
              ))}
          </select>

          {/* Filtro por Tamanho */}
          <select
              value={filters.size}
              onChange={(e) => handleFilterChange('size', e.target.value)}
              className="flex-1 min-w-[120px] py-2 px-3 border border-gray-300 rounded-lg text-sm md:text-base focus:ring-blue-500 focus:border-blue-500"
          >
              <option value="">Todos os Tamanhos</option>
              {filterOptions.sizes.map(option => (
                  <option key={option} value={option}>{option}</option>
              ))}
          </select>
          
          {/* Botão Limpar Filtros (Opcional, ocupando o resto do espaço ou quebrando a linha) */}
          {(filters.type || filters.color || filters.size || searchTerm) && (
              <button
                  onClick={() => { setSearchTerm(''); setFilters({ type: '', color: '', size: '' }); }}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150 min-w-fit"
              >
                  Limpar
              </button>
          )}
      </div>

      {/* 3. Products List - Usando Grid para layout de cards em mobile, tabela em desktop */}
      <div className="md:overflow-x-auto bg-white rounded-lg shadow-md">
        {/* Versão Tabela para telas maiores (md+) */}
        <table className="hidden md:table min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IMAGE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                NOME
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TIPO
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                COR
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TAM
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                {/* Imagem */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="relative h-10 w-10">
                    <Image
                      src={product.image}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.color}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.size}
                </td>
                
                {/* Botões de Ação */}
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                  <button 
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition duration-150"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
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

        {/* Versão Cards para mobile (visível abaixo de md) */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredProducts.map((product) => (
            <div key={product.id} className="p-4 flex items-start gap-4">
              {/* Imagem */}
              <div className="relative h-16 w-16 flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              
              {/* Informações */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                <div className="text-xs text-gray-500 mt-1">
                  <span>Tipo: {product.type}</span> <br />
                  <span>Cor: {product.color}</span> <br />
                  <span>Tamanho: {product.size}</span>
                </div>
              </div>
              
              {/* Ações */}
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleEdit(product)}
                  className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition duration-150"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
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

      {filteredProducts.length === 0 && (
          <p className="mt-8 text-center text-gray-500">
             Nenhuma peça encontrada com os filtros/busca atuais.
          </p>
      )}
    </div>
  );
};

export default ProductList;