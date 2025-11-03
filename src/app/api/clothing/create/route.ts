// app/api/clothing/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, updateDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const color = formData.get('color') as string;
    const frontImage = formData.get('frontImage') as File;
    const backImage = formData.get('backImage') as File;

    // Captura múltiplos tamanhos (pode haver vários `size` no formData)
    const sizes = (formData.getAll('size') as string[])
      .map(size => size.trim())
      .filter(size => size !== '');

    // Validação
    if (!name || !type || !color || sizes.length === 0 || !frontImage || !backImage) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    // Valida tamanho das imagens (máx. 10MB)
    if (frontImage.size > 10 * 1024 * 1024 || backImage.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Imagem muito grande (máx. 10MB).' }, { status: 400 });
    }

    // 1️⃣ Cria o documento no Firestore (sem URLs ainda)
    const docRef = await addDoc(collection(db, 'clothing'), {
      name,
      type,
      color,
      sizes, // <--- agora é array real
      frontImageUrl: '',
      backImageUrl: '',
      destaque: false,
      createdAt: new Date(),
    });

    const productId = docRef.id;

    // 2️⃣ Faz upload das imagens em paralelo
    const [frontUrl, backUrl] = await Promise.all([
      uploadImage(frontImage, `${productId}_front`),
      uploadImage(backImage, `${productId}_back`),
    ]);

    // 3️⃣ Atualiza o documento com as URLs e o ID
    await updateDoc(docRef, {
      id: productId,
      frontImageUrl: frontUrl,
      backImageUrl: backUrl,
    });

    return NextResponse.json({ success: true, id: productId });
  } catch (error: any) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno.', details: error.message },
      { status: 500 }
    );
  }
}

async function uploadImage(file: File, filename: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const storageRef = ref(storage, `clothing/${filename}`);
  const snapshot = await uploadBytes(storageRef, buffer, { contentType: file.type });
  return getDownloadURL(snapshot.ref);
}
