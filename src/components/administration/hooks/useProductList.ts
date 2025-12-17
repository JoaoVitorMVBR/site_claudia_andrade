import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types/products";
import { clothingService } from "../services/clothingService";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const useProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");

  const fetchProducts = useCallback(
    async (cursor: string | null = null, append = false) => {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      try {
        const data = await clothingService.fetchProducts(cursor, currentSearch);
        const items: Product[] = Array.isArray(data.items) ? data.items : [];

        if (append) {
          setProducts((prev) => [...prev, ...items]);
        } else {
          setProducts(items);
        }

        setNextCursor(data.nextCursor || null);
        setHasMore(!!data.nextCursor);
      } catch (error) {
        console.error(error);
        setProducts([]);
        alert("Erro ao carregar vestidos.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [currentSearch]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = () => {
    setCurrentSearch(searchTerm.trim());
    setNextCursor(null);
    setProducts([]);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentSearch("");
  };

  const loadMore = () => {
    if (nextCursor && !loadingMore) {
      fetchProducts(nextCursor, true);
    }
  };

  const toggleDestaque = async (productId: string, currentValue: boolean) => {
    const highlightedCount = products.filter((p) => p.destaque).length;
    if (!currentValue && highlightedCount >= 3) {
      alert("Máximo de 3 itens em destaque permitidos.");
      return;
    }

    try {
      await updateDoc(doc(db, "clothing", productId), { destaque: !currentValue });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, destaque: !currentValue } : p))
      );
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar destaque.");
    }
  };

  const handleRemove = async (productId: string) => {
    if (!confirm("Tem certeza?")) return;

    try {
      await clothingService.delete(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      alert("Removido com sucesso!");
    } catch (err: any) {
      console.error("Erro no fetch:", err);
      alert("Erro ao remover");
    }
  };

  return {
    products,
    loading,
    loadingMore,
    hasMore,
    searchTerm,
    currentSearch,
    setSearchTerm,
    handleSearch,
    clearSearch,
    loadMore,
    toggleDestaque,
    handleRemove,
  };
};
