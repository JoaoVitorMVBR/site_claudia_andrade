// types.ts (Adicionar este tipo)

import { LucideIcon } from 'lucide-react';

// Novo tipo que define as telas que o Layout pode exibir
export type AdminView = 'dashboard' | 'products' | 'addProduct';


// 1. Tipo para Itens de Navegação da Sidebar (Ajustado para usar AdminView)
export interface NavItem {
  name: string;
  href: AdminView; // ALTERADO: Agora é o tipo AdminView, não string.
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