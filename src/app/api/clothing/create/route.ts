// app/api/clothing/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, updateDoc, query, where, getDocs } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const color = formData.get('color') as string;
    const frontImage = formData.get('frontImage') as File | null;
    const backImage = formData.get('backImage') as File | null;

    // Captura múltiplos tamanhos
    const sizes = (formData.getAll('size') as string[])
      .map(size => size.trim())
      .filter(size => size !== '');

    // Validação: frente é obrigatória, verso é opcional
    if (!name || !type || !color || sizes.length === 0 || !frontImage) {
      return NextResponse.json(
        { error: 'Nome, tipo, cor, tamanhos e imagem da frente são obrigatórios.' },
        { status: 400 }
      );
    }

    // Validação de tamanho das imagens (só verifica se existir)
    if (frontImage.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Imagem da frente muito grande (máx. 10MB).' },
        { status: 400 }
      );
    }
    if (backImage && backImage.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Imagem do verso muito grande (máx. 10MB).' },
        { status: 400 }
      );
    }

    // Verificar duplicidade por nome
    const q = query(collection(db, 'clothing'), where('name', '==', name.trim()));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Já existe um vestido com este nome.' },
        { status: 409 }
      );
    }

    // 1. Criar documento no Firestore (sem URLs ainda)
    const docRef = await addDoc(collection(db, 'clothing'), {
      name: name.trim(),
      type,
      color,
      sizes,
      frontImageUrl: '',
      backImageUrl: '',
      destaque: false,
      createdAt: new Date(),
    });

    const productId = docRef.id;

    // 2. Upload das imagens (só as que existirem)
    const frontUrl = await uploadImage(frontImage, `${productId}_front`);
    const backUrlPromise = backImage ? uploadImage(backImage, `${productId}_back`) : Promise.resolve(null);

    const backUrl = await backUrlPromise;

    // 3. Atualizar documento com URLs
    await updateDoc(docRef, {
      id: productId,
      frontImageUrl: frontUrl,
      backImageUrl: backUrl || '', // se não tiver verso, salva string vazia
    });

    return NextResponse.json(
      { success: true, id: productId, message: 'Vestido criado com sucesso!' },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar o vestido.', details: error.message },
      { status: 500 }
    );
  }
}

// Função segura: só recebe File válido (nunca null)
async function uploadImage(file: File, filename: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const storageRef = ref(storage, `clothing/${filename}`);
  const snapshot = await uploadBytes(storageRef, buffer, {
    contentType: file.type || 'application/octet-stream',
  });
  return await getDownloadURL(snapshot.ref);
}