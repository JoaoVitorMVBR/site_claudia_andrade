// app/api/clothing/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/lib/firebase';
import { addDoc, collection, updateDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const color = formData.get('color') as string;
    const size = formData.get('size') as string;
    const frontImage = formData.get('frontImage') as File;
    const backImage = formData.get('backImage') as File;

    // Validação
    if (!name || !type || !color || !size || !frontImage || !backImage) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    if (frontImage.size > 10 * 1024 * 1024 || backImage.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Imagem muito grande (máx. 10MB).' }, { status: 400 });
    }

    // 1. Cria o documento primeiro → gera ID real do Firestore
    const docRef = await addDoc(collection(db, 'clothing'), {
      name,
      type,
      color,
      size,
      frontImageUrl: '',  // placeholder
      backImageUrl: '',   // placeholder
      destaque: false,
      createdAt: new Date(),
    });

    const productId = docRef.id; // ← ID GERADO PELO FIRESTORE

    // 2. Upload das imagens usando o ID real
    const [frontUrl, backUrl] = await Promise.all([
      uploadImage(frontImage, `${productId}_front`),
      uploadImage(backImage, `${productId}_back`),
    ]);

    // 3. Atualiza o documento com as URLs e o próprio ID
    await updateDoc(docRef, {
      id: productId,
      frontImageUrl: frontUrl,
      backImageUrl: backUrl,
    });

    return NextResponse.json({ success: true, id: productId });
  } catch (error: any) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json({ error: 'Erro interno.', details: error.message }, { status: 500 });
  }
}

async function uploadImage(file: File, filename: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const storageRef = ref(storage, `clothing/${filename}`);
  const snapshot = await uploadBytes(storageRef, buffer, { contentType: file.type });
  return getDownloadURL(snapshot.ref);
}