import { LucideIcon } from 'lucide-react';

// 1. Tipo para Itens de Navegação da Sidebar
export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  current?: boolean;
}

// 2. Tipo para o Objeto Peça de Roupa (Produto)
export interface Product {
  id: number;
  name: string;
  type: string;
  color: string;
  size: string;
  image: string; // URL ou caminho local
}