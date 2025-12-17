import React from "react";
import { CLOTHING_TYPES, SIZES } from "../../constants/clothingConstants";

interface FormFieldsProps {
  product: {
    name: string;
    type: string;
    color: string;
    sizes: string[];
  };
  onChange: (field: string, value: any) => void;
  formatInput: (value: string) => string;
}

export const FormFields: React.FC<FormFieldsProps> = ({ product, onChange, formatInput }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Nome</label>
        <input
          type="text"
          value={product.name}
          onChange={(e) => onChange("name", e.target.value)}
          onBlur={(e) => onChange("name", formatInput(e.target.value))}
          required
          className="w-full border-2 border-gray-200 rounded-lg p-2.5 font-[Poppins-light] focus:border-[#641311] focus:outline-none transition-colors"
          placeholder="ex.: Vestido Floral"
        />
      </div>

      <div>
        <label className="block text-sm font-[Poppins-light] text-gray-700 mb-1">Tipo</label>
        <select
          value={product.type}
          onChange={(e) => onChange("type", e.target.value)}
          required
          className="w-full border-2 border-gray-200 rounded-lg p-2.5 font-[Poppins-light] focus:border-[#641311] focus:outline-none transition-colors"
        >
          {CLOTHING_TYPES.map((o) => (
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
          onChange={(e) => onChange("color", e.target.value)}
          onBlur={(e) => onChange("color", formatInput(e.target.value))}
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
          onChange={(e) =>
            onChange("sizes", Array.from(e.target.selectedOptions, (o) => o.value))
          }
          required
          className="w-full border-2 border-gray-200 rounded-lg p-2.5 h-40 font-[Poppins-light] focus:border-[#641311] focus:outline-none transition-colors"
        >
          {SIZES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1 font-[Poppins-light]">
          Ctrl + clique para selecionar vários
        </p>
      </div>
    </div>
  );
};
