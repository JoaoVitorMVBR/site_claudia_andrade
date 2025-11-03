import { NextRequest, NextResponse } from 'next/server';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ← params é uma Promise
) {
  const { id } = await params; // ← Use await, NÃO React.use()

  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const color = formData.get('color') as string;
    const sizes = (formData.getAll('size') as string[])
      .map(s => s.trim())
      .filter(s => s !== '');

    const frontImage = formData.get('frontImage') as File | null;
    const backImage = formData.get('backImage') as File | null;

    // Validação
    if (!name || !type || !color || sizes.length === 0) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando.' },
        { status: 400 }
      );
    }

    if (frontImage && frontImage.size > 10 * 1024 * 1024) {
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

    const docRef = doc(db, 'clothing', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Vestido não encontrado.' },
        { status: 404 }
      );
    }

    const currentData = docSnap.data();
    let frontImageUrl = currentData.frontImageUrl;
    let backImageUrl = currentData.backImageUrl;

    if (frontImage) {
      frontImageUrl = await uploadImage(frontImage, `${id}_front`);
    }
    if (backImage) {
      backImageUrl = await uploadImage(backImage, `${id}_back`);
    }

    await updateDoc(docRef, {
      name,
      type,
      color,
      sizes,
      frontImageUrl,
      backImageUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro no PUT:', error);
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