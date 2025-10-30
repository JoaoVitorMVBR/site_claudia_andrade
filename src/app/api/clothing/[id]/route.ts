// app/api/clothing/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  const { id } = params;

  console.log('API DELETE iniciada para ID:', id); // ← LOG INICIAL

  try {
    const docRef = doc(db, 'clothing', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Vestido não encontrado' }, { status: 404 });
    }

    const data = docSnap.data();
    const frontUrl = data.frontImageUrl;
    const backUrl = data.backImageUrl;

    // FUNÇÃO PARA DELETAR IMAGEM
    const deleteImage = async (url: string) => {
      if (!url) return;

      try {
        // 1. Decodifica a URL
        const decoded = decodeURIComponent(url);

        // 2. Extrai o caminho após /o/
        const path = decoded.split('/o/')[1]?.split('?')[0];
        if (!path) return;

        // 3. Cria referência e deleta
        const imageRef = ref(storage, path);
        // console.log(imageRef)
        await deleteObject(imageRef);
        console.log('Imagem deletada:', path);
      } catch (err: any) {
        console.warn('Falha ao deletar imagem:', url, err.message);
        // Não para o processo
      }
    };

    // Deleta as duas imagens em paralelo
    await Promise.all([deleteImage(frontUrl), deleteImage(backUrl)]);

    // Deleta o documento
    await deleteDoc(docRef);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao deletar:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}