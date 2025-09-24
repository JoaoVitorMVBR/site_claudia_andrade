import Link from 'next/link';
import { useState } from 'react';
import { SquareDashedKanban, Shirt, Menu, X } from 'lucide-react';

// Assumindo que você tem os tipos e dados em 'types/index.ts' e 'data/products.ts'
// Importe os itens de navegação
import { navItems, utilityItems } from '../../data/products'; 

const Sidebar: React.FC = () => {
  // 1. Estado para controlar se a sidebar está aberta no mobile
  const [isOpen, setIsOpen] = useState(false);

  // A função de toggle para o botão de menu
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Handler para fechar a sidebar após um clique de navegação (apenas em mobile)
  const handleLinkClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* 1. Botão de Toggle (Visível Apenas em Mobile) */}
      {/* Posição fixa no topo esquerdo do viewport, oculta em telas grandes */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-700 bg-white rounded-md shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle menu"
        >
          {/* Altera o ícone de Hambúrguer para X quando aberto */}
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* 2. Overlay (Fundo Escuro) - Visível Apenas Quando Aberto no Mobile */}
      {/* Z-index 30 para ficar sob a sidebar (z-30) mas sobre o conteúdo */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* 3. A Sidebar Principal */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col justify-between z-30
          // Animação para a transição suave
          transform transition-transform duration-300 ease-in-out
          
          // Lógica Mobile: se não estiver aberto, esconde (-translate-x-full)
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          
          // Lógica Desktop (md:): sempre visível (translate-x-0) e em modo 'block'
          md:translate-x-0 md:block 
        `}
      >
        {/* Top Section */}
        <div className="flex-1">
          {/* Logo/Title */}
          <div className="flex items-center p-4 h-16 border-b border-gray-200">
            <span className="text-xl font-bold text-gray-800 flex items-center">
              <span className="w-6 h-6 bg-blue-500 rounded-full mr-2"></span>
              **Gestão de Inventário**
            </span>
          </div>

          {/* Main Navigation */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors 
                  ${item.current
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
            
            {/* Opção Adicionar Nova Peça (CRUD - C) */}
            <Link
                href="/admin/products/add" 
                onClick={handleLinkClick}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-green-100 hover:text-green-700 mt-4 border border-green-300"
            >
                <Shirt className="mr-3 h-5 w-5" />
                **Adicionar Nova Peça**
            </Link>
          </nav>
        </div>

        {/* Bottom Utilities */}
        <div className="p-4 border-t border-gray-200">
          <nav className="space-y-1">
            {utilityItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;