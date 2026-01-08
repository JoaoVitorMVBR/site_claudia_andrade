'use client';
import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ClothingFormProps {
  initialData?: {
    name: string;
    type: string;
    color: string;
    sizes: string[];
    frontImageUrl: string | null;
    backImageUrl: string | null;
  };
  onSubmit: (formData: FormData) => Promise<void>;
  submitLabel: string;
  isEdit?: boolean;
}

export default function ClothingForm({ initialData, onSubmit, submitLabel, isEdit = false }: ClothingFormProps) {
  const [product, setProduct] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "",
    color: initialData?.color || "",
    sizes: initialData?.sizes || [],
    frontImageFile: null as File | null,
    frontImageUrl: initialData?.frontImageUrl || null,
    backImageFile: null as File | null,
    backImageUrl: initialData?.backImageUrl || null,
  });

  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>,
    type: "front" | "back"
  ) => {
    let file: File | undefined;
    if ("dataTransfer" in e) {
      file = e.dataTransfer.files[0];
      e.preventDefault();
    } else {
      file = e.target.files?.[0];
    }

    if (file && file.size <= 10 * 1024 * 1024) {
      const url = URL.createObjectURL(file);
      setProduct(p => ({
        ...p,
        ...(type === "front"
          ? { frontImageFile: file, frontImageUrl: url }
          : { backImageFile: file, backImageUrl: url }),
      }));
    } else if (file) {
      setStatusMessage({ type: "error", message: "Arquivo muito grande (máx. 10MB)." });
    }
  };

  const removeImage = (type: "front" | "back") => {
    setProduct(p => {
      if (type === "front" && p.frontImageUrl) {
        if (p.frontImageFile) URL.revokeObjectURL(p.frontImageUrl);
        return { ...p, frontImageFile: null, frontImageUrl: null };
      }
      if (type === "back" && p.backImageUrl) {
        if (p.backImageFile) URL.revokeObjectURL(p.backImageUrl);
        return { ...p, backImageFile: null, backImageUrl: null };
      }
      return p;
    });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, opt => opt.value);
    setProduct(p => ({ ...p, sizes: selected }));
  };

  const clothingTypes = [
    { value: "", label: "Selecione o tipo" },
    { value: "Detalhes bordados", label: "Detalhes bordados" },
    { value: "Todo bordado", label: "Todo bordado" },
    { value: "Liso", label: "Liso" },
    { value: "Gliterizado", label: "Gliterizado" },
    { value: "Micro paetê", label: "Micro paetê" },
    { value: "Meio corpo bordado", label: "Meio corpo bordado" },
    { value: "Curto liso", label: "Curto liso" },
    { value: "Curto bordado", label: "Curto bordado" },
    { value: "Midi", label: "Midi" },
    { value: "Debutante", label: "Debutante" },
  ];

  const sizes = [
    { value: "34", label: "34" }, { value: "36", label: "36" }, { value: "38", label: "38" },
    { value: "40", label: "40" }, { value: "42", label: "42" }, { value: "44", label: "44" },
    { value: "46", label: "46" }, { value: "48", label: "48" }, { value: "50", label: "50" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setLoading(true);

    try {
      if (!product.name || !product.type || !product.color || product.sizes.length === 0) {
        throw new Error("Preencha todos os campos obrigatórios.");
      }
      if (!isEdit && (!product.frontImageFile || !product.backImageFile)) {
        throw new Error("Envie ambas as imagens (frente e verso).");
      }

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("type", product.type);
      formData.append("color", product.color);
      product.sizes.forEach(size => formData.append("size", size));
      if (product.frontImageFile) formData.append("frontImage", product.frontImageFile);
      if (product.backImageFile) formData.append("backImage", product.backImageFile);

      await onSubmit(formData);
      setStatusMessage({ type: "success", message: isEdit ? "Atualizado com sucesso!" : "Vestido salvo!" });
    } catch (err: any) {
      setStatusMessage({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-lg shadow-xl">
      {statusMessage && (
        <div className={`p-3 mb-6 rounded-md ${statusMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {statusMessage.message}
        </div>
      )}

      {/* CAMPOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
        <div>
          <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            placeholder="ex.: Vestido Floral"
            value={product.name}
            required
            onChange={e => setProduct(p => ({ ...p, name: e.target.value }))}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-gray-900 font-[Poppins-light]"
          />
        </div>

        <div>
          <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Tipo</label>
          <select
            value={product.type}
            required
            onChange={e => setProduct(p => ({ ...p, type: e.target.value }))}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-gray-900 font-[Poppins-light]"
          >
            {clothingTypes.map(option => (
              <option key={option.value} value={option.value} disabled={option.value === ""}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Cor</label>
          <input
            type="text"
            placeholder="ex.: Azul"
            value={product.color}
            required
            onChange={e => setProduct(p => ({ ...p, color: e.target.value }))}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-gray-900 font-[Poppins-light]"
          />
        </div>

        <div>
          <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Tamanhos disponíveis</label>
          <select
            multiple
            required
            value={product.sizes}
            onChange={handleSizeChange}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-gray-900 font-[Poppins-light] h-40"
          >
            {sizes.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1 font-[Poppins-light]">
            Segure Ctrl (ou Command no Mac) para selecionar vários
          </p>
        </div>
      </div>

      {/* IMAGENS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
        {/* Frente */}
        <div>
          <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">
            Imagem da Frente {isEdit ? "(opcional)" : "*"}
          </label>
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => handleImageUpload(e, "front")}
            className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
              product.frontImageUrl ? "border-gray-200" : "border-gray-300 hover:border-blue-400 cursor-pointer"
            } font-[Poppins-light]`}
          >
            {product.frontImageUrl ? (
              <div className="relative w-full h-64 mx-auto">
                <Image src={product.frontImageUrl} alt="Frente" fill className="rounded-lg object-contain" />
                <button
                  type="button"
                  onClick={() => removeImage("front")}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label htmlFor="front-file-upload" className="cursor-pointer">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  <span className="text-blue-600 hover:text-blue-500">Upload</span> ou arraste
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, ≤ 10MB</p>
                <input
                  id="front-file-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/gif"
                  className="sr-only"
                  onChange={e => handleImageUpload(e, "front")}
                />
              </label>
            )}
          </div>
        </div>

        {/* Verso */}
        <div>
          <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">
            Imagem do Verso {isEdit ? "(opcional)" : "*"}
          </label>
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => handleImageUpload(e, "back")}
            className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
              product.backImageUrl ? "border-gray-200" : "border-gray-300 hover:border-blue-400 cursor-pointer"
            } font-[Poppins-light]`}
          >
            {product.backImageUrl ? (
              <div className="relative w-full h-64 mx-auto">
                <Image src={product.backImageUrl} alt="Verso" fill className="rounded-lg object-contain" />
                <button
                  type="button"
                  onClick={() => removeImage("back")}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label htmlFor="back-file-upload" className="cursor-pointer">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  <span className="text-blue-600 hover:text-blue-500">Upload</span> ou arraste
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, ≤ 10MB</p>
                <input
                  id="back-file-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/gif"
                  className="sr-only"
                  onChange={e => handleImageUpload(e, "back")}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 bg-[#ffffff] text-white font-[Poppins-light] rounded-lg shadow-md transition ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#54100e]"
          }`}
        >
          {loading ? "Salvando…" : submitLabel}
        </button>
      </div>
    </form>
  );
}