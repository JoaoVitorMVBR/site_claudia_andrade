import {
  SquareDashedKanban,
  LayoutDashboard,
  Users,
  Settings,
  ShoppingCart,
  Shirt,
} from 'lucide-react';
import { NavItem, Product } from '../types'; // Importa os tipos

export const navItems: NavItem[] = [
  { name: 'Dashboard', href: '#', icon: LayoutDashboard },
  { name: 'Products', href: '#', icon: Shirt, current: true },
  // { name: 'Orders', href: '#', icon: ShoppingCart },
  // { name: 'Customers', href: '#', icon: Users },
];

export const utilityItems: NavItem[] = [
  // { name: 'Settings', href: '#', icon: Settings },
  // { name: 'Help and docs', href: '#', icon: SquareDashedKanban },
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Classic Tee',
    type: 'T-Shirt',
    color: 'White',
    size: 'M',
    image: '/images/t-shirt.png',
  },
  {
    id: 2,
    name: 'Slim Fit Jeans',
    type: 'Jeans',
    color: 'Blue',
    size: '32',
    image: '/images/jeans.png',
  },
  {
    id: 3,
    name: 'Summer Dress',
    type: 'Dress',
    color: 'Floral',
    size: 'S',
    image: '/images/dress.png',
  },
  {
    id: 4,
    name: 'Leather Jacket',
    type: 'Jacket',
    color: 'Black',
    size: 'L',
    image: '/images/jacket.png',
  },
  {
    id: 5,
    name: 'Running Shorts',
    type: 'Shorts',
    color: 'Gray',
    size: 'M',
    image: '/images/shorts.png',
  },
];