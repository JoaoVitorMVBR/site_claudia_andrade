'use client'

import { Product } from '@/types/products';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = useCallback(async (cursor: string | null = null, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);

    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    // Opcional: filtros
    // params.append('type', 'vestido');

    try {
      const res = await fetch(`/api/clothing/get/?${params}`);
      if (!res.ok) throw new Error('Erro ao carregar');

      const { items, nextCursor: newCursor } = await res.json();

      if (append) {
        setProducts(prev => [...prev, ...items]);
      } else {
        setProducts(items);
      }
      setNextCursor(newCursor);
      setHasMore(!!newCursor);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar vestidos');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Carregar inicial
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Carregar mais
  const loadMore = () => {
    if (nextCursor && !loadingMore) {
      fetchProducts(nextCursor, true);
    }
  };

  // Intersection Observer para lazy load
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById('sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, loadingMore, nextCursor]);

  if (loading && products.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#cc936b]" />
          <p className="mt-2 text-gray-600">Carregando vestidos...</p>
        </div>
      </section>
    );
  }

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
              href={`/produtos/${product.id}`} // ← Use o ID do Firestore
              className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
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
              <div className="p-4 text-center">
                <h3 className="font-[Poppins-light] text-xl text-[#641311] mb-2 group-hover:text-[#cc936b] transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="font-[Poppins-light] text-lg text-[#cc936b]">
                  {product.type} • {product.color}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Botão "Carregar mais" ou sentinel */}
        {hasMore && (
          <div id="sentinel" className="mt-12 text-center">
            {loadingMore ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#cc936b]" />
            ) : (
              <button
                onClick={loadMore}
                className="px-6 py-2 bg-[#cc936b] text-white rounded-lg hover:bg-[#b87c5a] transition"
              >
                Carregar mais
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;