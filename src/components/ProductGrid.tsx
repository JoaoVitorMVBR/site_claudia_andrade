'use client';

import Image from 'next/image';
import Link from 'next/link';

// Interface para cada produto
interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  slug: string;
}

const ProductGrid: React.FC = () => {
  // Dados fictícios de produtos (substitua por seus dados reais)
  const products: Product[] = [
    { id: 1, name: 'Vestido Floral', price: 'R$ 299,00', image: '/images/vestido1.jpg', slug: 'vestido-floral' },
    { id: 2, name: 'Vestido Elegante', price: 'R$ 349,00', image: '/images/vestido2.jpg', slug: 'vestido-elegante' },
    { id: 3, name: 'Vestido Clássico', price: 'R$ 279,00', image: '/images/vestido3.jpg', slug: 'vestido-classico' },
    { id: 4, name: 'Vestido Moderno', price: 'R$ 319,00', image: '/images/vestido4.jpg', slug: 'vestido-moderno' },
    { id: 5, name: 'Vestido Casual', price: 'R$ 259,00', image: '/images/vestido5.jpg', slug: 'vestido-casual' },
    { id: 6, name: 'Vestido Luxo', price: 'R$ 399,00', image: '/images/vestido6.jpg', slug: 'vestido-luxo' },
  ];

  return (
    <section className="py-12 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-[Poppins-light] text-3xl md:text-4xl text-[#641311] text-center mb-8 tracking-wide">
          Nossos Vestidos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/produtos/${product.slug}`}
              className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative w-full h-64">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover object-center"
                  quality={75}
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-[Poppins-light] text-xl text-[#641311] mb-2 group-hover:text-[#cc936b] transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="font-[Poppins-light] text-lg text-[#cc936b]">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;