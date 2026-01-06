'use client';

import React, { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface NewProduct {
  name: string;
  type: string;
  color: string;
  sizes: string[];
  frontImageUrl: string | null;
  backImageUrl: string | null;
}

const AddNewClothing: React.FC = () => {
  const [product, setProduct] = useState<NewProduct>({
    name: "",
    type: "",
    color: "",
    sizes: [],
    frontImageUrl: null,
    backImageUrl: null,
  });

  // Preview local
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  // Arquivos selecionados (para subir só no submit)
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  // Estados de upload (usados só no submit)
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [progressFront, setProgressFront] = useState(0);
  const [progressBack, setProgressBack] = useState(0);

  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const formatInput = (value: string): string => {
    if (!value) return "";
    return value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase();
  };

  const uploadImage = async (file: File, type: "front" | "back"): Promise<string> => {
    const fileExt = file.name.split(".").pop() || "";
    const fileName = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const storageRef = ref(storage, `clothing/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (type === "front") setProgressFront(progress);
          if (type === "back") setProgressBack(progress);
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  };

  // Apenas preview + guarda o arquivo
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

    if (file.size > 20 * 1024 * 1024) {
      setStatusMessage({ type: "error", message: "Imagem muito grande (máx. 20MB)." });
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (type === "front") {
      setFrontFile(file);
      setFrontPreview(previewUrl);
    } else {
      setBackFile(file);
      setBackPreview(previewUrl);
    }

    setStatusMessage({
      type: "success",
      message: `Imagem da ${type === "front" ? "frente" : "trás"} selecionada. Será enviada ao salvar.`,
    });
  };

  const removeImage = (type: "front" | "back") => {
    if (type === "front") {
      setFrontPreview(null);
      setFrontFile(null);
      setProduct(p => ({ ...p, frontImageUrl: null }));
    } else {
      setBackPreview(null);
      setBackFile(null);
      setProduct(p => ({ ...p, backImageUrl: null }));
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
      if (!frontPreview) {
        throw new Error("A imagem da frente é obrigatória.");
      }

      // 1. Verifica nome duplicado ANTES de qualquer upload
      const checkRes = await fetch(`/api/clothing/create?name=${encodeURIComponent(formattedProduct.name)}`);
      if (!checkRes.ok) {
        const errData = await checkRes.json();
        throw new Error(errData.error || "Erro ao verificar nome.");
      }
      const { exists } = await checkRes.json();
      if (exists) {
        throw new Error("Já existe um vestido com esse nome. Escolha outro.");
      }

      // 2. Só agora faz upload das imagens (se necessário)
      let finalFrontUrl = product.frontImageUrl;
      let finalBackUrl = product.backImageUrl;

      if (frontFile) {
        setUploadingFront(true);
        finalFrontUrl = await uploadImage(frontFile, "front");
        setProduct(p => ({ ...p, frontImageUrl: finalFrontUrl }));
      }

      if (backFile) {
        setUploadingBack(true);
        finalBackUrl = await uploadImage(backFile, "back");
        setProduct(p => ({ ...p, backImageUrl: finalBackUrl }));
      }

      // 3. Salva no banco
      const res = await fetch("/api/clothing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formattedProduct,
          frontImageUrl: finalFrontUrl,
          backImageUrl: finalBackUrl || null,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao salvar o vestido.");
      }

      setStatusMessage({ type: "success", message: "Vestido salvo com sucesso!" });

      // Reset completo
      setProduct({ name: "", type: "", color: "", sizes: [], frontImageUrl: null, backImageUrl: null });
      setFrontPreview(null);
      setBackPreview(null);
      setFrontFile(null);
      setBackFile(null);
      setProgressFront(0);
      setProgressBack(0);

    } catch (err: any) {
      setStatusMessage({ type: "error", message: err.message || "Erro ao salvar." });
    } finally {
      setLoading(false);
      setUploadingFront(false);
      setUploadingBack(false);
    }
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

  const sizes = ["34", "36", "38", "40", "42", "44", "46", "48", "50"].map(s => ({ value: s, label: s }));

  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl md:text-3xl font-[Poppins-light] text-gray-800 mb-8">
        Adicionar Novo Vestido
      </h1>

      {statusMessage && (
        <div className={`p-4 mb-6 rounded-md text-sm ${statusMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {statusMessage.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-lg shadow-xl">
        {/* Campos de texto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={product.name}
              onChange={e => setProduct(p => ({ ...p, name: e.target.value }))}
              onBlur={e => setProduct(p => ({ ...p, name: formatInput(e.target.value) }))}
              required
              className="w-full border-2 border-gray-200 rounded-lg p-2.5 font-[Poppins-light] focus:border-[#641311] focus:outline-none transition-colors"
              placeholder="ex.: Vestido Floral"
            />
          </div>

          <div>
            <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Tipo</label>
            <select
              value={product.type}
              onChange={e => setProduct(p => ({ ...p, type: e.target.value }))}
              required
              className="w-full border-2 border-gray-200 rounded-lg p-2.5 font-[Poppins-light] focus:border-[#641311] focus:outline-none transition-colors"
            >
              {clothingTypes.map(o => (
                <option key={o.value} value={o.value} disabled={!o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Cor</label>
            <input
              type="text"
              value={product.color}
              onChange={e => setProduct(p => ({ ...p, color: e.target.value }))}
              onBlur={e => setProduct(p => ({ ...p, color: formatInput(e.target.value) }))}
              required
              className="w-full border-2 border-gray-200 rounded-lg p-2.5 font-[Poppins-light] focus:border-[#641311] focus:outline-none transition-colors"
              placeholder="ex.: Azul Marinho"
            />
          </div>

          <div>
            <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Tamanhos</label>
            <select
              multiple
              value={product.sizes}
              onChange={e => setProduct(p => ({
                ...p,
                sizes: Array.from(e.target.selectedOptions, o => o.value)
              }))}
              required
              className="w-full border-2 border-gray-200 rounded-lg p-2.5 h-40 font-[Poppins-light] focus:border-[#641311] focus:outline-none transition-colors"
            >
              {sizes.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1 font-[Poppins-light]">Ctrl + clique para selecionar vários</p>
          </div>
        </div>

        {/* Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Frente */}
          <div>
            <label className="block text-sm font-[Poppins-light] text-gray-700 mb-2">
              Imagem da Frente <span className="text-red-500">*</span>
            </label>
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleImageSelect(e, "front")}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${frontPreview ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-blue-400"}`}
            >
              {frontPreview ? (
                <div className="relative">
                  <Image
                    src={frontPreview}
                    alt="Frente"
                    width={400}
                    height={400}
                    className="mx-auto rounded-lg object-contain max-h-96"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage("front")}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  {uploadingFront && (
                    <div className="mt-4">
                      <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${progressFront}%` }} />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{Math.round(progressFront)}%</p>
                    </div>
                  )}
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600 font-[Poppins-light]">
                    <span className="text-blue-600 font-medium">Clique para enviar</span> ou arraste aqui
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageSelect(e, "front")}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Verso */}
          <div>
            <label className="block text-sm font-[Poppins-light] text-gray-700 mb-2">
              Imagem do Verso <span className="text-gray-500">(opcional)</span>
            </label>
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleImageSelect(e, "back")}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${backPreview ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-blue-400"}`}
            >
              {backPreview ? (
                <div className="relative">
                  <Image
                    src={backPreview}
                    alt="Verso"
                    width={400}
                    height={400}
                    className="mx-auto rounded-lg object-contain max-h-96"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage("back")}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  {uploadingBack && (
                    <div className="mt-4">
                      <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div className="bg-blue-600 h-full transition-all" style={{ width: `${progressBack}%` }} />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{Math.round(progressBack)}%</p>
                    </div>
                  )}
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600 font-[Poppins-light]">
                    <span className="text-blue-600 font-medium">Clique para enviar</span> ou arraste
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageSelect(e, "back")}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !frontPreview}
            className={`px-8 py-3 bg-[#ffffff] text-white rounded-lg font-medium transition flex items-center gap-2 ${
              loading || !frontPreview ? "opacity-60 cursor-not-allowed" : "hover:bg-[#54100e]"
            }`}
          >
            {loading ? (
              <>Salvando <Loader2 className="w-5 h-5 animate-spin" /></>
            ) : (
              "Salvar Vestido"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewClothing;