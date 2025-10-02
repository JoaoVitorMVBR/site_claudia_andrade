import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

// 1. Tipagem para o estado do novo produto
interface NewProduct {
  name: string;
  type: string;
  color: string;
  size: string;
  imageFile: File | null;
  imageUrl: string | null; // Para pré-visualização da imagem
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
    imageFile: null,
    imageUrl: null,
  });

  // Estado para a mensagem de erro/sucesso (opcional)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // 3. Função para manipular a submissão do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null); // Limpa mensagens anteriores

    if (!product.name || !product.type || !product.color || !product.size) {
      setStatusMessage({ type: 'error', message: 'Por favor, preencha todos os campos obrigatórios.' });
      return;
    }

    // Lógica de envio de dados (API) aqui
    console.log('Dados do produto a serem enviados:', product);
    
    // Simulação de sucesso
    setStatusMessage({ type: 'success', message: 'Item adicionado com sucesso!' });
    
    // Resetar o formulário
    setProduct({ name: '', type: '', color: '', size: '', imageFile: null, imageUrl: null });
  };

  // 4. Função para manipular o upload de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    let file: File | undefined;

    if ('dataTransfer' in e) {
      file = e.dataTransfer.files[0];
      e.preventDefault(); // Necessário para drag and drop
    } else {
      file = e.target.files?.[0];
    }

    if (file && file.size <= 10 * 1024 * 1024) { // Limite de 10MB
      const url = URL.createObjectURL(file);
      setProduct(prev => ({
        ...prev,
        imageFile: file,
        imageUrl: url,
      }));
    } else if (file) {
        setStatusMessage({ type: 'error', message: 'O arquivo é muito grande (máx. 10MB).' });
    }
  };

  const removeImage = () => {
    if (product.imageUrl) {
      URL.revokeObjectURL(product.imageUrl); // Libera a URL de objeto
    }
    setProduct(prev => ({ ...prev, imageFile: null, imageUrl: null }));
  };

  return (
    // O p-4 e md:p-8 dão um padding responsivo para o conteúdo
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-gray-50"> 
      
      {/* Título Principal */}
      <h1 className="text-2xl md:text-3xl font-[Poppins-light] text-gray-800 mb-8">
        Adicionar Novo Item de Vestuário
      </h1>

      {/* Mensagem de Status */}
      {statusMessage && (
        <div 
          className={`p-3 mb-6 rounded-md ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {statusMessage.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-lg shadow-xl">
        
        {/* CAMPOS DE INPUT (Responsividade: 2 colunas no desktop, 1 no mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
          
          {/* Campo Nome */}
          <div>
            <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="e.g., Classic T-Shirt"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-gray-900 font-[Poppins-light]"
              required
            />
          </div>

          {/* Campo Tipo (Dropdown) */}
          <div>
            <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Type</label>
            <select
              value={product.type}
              onChange={(e) => setProduct({ ...product, type: e.target.value })}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-gray-900 font-[Poppins-light]"
              required
            >
              <option value="">Select item type</option>
              {typeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Campo Cor */}
          <div>
            <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Color</label>
            <input
              type="text"
              placeholder="e.g., Navy Blue"
              value={product.color}
              onChange={(e) => setProduct({ ...product, color: e.target.value })}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-gray-900 font-[Poppins-light]"
              required
            />
          </div>

          {/* Campo Tamanho (Dropdown) */}
          <div>
            <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Size</label>
            <select
              value={product.size}
              onChange={(e) => setProduct({ ...product, size: e.target.value })}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-gray-900 font-[Poppins-light]"
              required
            >
              <option value="">Select item size</option>
              {sizeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* CAMPO DE UPLOAD DE IMAGEM */}
        <div className="mb-10">
          <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Image</label>

          {/* Área de Dropzone/Preview */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleImageUpload}
            className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${product.imageUrl ? 'border-gray-200' : 'border-gray-300 hover:border-blue-400 cursor-pointer'} font-[Poppins-light]`}
          >
            {product.imageUrl ? (
              // Preview da Imagem
              <div className="relative w-full h-64 mx-auto">
                <Image 
                    src={product.imageUrl} 
                    alt="Preview" 
                    layout="fill" 
                    objectFit="contain"
                    className="rounded-lg" 
                />
                <button 
                    type="button" 
                    onClick={removeImage} 
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    aria-label="Remove image"
                >
                    <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              // Dropzone Vazio
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  <span className="font-[Poppins-light] text-blue-600 hover:text-blue-500">
                    Upload a file
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, up to 10MB</p>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/gif"
                  className="sr-only"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
        </div>
        
        {/* BOTÃO DE AÇÃO */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#641311] text-white font-[Poppins-light] rounded-lg shadow-md hover:bg-blue-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewClothing;