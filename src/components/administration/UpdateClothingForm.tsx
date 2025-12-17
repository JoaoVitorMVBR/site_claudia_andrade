'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ClothingForm } from "./components/ClothingForm";
import { useImageUpload } from "./hooks/useImageUpload";
import { clothingService } from "./services/clothingService";

const UpdateClothingForm: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { uploadImages, uploadingFront, uploadingBack, progressFront, progressBack } = useImageUpload();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        const product = await clothingService.getById(productId);
        setInitialData(product);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar produto");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (data: {
    product: {
      name: string;
      type: string;
      color: string;
      sizes: string[];
    };
    frontFile: File | null;
    backFile: File | null;
  }) => {
    // Upload apenas das imagens que foram alteradas (direto ao Firebase)
    const { frontUrl, backUrl } = await uploadImages(data.frontFile, data.backFile);

    // Prepara dados para update (mantém URLs existentes se não houve upload)
    const updateData = {
      ...data.product,
      ...(frontUrl && { frontImageUrl: frontUrl }),
      ...(backUrl && { backImageUrl: backUrl }),
    };

    // Envia apenas metadados para a API
    await clothingService.update(productId, updateData);
    
    // Redireciona após sucesso
    setTimeout(() => {
      router.push('/adm/produtos');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 text-center">
        <Loader2 className="mx-auto animate-spin w-8 h-8 text-blue-600" />
        <p className="text-gray-500 mt-2">Carregando produto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
        <button
          onClick={() => router.push('/adm/produtos')}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Voltar à Lista
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="mb-4">
        <button
          onClick={() => router.push('/adm/produtos')}
          className="text-blue-600 hover:text-blue-800 font-[Poppins-light]"
        >
          ← Voltar à Lista
        </button>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-[Poppins-light] text-gray-800 mb-8">
        Editar Vestido
      </h1>

      <div className="bg-white p-6 md:p-10 rounded-lg shadow-xl">
        <ClothingForm
          onSubmit={handleSubmit}
          initialData={initialData}
          uploadingFront={uploadingFront}
          uploadingBack={uploadingBack}
          progressFront={progressFront}
          progressBack={progressBack}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default UpdateClothingForm;
