import { useState } from "react";
import { useProducts } from "@/shared/hooks/useProducts";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { clothingService } from "../services/clothingService";

export const useProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");
  
  const {
    products,
    loading,
    loadingMore,
    hasMore,
    loadMore: baseLoadMore,
    refresh,
  } = useProducts({ search: currentSearch });

  const handleSearch = () => {
    setCurrentSearch(searchTerm.trim());
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentSearch("");
  };

  const loadMore = () => {
    baseLoadMore();
  };

  const toggleDestaque = async (productId: string, currentValue: boolean) => {
    const highlightedCount = products.filter((p) => p.destaque).length;
    if (!currentValue && highlightedCount >= 3) {
      alert("Máximo de 3 itens em destaque permitidos.");
      return;
    }

    try {
      await updateDoc(doc(db, "clothing", productId), { destaque: !currentValue });
      refresh(); // Recarrega a lista
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar destaque.");
    }
  };

  const handleRemove = async (productId: string) => {
    if (!confirm("Tem certeza?")) return;

    try {
      await clothingService.delete(productId);
      refresh(); // Recarrega a lista
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
