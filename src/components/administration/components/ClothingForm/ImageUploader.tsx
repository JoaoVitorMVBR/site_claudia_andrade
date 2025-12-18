import React from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { validateFile } from "@/shared/utils/uploadUtils";

interface ImageUploaderProps {
  type: "front" | "back";
  preview: string | null;
  onSelect: (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>, type: "front" | "back") => void;
  onRemove: (type: "front" | "back") => void;
  uploading?: boolean;
  progress?: number;
  required?: boolean;
  onError?: (message: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  type,
  preview,
  onSelect,
  onRemove,
  uploading = false,
  progress = 0,
  required = false,
  onError,
}) => {
  const label = type === "front" ? "Frente" : "Verso";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    let file: File | null = null;

    if ("dataTransfer" in e) {
      file = e.dataTransfer.files[0];
      e.preventDefault();
    } else if (e.target.files && e.target.files[0]) {
      file = e.target.files[0];
    }

    if (file) {
      const validation = validateFile(file);
      if (validation) {
        onError?.(validation);
        return;
      }
    }

    onSelect(e, type);
  };

  return (
    <div>
      <label className="block text-sm font-[Poppins-light] text-gray-700 mb-2">
        Imagem da {label} {required && <span className="text-red-500">*</span>}
        {!required && <span className="text-gray-500">(opcional)</span>}
      </label>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileSelect}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          preview ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-blue-400"
        }`}
      >
        {preview ? (
          <div className="relative">
            <Image
              src={preview}
              alt={label}
              width={400}
              height={400}
              className="mx-auto rounded-lg object-contain max-h-96"
            />
            <button
              type="button"
              onClick={() => onRemove(type)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            >
              <X className="w-5 h-5" />
            </button>
            {uploading && (
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">{Math.round(progress)}%</p>
              </div>
            )}
          </div>
        ) : (
          <label className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 font-[Poppins-light]">
              <span className="text-blue-600 font-medium">Clique para enviar</span> ou arraste aqui
            </p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP • Máx. 20MB</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};
