'use client';

import { Product } from '@/types/products';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';

import FiltersSidebar from '@/components/FiltersSidebar';     // ← apenas mobile (botão flutuante + drawer)
import DesktopFilters from '@/components/FiltersSidebarDesktop';     // ← apenas desktop (sidebar fixa)

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const [selectedFilters, setSelectedFilters] = useState<{
    colors: string[];
    sizes: string[];
    types: string[];
  }>({
    colors: [],
    sizes: [],
    types: [],
  });

  const fetchProducts = useCallback(async (cursor: string | null = null, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);

    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);

    try {
      const res = await fetch(`/api/clothing/get/?${params}`);
      if (!res.ok) throw new Error('Erro ao carregar');
      const { items, nextCursor: newCursor } = await res.json();

      if (append) {
        setAllProducts(prev => [...prev, ...items]);
        setProducts(prev => [...prev, ...items]);
      } else {
        setAllProducts(items);
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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const loadMore = () => {
    if (nextCursor && !loadingMore) {
      fetchProducts(nextCursor, true);
    }
  };

  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById('sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, loadingMore, nextCursor]);

  const filterOptions = useMemo(() => {
    const colorsSet = new Set<string>();
    const sizesSet = new Set<string>();
    const typesSet = new Set<string>();

    allProducts.forEach(p => {
      if (p.color) colorsSet.add(p.color.trim());
      if (p.type) typesSet.add(p.type.trim());
      p.sizes?.forEach(s => sizesSet.add(s.trim()));
    });

    return {
      colors: Array.from(colorsSet).sort().map(v => ({ value: v, label: v })),
      sizes: Array.from(sizesSet)
        .sort((a, b) => {
          const order = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XGG'];
          return order.indexOf(a) - order.indexOf(b) || a.localeCompare(b);
        })
        .map(v => ({ value: v, label: v })),
      types: Array.from(typesSet).sort().map(v => ({ value: v, label: v })),
    };
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchColor = selectedFilters.colors.length === 0 || selectedFilters.colors.includes(p.color);
      const matchType = selectedFilters.types.length === 0 || selectedFilters.types.includes(p.type);
      const matchSize =
        selectedFilters.sizes.length === 0 ||
        p.sizes?.some(size => selectedFilters.sizes.includes(size));

      return matchColor && matchType && matchSize;
    });
  }, [products, selectedFilters]);

  if (loading && products.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#000000]" />
          <p className="mt-2 text-gray-600">Carregando vestidos...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-[#FFFFFF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-[Poppins-light] text-3xl md:text-4xl text-[#000000] text-center mb-12 tracking-wide">
          Nossos Vestidos
        </h2>

        {/* Layout principal: sidebar desktop + grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros Desktop */}
          <DesktopFilters
            colors={filterOptions.colors}
            sizes={filterOptions.sizes}
            types={filterOptions.types}
            selectedFilters={selectedFilters}
            onFilterChange={(category, values) =>
              setSelectedFilters(prev => ({ ...prev, [category]: values }))
            }
          />

          {/* Grid de produtos */}
          <div className="flex-1">
            {/* Contador de resultados – só no mobile */}
            <div className="mb-6 text-center text-gray-600 lg:hidden">
              {filteredProducts.length} vestido{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </div>

            {filteredProducts.length === 0 ? (
              <p className="text-center text-gray-600 py-12 text-lg">
                Nenhum vestido encontrado com os filtros selecionados.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/produtos/${product.id}`}
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
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-[Poppins-light] text-xl text-[#000000] mb-2 group-hover:text-[#000000] transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="font-[Poppins-light] text-lg text-[#000000]">
                        {product.type} • {product.color}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Carregar mais */}
            {hasMore && (
              <div id="sentinel" className="mt-12 text-center">
                {loadingMore ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#000000]" />
                ) : (
                  <button
                    onClick={loadMore}
                    className="px-6 py-3 bg-[#cc936b] text-white rounded-lg hover:bg-[#b87c5a] transition font-medium"
                  >
                    Carregar mais
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filtros Mobile – botão flutuante + drawer */}
      <FiltersSidebar
        colors={filterOptions.colors}
        sizes={filterOptions.sizes}
        types={filterOptions.types}
        selectedFilters={selectedFilters}
        onFilterChange={(category, values) =>
          setSelectedFilters(prev => ({ ...prev, [category]: values }))
        }
      />
    </section>
  );
};

export default ProductGrid;