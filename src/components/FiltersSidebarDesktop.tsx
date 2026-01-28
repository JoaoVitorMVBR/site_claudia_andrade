'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface DesktopFiltersProps {
  colors: FilterOption[];
  sizes: FilterOption[];
  types: FilterOption[];
  selectedFilters: {
    colors: string[];
    sizes: string[];
    types: string[];
  };
  onFilterChange: (category: 'colors' | 'sizes' | 'types', values: string[]) => void;
}

const DesktopFilters: React.FC<DesktopFiltersProps> = ({
  colors,
  sizes,
  types,
  selectedFilters,
  onFilterChange,
}) => {
  const [openSections, setOpenSections] = useState<{
    colors: boolean;
    sizes: boolean;
    types: boolean;
  }>({ colors: true, sizes: true, types: true });

  const toggleSection = (section: 'colors' | 'sizes' | 'types') => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (
    category: 'colors' | 'sizes' | 'types',
    value: string
  ) => {
    const current = selectedFilters[category];
    const newValues = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFilterChange(category, newValues);
  };

  const renderFilterSection = (
    title: string,
    category: 'colors' | 'sizes' | 'types',
    options: FilterOption[]
  ) => (
    <div className="border-b border-gray-200 last:border-b-0 pb-6 mb-6">
      <button
        onClick={() => toggleSection(category)}
        className="w-full flex items-center justify-between text-gray-800 font-[Poppins-light] text-lg hover:text-[#000000] transition-colors duration-200 py-2"
      >
        {title}
        {openSections[category] ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>
      {openSections[category] && (
        <div className="mt-4 space-y-3">
          {options.map(option => (
            <label
              key={option.value}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedFilters[category].includes(option.value)}
                onChange={() => handleCheckboxChange(category, option.value)}
                className="w-4 h-4 text-[#000000] rounded focus:ring-[#000000] accent-[#000000]"
              />
              <span className="text-gray-700 group-hover:text-gray-900 font-[Poppins-light] transition-colors duration-200">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <aside className="hidden lg:block w-72 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
        {/* Adicionado overflow-y-auto e max-h para permitir rolagem */}
        {/* max-h: calcula a altura máxima como 100vh - 4rem (ajuste o 4rem conforme o header/footer do seu site) */}
        <h2 className="text-2xl font-moondance text-[#000000] mb-8">
          Filtros
        </h2>

        {renderFilterSection('Cor', 'colors', colors)}
        {renderFilterSection('Tamanho', 'sizes', sizes)}
        {renderFilterSection('Tipo', 'types', types)}
      </div>
    </aside>
  );
};

export default DesktopFilters;