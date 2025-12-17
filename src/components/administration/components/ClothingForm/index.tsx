'use client';

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { FormFields } from "./FormFields";
import { ImageUploader } from "./ImageUploader";
import { MAX_IMAGE_SIZE } from "../../constants/clothingConstants";

interface ClothingFormProps {
  onSubmit: (data: {
    product: {
      name: string;
      type: string;
      color: string;
      sizes: string[];
    };
    frontFile: File | null;
    backFile: File | null;
  }) => Promise<void>;
  initialData?: {
    name: string;
    type: string;
    color: string;
    sizes: string[];
    frontImageUrl: string | null;
    backImageUrl: string | null;
  };
  uploadingFront?: boolean;
  uploadingBack?: boolean;
  progressFront?: number;
  progressBack?: number;
  isEdit?: boolean;
}

export const ClothingForm: React.FC<ClothingFormProps> = ({
  onSubmit,
  initialData,
  uploadingFront = false,
  uploadingBack = false,
  progressFront = 0,
  progressBack = 0,
  isEdit = false,
}) => {
  const [product, setProduct] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "",
    color: initialData?.color || "",
    sizes: initialData?.sizes || [],
  });

  const [frontPreview, setFrontPreview] = useState<string | null>(initialData?.frontImageUrl || null);
  const [backPreview, setBackPreview] = useState<string | null>(initialData?.backImageUrl || null);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const formatInput = (value: string): string => {
    if (!value) return "";
    return value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase();
  };

  const handleFieldChange = (field: string, value: any) => {
    setProduct((p) => ({ ...p, [field]: value }));
  };

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>,
    type: "front" | "back"
  ) => {
    let file: File | null = null;

    if ("dataTransfer" in e) {
      file = e.dataTransfer.files[0];
      e.preventDefault();
    } else if (e.target.files && e.target.files[0]) {
      file = e.target.files[0];
    }

    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      setStatusMessage({ type: "error", message: "Imagem muito grande (máx. 20MB)." });
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (type === "front") {
      // Limpa preview anterior se era um blob
      if (frontPreview && frontFile) {
        URL.revokeObjectURL(frontPreview);
      }
      setFrontFile(file);
      setFrontPreview(previewUrl);
    } else {
      // Limpa preview anterior se era um blob
      if (backPreview && backFile) {
        URL.revokeObjectURL(backPreview);
      }
      setBackFile(file);
      setBackPreview(previewUrl);
    }

    setStatusMessage({
      type: "success",
      message: `Imagem da ${type === "front" ? "frente" : "trás"} selecionada.`,
    });
  };

  const removeImage = (type: "front" | "back") => {
    if (type === "front") {
      if (frontPreview && frontFile) {
        URL.revokeObjectURL(frontPreview);
      }
      setFrontPreview(null);
      setFrontFile(null);
    } else {
      if (backPreview && backFile) {
        URL.revokeObjectURL(backPreview);
      }
      setBackPreview(null);
      setBackFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setLoading(true);

    try {
      const formattedProduct = {
        ...product,
        name: formatInput(product.name),
        color: formatInput(product.color),
      };

      if (!formattedProduct.name || !formattedProduct.type || !formattedProduct.color || formattedProduct.sizes.length === 0) {
        throw new Error("Preencha todos os campos obrigatórios.");
      }
      
      // Para criação, imagem da frente é obrigatória
      if (!isEdit && !frontPreview) {
        throw new Error("A imagem da frente é obrigatória.");
      }

      await onSubmit({ product: formattedProduct, frontFile, backFile });

      setStatusMessage({ 
        type: "success", 
        message: isEdit ? "Vestido atualizado com sucesso!" : "Vestido salvo com sucesso!" 
      });

      // Reset apenas se não for edição
      if (!isEdit) {
        setProduct({ name: "", type: "", color: "", sizes: [] });
        setFrontPreview(null);
        setBackPreview(null);
        setFrontFile(null);
        setBackFile(null);
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", message: err.message || "Erro ao salvar." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {statusMessage && (
        <div
          className={`p-4 rounded-md text-sm ${
            statusMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {statusMessage.message}
        </div>
      )}

      <FormFields product={product} onChange={handleFieldChange} formatInput={formatInput} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ImageUploader
          type="front"
          preview={frontPreview}
          onSelect={handleImageSelect}
          onRemove={removeImage}
          uploading={uploadingFront}
          progress={progressFront}
          required={!isEdit}
        />
        <ImageUploader
          type="back"
          preview={backPreview}
          onSelect={handleImageSelect}
          onRemove={removeImage}
          uploading={uploadingBack}
          progress={progressBack}
          required={false}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || (!isEdit && !frontPreview)}
          className={`px-8 py-3 bg-[#641311] text-white rounded-lg font-medium transition flex items-center gap-2 ${
            loading || (!isEdit && !frontPreview) ? "opacity-60 cursor-not-allowed" : "hover:bg-[#54100e]"
          }`}
        >
          {loading ? (
            <>
              {isEdit ? "Atualizando" : "Salvando"} <Loader2 className="w-5 h-5 animate-spin" />
            </>
          ) : (
            isEdit ? "Atualizar Vestido" : "Salvar Vestido"
          )}
        </button>
      </div>
    </form>
  );
};
