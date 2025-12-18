import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/products';
import { PAGINATION } from '../constants';

interface UseProductsOptions {
  search?: string;
  limit?: number;
  autoLoad?: boolean;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const { search = '', limit = PAGINATION.defaultLimit, autoLoad = true } = options;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (cursor: string | null = null, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);
    
    setError(null);

    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit.toString());

    try {
      const res = await fetch(`/api/clothing/get/?${params}`);
      if (!res.ok) throw new Error('Erro ao carregar produtos');

      const data = await res.json();
      const items: Product[] = Array.isArray(data.items) ? data.items : [];

      if (append) {
        setProducts(prev => [...prev, ...items]);
      } else {
        setProducts(items);
      }

      setNextCursor(data.nextCursor || null);
      setHasMore(!!data.nextCursor);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar produtos');
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [search, limit]);

  const loadMore = useCallback(() => {
    if (nextCursor && !loadingMore) {
      fetchProducts(nextCursor, true);
    }
  }, [nextCursor, loadingMore, fetchProducts]);

  const refresh = useCallback(() => {
    setProducts([]);
    setNextCursor(null);
    setHasMore(true);
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (autoLoad) {
      refresh();
    }
  }, [search, autoLoad, refresh]);

  return {
    products,
    loading,
    loadingMore,
    hasMore,
    error,
    fetchProducts,
    loadMore,
    refresh,
  };
};
