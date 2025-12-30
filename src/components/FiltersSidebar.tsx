'use client';

import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FiltersSidebarProps {
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

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  colors,
  sizes,
  types,
  selectedFilters,
  onFilterChange,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <div className="border-b border-gray-200 last:border-b-0 pb-4 mb-4">
      <button
        onClick={() => toggleSection(category)}
        className="w-full flex items-center justify-between text-gray-800 font-[Poppins-light] text-lg hover:text-[#641311] transition-colors duration-200 py-2"
      >
        {title}
        {openSections[category] ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>
      {openSections[category] && (
        <div className="mt-3 space-y-2">
          {options.map(option => (
            <label
              key={option.value}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedFilters[category].includes(option.value)}
                onChange={() => handleCheckboxChange(category, option.value)}
                className="w-4 h-4 text-[#641311] rounded focus:ring-[#641311] accent-[#641311]"
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

  const sidebarContent = (
    <div className="p-6 bg-white h-full overflow-y-auto">
      <h2 className="text-2xl font-moondance text-[#641311] mb-6">
        Filtros
      </h2>
      {renderFilterSection('Cor', 'colors', colors)}
      {renderFilterSection('Tamanho', 'sizes', sizes)}
      {renderFilterSection('Tipo', 'types', types)}
    </div>
  );

  return (
    <>
      {/* Botão flutuante - apenas em mobile */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 bg-[#cc936b] text-white rounded-full shadow-lg hover:bg-[#b87c5a] hover:scale-110 transition-all flex items-center justify-center lg:hidden"
        aria-label="Abrir filtros"
      >
        <Filter className="w-7 h-7" />
      </button>

      {/* Drawer lateral - apenas em mobile */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />

          {/* Painel lateral */}
          <aside className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-50 flex flex-col lg:hidden">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-2xl font-moondance text-[#641311]">Filtros</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {sidebarContent}

            {/* Botão opcional de aplicar (pode remover se não quiser) */}
            <div className="p-5 border-t bg-white">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 bg-[#cc936b] text-white rounded-lg hover:bg-[#b87c5a] transition font-medium"
              >
                Ver resultados
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default FiltersSidebar;