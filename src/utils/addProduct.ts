// utils/addProduct.ts
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ProductData = {
  name: string;
  type: string;
  color: string;
  size: string;
  frontImageUrl: string;
  backImageUrl: string;
};

export const addProduct = async (data: ProductData) => {
  const col = collection(db, "clothing");
  const docRef = await addDoc(col, {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return docRef.id; // ← Retorna o ID gerado
};