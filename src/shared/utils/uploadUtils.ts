import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { UPLOAD_CONFIG } from '../constants';

export interface UploadProgress {
  progress: number;
  uploading: boolean;
}

export interface UploadResult {
  url: string;
  fileName: string;
}

export const validateFile = (file: File): string | null => {
  if (file.size > UPLOAD_CONFIG.maxSize) {
    return `Arquivo muito grande. Máximo: ${UPLOAD_CONFIG.maxSize / (1024 * 1024)}MB`;
  }

  if (!UPLOAD_CONFIG.allowedTypes.includes(file.type)) {
    return 'Tipo de arquivo não permitido. Use: JPG, PNG ou WebP';
  }

  return null;
};

export const generateFileName = (originalName: string, prefix?: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const extension = originalName.split('.').pop() || 'jpg';
  
  return prefix 
    ? `${prefix}-${timestamp}-${random}.${extension}`
    : `${timestamp}-${random}.${extension}`;
};

export const uploadFile = async (
  file: File,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  const validation = validateFile(file);
  if (validation) {
    throw new Error(validation);
  }

  const storageRef = ref(storage, `${UPLOAD_CONFIG.storagePath}/${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ url, fileName });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

export const uploadMultipleFiles = async (
  files: { file: File; prefix: string }[],
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const { file, prefix } = files[i];
    const fileName = generateFileName(file.name, prefix);
    
    const result = await uploadFile(file, fileName, (progress) => {
      onProgress?.(i, progress);
    });
    
    results.push(result);
  }
  
  return results;
};
