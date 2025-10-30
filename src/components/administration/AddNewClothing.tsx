'use client';

import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { uploadImage } from "@/utils/uploadImage";
import { addProduct } from "@/utils/addProduct";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface NewProduct {
  name: string;
  type: string;
  color: string;
  size: string;
  frontImageFile: File | null;
  frontImageUrl: string | null;
  backImageFile: File | null;
  backImageUrl: string | null;
  destaque: boolean | null,
}

const AddNewClothing: React.FC = () => {
  const [product, setProduct] = useState<NewProduct>({
    name: "",
    type: "",
    color: "",
    size: "",
    frontImageFile: null,
    frontImageUrl: null,
    backImageFile: null,
    backImageUrl: null,
    destaque: false,
  });

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setLoading(true);

    try {
      // Validação
      if (!product.name || !product.type || !product.color || !product.size) {
        throw new Error("Preencha todos os campos obrigatórios.");
      }
      if (!product.frontImageFile || !product.backImageFile) {
        throw new Error("Envie ambas as imagens (frente e verso).");
      }

      // 1. Gera ID temporário para nomear as imagens
      const tempId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // 2. Upload das duas imagens com o mesmo ID
      const [frontUrl, backUrl] = await Promise.all([
        uploadImage(product.frontImageFile, `${tempId}_front`),
        uploadImage(product.backImageFile, `${tempId}_back`),
      ]);

      // 3. Salva no Firestore → gera ID real
      const firestoreId = await addProduct({
        name: product.name,
        type: product.type,
        color: product.color,
        size: product.size,
        frontImageUrl: frontUrl,
        backImageUrl: backUrl,
        destaque: false,
      });

      // 4. Atualiza o documento com o próprio ID
      await updateDoc(doc(db, "clothing", firestoreId), {
        id: firestoreId,
      });

      setStatusMessage({ type: "success", message: "Vestido salvo com sucesso!" });

      // Reset
      setProduct({
        name: "", type: "", color: "", size: "",
        frontImageFile: null, frontImageUrl: null,
        backImageFile: null, backImageUrl: null, destaque: false,
      });
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      setStatusMessage({ type: "error", message: err.message || "Erro ao salvar." });
    } finally {
      setLoading(false);
    }
  };

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
        URL.revokeObjectURL(p.frontImageUrl);
        return { ...p, frontImageFile: null, frontImageUrl: null };
      }
      if (type === "back" && p.backImageUrl) {
        URL.revokeObjectURL(p.backImageUrl);
        return { ...p, backImageFile: null, backImageUrl: null };
      }
      return p;
    });
  };

  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl md:text-3xl font-[Poppins-light] text-gray-800 mb-8">
        Adicionar Novo Vestido
      </h1>

      {statusMessage && (
        <div
          className={`p-3 mb-6 rounded-md ${
            statusMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {statusMessage.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-lg shadow-xl">
        {/* CAMPOS DE TEXTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
          {[
            { key: "name", label: "Nome", placeholder: "ex.: Vestido Floral" },
            { key: "type", label: "Tipo", placeholder: "ex.: Vestido" },
            { key: "color", label: "Cor", placeholder: "ex.: Azul" },
            { key: "size", label: "Tamanho", placeholder: "ex.: M" },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type="text"
                placeholder={field.placeholder}
                value={(product as any)[field.key]}
                required
                onChange={e => setProduct(p => ({ ...p, [field.key]: e.target.value }))}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-gray-900 font-[Poppins-light]"
              />
            </div>
          ))}
        </div>

        {/* UPLOAD DE IMAGENS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
          {/* Frente */}
          <div>
            <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">
              Imagem da Frente *
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
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label htmlFor="front-file-upload" className="cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    <span className="font-[Poppins-light] text-blue-600 hover:text-blue-500">Upload</span> ou arraste
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
              Imagem do Verso *
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
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label htmlFor="back-file-upload" className="cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    <span className="font-[Poppins-light] text-blue-600 hover:text-blue-500">Upload</span> ou arraste
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

        {/* BOTÃO */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 bg-[#641311] text-white font-[Poppins-light] rounded-lg shadow-md transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Salvando…" : "Salvar Vestido"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewClothing;