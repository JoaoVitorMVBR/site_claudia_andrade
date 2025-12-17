import { useState } from "react";
import { MAX_IMAGE_SIZE } from "../constants/clothingConstants";

interface ClothingFormData {
  name: string;
  type: string;
  color: string;
  sizes: string[];
}

interface ImageState {
  preview: string | null;
  file: File | null;
}

export const useClothingForm = (initialData?: {
  name: string;
  type: string;
  color: string;
  sizes: string[];
  frontImageUrl: string | null;
  backImageUrl: string | null;
}) => {
  const [product, setProduct] = useState<ClothingFormData>({
    name: initialData?.name || "",
    type: initialData?.type || "",
    color: initialData?.color || "",
    sizes: initialData?.sizes || [],
  });

  const [frontImage, setFrontImage] = useState<ImageState>({
    preview: initialData?.frontImageUrl || null,
    file: null,
  });

  const [backImage, setBackImage] = useState<ImageState>({
    preview: initialData?.backImageUrl || null,
    file: null,
  });

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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
      if (frontImage.preview && frontImage.file) {
        URL.revokeObjectURL(frontImage.preview);
      }
      setFrontImage({ preview: previewUrl, file });
    } else {
      // Limpa preview anterior se era um blob
      if (backImage.preview && backImage.file) {
        URL.revokeObjectURL(backImage.preview);
      }
      setBackImage({ preview: previewUrl, file });
    }

    setStatusMessage({
      type: "success",
      message: `Imagem da ${type === "front" ? "frente" : "trás"} selecionada.`,
    });
  };

  const removeImage = (type: "front" | "back") => {
    if (type === "front") {
      if (frontImage.preview && frontImage.file) {
        URL.revokeObjectURL(frontImage.preview);
      }
      setFrontImage({ preview: null, file: null });
    } else {
      if (backImage.preview && backImage.file) {
        URL.revokeObjectURL(backImage.preview);
      }
      setBackImage({ preview: null, file: null });
    }
  };

  const resetForm = () => {
    setProduct({ name: "", type: "", color: "", sizes: [] });
    
    // Limpa blobs antes de resetar
    if (frontImage.preview && frontImage.file) {
      URL.revokeObjectURL(frontImage.preview);
    }
    if (backImage.preview && backImage.file) {
      URL.revokeObjectURL(backImage.preview);
    }
    
    setFrontImage({ preview: null, file: null });
    setBackImage({ preview: null, file: null });
    setStatusMessage(null);
  };

  const validateForm = (requireFrontImage = true) => {
    const formattedProduct = {
      ...product,
      name: formatInput(product.name),
      color: formatInput(product.color),
    };

    if (!formattedProduct.name || !formattedProduct.type || !formattedProduct.color || formattedProduct.sizes.length === 0) {
      throw new Error("Preencha todos os campos obrigatórios.");
    }

    if (requireFrontImage && !frontImage.preview) {
      throw new Error("A imagem da frente é obrigatória.");
    }

    return formattedProduct;
  };

  return {
    product,
    frontImage,
    backImage,
    statusMessage,
    setStatusMessage,
    formatInput,
    handleFieldChange,
    handleImageSelect,
    removeImage,
    resetForm,
    validateForm,
  };
};
