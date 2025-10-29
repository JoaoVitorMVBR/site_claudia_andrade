export interface Product {
  id: string;
  name: string;
  type: string;
  color: string;
  size: string;
  frontImageUrl: string;
  backImageUrl: string;
  destaque?: boolean;
  createdAt?: string;
}