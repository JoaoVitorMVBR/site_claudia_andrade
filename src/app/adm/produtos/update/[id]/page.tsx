'use client';
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ClothingForm from '@/components/administration/UpdateClothingForm';
import { useRouter } from 'next/navigation';

export default function EditarVestidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params); // Desembrulha params
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/clothing/getById/${id}`);
        if (!res.ok) throw new Error("Vestido não encontrado");
        const data = await res.json();
        setProduct(data);
      } catch {
        alert("Erro ao carregar vestido.");
        router.push('/gerenciar');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const handleUpdate = async (formData: FormData) => {
    const res = await fetch(`/api/clothing/update/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Erro ao atualizar.");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 text-center">
        <Loader2 className="mx-auto animate-spin w-8 h-8 text-blue-600" />
        <p className="text-gray-500 mt-2">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl md:text-3xl font-[Poppins-light] text-gray-800 mb-8">
        Editar Vestido
      </h1>
      <ClothingForm
        initialData={product}
        onSubmit={handleUpdate}
        submitLabel="Atualizar Vestido"
        isEdit={true}
      />
    </div>
  );
}