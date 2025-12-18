import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/products';
import { COLORS } from '../constants';

interface ProductCardProps {
  product: Product;
  href?: string;
  onClick?: () => void;
  showDetails?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  href,
  onClick,
  showDetails = true,
  className = '',
}) => {
  const cardContent = (
    <div className={`group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${className}`}>
      <div className="relative w-full aspect-[3/4] bg-gray-50">
        <Image
          src={product.frontImageUrl}
          alt={product.name}
          fill
          className="object-contain object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwkHBgoJCAkLCwoMDxkQDw4ODx4WFxIZJCAmJSMgIyMjKC0fHB4oMjIyKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/2wBDAQoLCw4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4NDx4N/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAv/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/8QAFRABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A..."
        />
      </div>
      
      {showDetails && (
        <div className="p-4 text-center">
          <h3 className={`font-[Poppins-light] text-xl text-[${COLORS.primary}] mb-2 group-hover:text-[${COLORS.secondary}] transition-colors duration-300`}>
            {product.name}
          </h3>
          <p className={`font-[Poppins-light] text-lg text-[${COLORS.secondary}]`}>
            {product.type} • {product.color}
          </p>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick}>
        {cardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {cardContent}
      </button>
    );
  }

  return cardContent;
};
