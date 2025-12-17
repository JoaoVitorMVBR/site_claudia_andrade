import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export const useImageUpload = () => {
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [progressFront, setProgressFront] = useState(0);
  const [progressBack, setProgressBack] = useState(0);

  const uploadImage = async (file: File, type: "front" | "back"): Promise<string> => {
    const fileExt = file.name.split(".").pop() || "";
    const fileName = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const storageRef = ref(storage, `clothing/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (type === "front") setProgressFront(progress);
          if (type === "back") setProgressBack(progress);
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  };

  const uploadImages = async (
    frontFile: File | null,
    backFile: File | null
  ): Promise<{ frontUrl: string | null; backUrl: string | null }> => {
    let frontUrl: string | null = null;
    let backUrl: string | null = null;

    if (frontFile) {
      setUploadingFront(true);
      try {
        frontUrl = await uploadImage(frontFile, "front");
      } finally {
        setUploadingFront(false);
      }
    }

    if (backFile) {
      setUploadingBack(true);
      try {
        backUrl = await uploadImage(backFile, "back");
      } finally {
        setUploadingBack(false);
      }
    }

    return { frontUrl, backUrl };
  };

  return {
    uploadImages,
    uploadingFront,
    uploadingBack,
    progressFront,
    progressBack,
  };
};
