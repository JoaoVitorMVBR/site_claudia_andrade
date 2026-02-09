"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shirt, Package, LayoutDashboard, Plus } from 'lucide-react';
import React, { useState } from 'react';

// Tipagem para os itens de navegação
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Dados de navegação (exemplo, substitua pelos seus dados reais)
const navItems: NavItem[] = [
  { name: 'Produtos', href: 'produtos', icon: Shirt },
  // { name: 'Dashboard', href: 'dashboard', icon: LayoutDashboard },
  // Adicione outros itens conforme necessário
];

const utilityItems: NavItem[] = [
  { name: 'Configurações', href: 'settings', icon: Menu },
  // Adicione outros itens conforme necessário
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleNavigationClick = () => {
    if (isOpen) {
      setIsOpen(false); // Fecha a sidebar no mobile após navegação
    }
  };

  // Função para verificar se o link está ativo
  const isActive = (href: string) => {
    const fullHref = `/adm/${href}`;
    // Handle caso pathname seja null ou undefined
    if (href === 'produtos' && pathname === '/adm/produtos/add') {
      return false;
    }
    return pathname === fullHref || (pathname.startsWith(fullHref + '/') && href !== '');
  };

  return (
    <>
      {/* Botão de Toggle (Visível Apenas em Mobile) */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-700 bg-white rounded-md shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Overlay (Fundo Escuro) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Principal */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col justify-between z-30 font-[Poppins-light]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:block
        `}
      >
        {/* Top Section */}
        <div className="flex-1">
          {/* Logo/Title */}
          <div className="flex items-center p-4 h-16 border-b border-gray-200 font-[Poppins-light]">
            <span className="text-xl font-bold text-gray-800 flex items-center">
              <span className="w-6 h-6 bg-[#ffffff] rounded-full mr-2"></span>
              Gestão de Inventário
            </span>
          </div>

          {/* Main Navigation */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const href = `/adm/${item.href}`;
              const isCurrent = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={href}
                  onClick={handleNavigationClick}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors 
                    ${isCurrent
                      ? 'bg-[#ffffff] text-gray-600 shadow-md hover:bg-gray-100'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}

            {/* Opção Adicionar Nova Peça */}
            <Link
              href="/adm/produtos/add"
              onClick={handleNavigationClick}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors mt-4 border border-green-300 font-[Poppins-light]
                ${isActive('produtos/add')
                  ? 'bg-green-600 text-white shadow-md hover:bg-green-700'
                  : 'text-gray-600 hover:bg-green-100 hover:text-green-700'
                }`}
            >
              <Plus className="mr-3 h-5 w-5" />
              Adicionar Nova Peça
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

