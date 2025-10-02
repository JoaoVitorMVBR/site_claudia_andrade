'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  nome: string;
  marca: string;
  codigoProduto: string;
  preco: number;
  cor: string;
  tamanho: string;
  comprimento: string;
  tipoManga: string;
  detalhesBordado: string;
  descricao: string;
  slug: string;
  imagemFrontal: File | null;
  imagemTraseira: File | null;
}

const UploadPage: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    marca: '',
    codigoProduto: '',
    preco: 0,
    cor: '',
    tamanho: '',
    comprimento: '',
    tipoManga: '',
    detalhesBordado: '',
    descricao: '',
    slug: '',
    imagemFrontal: null,
    imagemTraseira: null,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
      setIsAuthenticated(isLoggedIn);
      if (!isLoggedIn) {
        router.push('/admin/login');
      }
    }
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    router.push('/admin/login');
  };

  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700 text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Upload de Vestido
          </h2>
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-300"
          >
            Logout
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-lg shadow-md">
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-700"
            >
              Nome do Vestido *
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleInputChange}
              required
              placeholder="Ex.: Vestido Vitória"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="marca"
              className="block text-sm font-medium text-gray-700"
            >
              Marca *
            </label>
            <input
              id="marca"
              name="marca"
              type="text"
              value={formData.marca}
              onChange={handleInputChange}
              required
              placeholder="Ex.: Ateliê Sofia"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="codigoProduto"
              className="block text-sm font-medium text-gray-700"
            >
              Código do Produto *
            </label>
            <input
              id="codigoProduto"
              name="codigoProduto"
              type="text"
              value={formData.codigoProduto}
              onChange={handleInputChange}
              required
              placeholder="Ex.: VIT-001"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="preco"
              className="block text-sm font-medium text-gray-700"
            >
              Preço (R$) *
            </label>
            <input
              id="preco"
              name="preco"
              type="number"
              step="0.01"
              value={formData.preco}
              onChange={handleInputChange}
              required
              placeholder="Ex.: 399.90"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="cor"
              className="block text-sm font-medium text-gray-700"
            >
              Cor Principal *
            </label>
            <input
              id="cor"
              name="cor"
              type="text"
              value={formData.cor}
              onChange={handleInputChange}
              required
              placeholder="Ex.: Vermelho"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="tamanho"
              className="block text-sm font-medium text-gray-700"
            >
              Tamanho *
            </label>
            <input
              id="tamanho"
              name="tamanho"
              type="text"
              value={formData.tamanho}
              onChange={handleInputChange}
              required
              placeholder="Ex.: M"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="comprimento"
              className="block text-sm font-medium text-gray-700"
            >
              Comprimento *
            </label>
            <input
              id="comprimento"
              name="comprimento"
              type="text"
              value={formData.comprimento}
              onChange={handleInputChange}
              required
              placeholder="Ex.: Longo"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="tipoManga"
              className="block text-sm font-medium text-gray-700"
            >
              Tipo de Manga *
            </label>
            <input
              id="tipoManga"
              name="tipoManga"
              type="text"
              value={formData.tipoManga}
              onChange={handleInputChange}
              required
              placeholder="Ex.: Sem Manga"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="detalhesBordado"
              className="block text-sm font-medium text-gray-700"
            >
              Detalhes de Bordado
            </label>
            <input
              id="detalhesBordado"
              name="detalhesBordado"
              type="text"
              value={formData.detalhesBordado}
              onChange={handleInputChange}
              placeholder="Ex.: Renda com pérolas"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="descricao"
              className="block text-sm font-medium text-gray-700"
            >
              Descrição Detalhada *
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Ex.: Vestido elegante com detalhes brilhantes..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700"
            >
              Slug (URL Amigável) *
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleInputChange}
              required
              placeholder="Ex.: vestido-vitoria"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
            />
            <p className="mt-1 text-sm text-gray-500">
              O slug será usado na URL, ex.: /produtos/vestido-vitoria
            </p>
          </div>
          <div>
            <label
              htmlFor="imagemFrontal"
              className="block text-sm font-medium text-gray-700"
            >
              Imagem Frontal *
            </label>
            <input
              id="imagemFrontal"
              name="imagemFrontal"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="mt-1 block w-full text-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="imagemTraseira"
              className="block text-sm font-medium text-gray-700"
            >
              Imagem Traseira *
            </label>
            <input
              id="imagemTraseira"
              name="imagemTraseira"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="mt-1 block w-full text-gray-700"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Salvar Vestido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;