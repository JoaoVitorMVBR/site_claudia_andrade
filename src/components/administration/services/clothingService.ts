export const clothingService = {
  async checkNameExists(name: string): Promise<boolean> {
    const res = await fetch(`/api/clothing/create?name=${encodeURIComponent(name)}`);
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Erro ao verificar nome.");
    }
    const { exists } = await res.json();
    return exists;
  },

  async create(data: {
    name: string;
    type: string;
    color: string;
    sizes: string[];
    frontImageUrl: string | null;
    backImageUrl: string | null;
  }) {
    // Envia apenas metadados - as imagens já foram enviadas diretamente ao Firebase
    const res = await fetch("/api/clothing/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        type: data.type,
        color: data.color,
        sizes: data.sizes,
        frontImageUrl: data.frontImageUrl, // URL já do Firebase
        backImageUrl: data.backImageUrl,   // URL já do Firebase
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Erro ao salvar o vestido.");
    }

    return res.json();
  },

  async update(productId: string, data: {
    name: string;
    type: string;
    color: string;
    sizes: string[];
    frontImageUrl?: string | null;
    backImageUrl?: string | null;
  }) {
    // Para updates, também envia apenas metadados
    const res = await fetch(`/api/clothing/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Erro ao atualizar o vestido.");
    }

    return res.json();
  },

  async delete(productId: string) {
    const res = await fetch(`/api/clothing/${productId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error("Falha ao deletar: " + text);
    }

    return res.json();
  },

  async fetchProducts(cursor: string | null = null, search: string = "") {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    if (search) params.append("search", search);

    const res = await fetch(`/api/clothing/get/?${params}`);
    if (!res.ok) throw new Error("Falha na requisição");
    
    return res.json();
  },

  async getById(productId: string) {
    const res = await fetch(`/api/clothing/${productId}`);
    if (!res.ok) throw new Error("Erro ao buscar produto");
    
    return res.json();
  },
};
