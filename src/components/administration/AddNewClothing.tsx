import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

// 1. Tipagem para o estado do novo produto
interface NewProduct {
  name: string;
  type: string;
  color: string;
  size: string;
  frontImageFile: File | null; // Imagem da frente
  frontImageUrl: string | null; // URL para pré-visualização da frente
  backImageFile: File | null; // Imagem do verso
  backImageUrl: string | null; // URL para pré-visualização do verso
}

// 2. Opções de exemplo para os dropdowns
const typeOptions = ['T-Shirt', 'Jeans', 'Dress', 'Jacket', 'Shorts', 'Skirt'];
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', '30', '32', '34'];

const AddNewClothing: React.FC = () => {
  const [product, setProduct] = useState<NewProduct>({
    name: '',
    type: '',
    color: '',
    size: '',
    frontImageFile: null,
    frontImageUrl: null,
    backImageFile: null,
    backImageUrl: null,
  });

  // Estado para a mensagem de erro/sucesso
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 3. Função para manipular a submissão do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null); // Limpa mensagens anteriores

    if (!product.name || !product.type || !product.color || !product.size) {
      setStatusMessage({ type: 'error', message: 'Por favor, preencha todos os campos obrigatórios.' });
      return;
    }

    // Verifica se pelo menos uma imagem foi enviada (opcional, dependendo do requisito)
    if (!product.frontImageFile && !product.backImageFile) {
      setStatusMessage({ type: 'error', message: 'Por favor, envie pelo menos uma imagem (frente ou verso).' });
      return;
    }

    // Lógica de envio de dados (API) aqui
    console.log('Dados do produto a serem enviados:', product);
    setStatusMessage({ type: 'success', message: 'Item adicionado com sucesso!' });

    // Resetar o formulário
    setProduct({
      name: '',
      type: '',
      color: '',
      size: '',
      frontImageFile: null,
      frontImageUrl: null,
      backImageFile: null,
      backImageUrl: null,
    });
  };

  // 4. Funções para manipular o upload de imagens
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>,
    imageType: 'front' | 'back'
  ) => {
    let file: File | undefined;
    if ('dataTransfer' in e) {
      file = e.dataTransfer.files[0];
      e.preventDefault(); // Necessário para drag and drop
    } else {
      file = e.target.files?.[0];
    }

    if (file && file.size <= 10 * 1024 * 1024) { // Limite de 10MB
      const url = URL.createObjectURL(file);
      setProduct((prev) => ({
        ...prev,
        ...(imageType === 'front'
          ? { frontImageFile: file, frontImageUrl: url }
          : { backImageFile: file, backImageUrl: url }),
      }));
    } else if (file) {
      setStatusMessage({ type: 'error', message: 'O arquivo é muito grande (máx. 10MB).' });
    }
  };

  const handleFrontImageUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    handleImageUpload(e, 'front');
  };

  const handleBackImageUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    handleImageUpload(e, 'back');
  };

  const removeImage = (imageType: 'front' | 'back') => {
    setProduct((prev) => {
      if (imageType === 'front' && prev.frontImageUrl) {
        URL.revokeObjectURL(prev.frontImageUrl); // Libera a URL da imagem da frente
        return { ...prev, frontImageFile: null, frontImageUrl: null };
      } else if (imageType === 'back' && prev.backImageUrl) {
        URL.revokeObjectURL(prev.backImageUrl); // Libera a URL da imagem do verso
        return { ...prev, backImageFile: null, backImageUrl: null };
      }
      return prev;
    });
  };

  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-gray-50">
      {/* Título Principal */}
      <h1 className="text-2xl md:text-3xl font-[Poppins-light] text-gray-800 mb-8">
        Adicionar Novo Item de Vestuário
      </h1>
      {/* Mensagem de Status */}
      {statusMessage && (
        <div
          className={`p-3 mb-6 rounded-md ${
            statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {statusMessage.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-lg shadow-xl">
        {/* CAMPOS DE INPUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
          {/* Campo Nome */}
          <div>
            <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              placeholder="ex.: Camiseta Clássica"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-gray-900 font-[Poppins-light]"
              required
            />
          </div>
          {/* Campo Tipo (Dropdown) */}
          <div>
            <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Tipo</label>
            <input
              type="text"
              placeholder="ex.: Meio corpo bordado"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-gray-900 font-[Poppins-light]"
              required
            />              
          </div>
          {/* Campo Cor */}
          <div>
            <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Cor</label>
            <input
              type="text"
              placeholder="ex.: Azul Marinho"
              value={product.color}
              onChange={(e) => setProduct({ ...product, color: e.target.value })}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-gray-900 font-[Poppins-light]"
              required
            />
          </div>
          {/* Campo Tamanho (Dropdown) */}
          <div>
            <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Tamanho</label>
            <input
              type="text"
              placeholder="ex.: 42"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-gray-900 font-[Poppins-light]"
              required
            />
          </div>
        </div>
        {/* CAMPOS DE UPLOAD DE IMAGEM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
          {/* Upload Imagem da Frente */}
          <div>
            <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Imagem da Frente</label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFrontImageUpload}
              className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
                product.frontImageUrl ? 'border-gray-200' : 'border-gray-300 hover:border-blue-400 cursor-pointer'
              } font-[Poppins-light]`}
            >
              {product.frontImageUrl ? (
                // Preview da Imagem da Frente
                <div className="relative w-full h-64 mx-auto">
                  <Image
                    src={product.frontImageUrl}
                    alt="Preview Frente"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage('front')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    aria-label="Remover imagem da frente"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                // Dropzone Vazio (Frente)
                <label htmlFor="front-file-upload" className="cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    <span className="font-[Poppins-light] text-blue-600 hover:text-blue-500">Upload a file</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, até 10MB</p>
                  <input
                    id="front-file-upload"
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    className="sr-only"
                    onChange={handleFrontImageUpload}
                  />
                </label>
              )}
            </div>
          </div>
          {/* Upload Imagem do Verso */}
          <div>
            <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Imagem do Verso</label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleBackImageUpload}
              className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
                product.backImageUrl ? 'border-gray-200' : 'border-gray-300 hover:border-blue-400 cursor-pointer'
              } font-[Poppins-light]`}
            >
              {product.backImageUrl ? (
                // Preview da Imagem do Verso
                <div className="relative w-full h-64 mx-auto">
                  <Image
                    src={product.backImageUrl}
                    alt="Preview Verso"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage('back')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    aria-label="Remover imagem do verso"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                // Dropzone Vazio (Verso)
                <label htmlFor="back-file-upload" className="cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    <span className="font-[Poppins-light] text-blue-600 hover:text-blue-500">Upload a file</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, até 10MB</p>
                  <input
                    id="back-file-upload"
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    className="sr-only"
                    onChange={handleBackImageUpload}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
        {/* BOTÃO DE AÇÃO */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#641311] text-white font-[Poppins-light] rounded-lg shadow-md hover:bg-blue-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Salvar Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewClothing;