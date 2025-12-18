'use client'

import { useEffect } from 'react';
import { useProducts, LoadingSpinner, ProductCard, Button } from '@/shared';
import { COLORS, PAGINATION } from '@/shared/constants';

const ProductGrid: React.FC = () => {
  const { products, loading, loadingMore, hasMore, loadMore } = useProducts();

  // Intersection Observer para lazy load
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: PAGINATION.loadMoreThreshold }
    );

    const sentinel = document.getElementById('sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadMore]);

  if (loading && products.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <LoadingSpinner message="Carregando vestidos..." />
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 bg-[${COLORS.white}]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={`font-[Poppins-light] text-3xl md:text-4xl text-[${COLORS.primary}] text-center mb-8 tracking-wide`}>
          Nossos Vestidos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              href={`/produtos/${product.id}`}
            />
          ))}
        </div>

        {/* Botão "Carregar mais" ou sentinel */}
        {hasMore && (
          <div id="sentinel" className="mt-12 text-center">
            {loadingMore ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Button
                variant="secondary"
                onClick={loadMore}
                className="px-6 py-2"
              >
                Carregar mais
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
