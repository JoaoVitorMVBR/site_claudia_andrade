'use client';

import React from "react";
import { ClothingForm } from "./components/ClothingForm";
import { useImageUpload } from "./hooks/useImageUpload";
import { clothingService } from "./services/clothingService";

const AddNewClothing: React.FC = () => {
  const { uploadImages, uploadingFront, uploadingBack, progressFront, progressBack } = useImageUpload();

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
    // Verifica nome duplicado ANTES do upload (economiza bandwidth)
    const exists = await clothingService.checkNameExists(data.product.name);
    if (exists) {
      throw new Error("Já existe um vestido com esse nome. Escolha outro.");
    }

    // Upload direto ao Firebase Storage (não passa pelo Vercel)
    const { frontUrl, backUrl } = await uploadImages(data.frontFile, data.backFile);

    // Salva apenas metadados no banco via API
    await clothingService.create({
      ...data.product,
      frontImageUrl: frontUrl,
      backImageUrl: backUrl,
    });
  };

  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl md:text-3xl font-[Poppins-light] text-gray-800 mb-8">
        Adicionar Novo Vestido
      </h1>

      <div className="bg-white p-6 md:p-10 rounded-lg shadow-xl">
        <ClothingForm
          onSubmit={handleSubmit}
          uploadingFront={uploadingFront}
          uploadingBack={uploadingBack}
          progressFront={progressFront}
          progressBack={progressBack}
          isEdit={false}
        />
      </div>
    </div>
  );
};

export default AddNewClothing;
