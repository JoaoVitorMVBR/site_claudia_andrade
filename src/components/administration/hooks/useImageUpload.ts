import { useState } from "react";
import { uploadFile, generateFileName } from "@/shared/utils/uploadUtils";

export const useImageUpload = () => {
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [progressFront, setProgressFront] = useState(0);
  const [progressBack, setProgressBack] = useState(0);

  const uploadImages = async (
    frontFile: File | null,
    backFile: File | null
  ): Promise<{ frontUrl: string | null; backUrl: string | null }> => {
    let frontUrl: string | null = null;
    let backUrl: string | null = null;

    if (frontFile) {
      setUploadingFront(true);
      setProgressFront(0);
      try {
        const fileName = generateFileName(frontFile.name, "front");
        const result = await uploadFile(frontFile, fileName, setProgressFront);
        frontUrl = result.url;
      } finally {
        setUploadingFront(false);
      }
    }

    if (backFile) {
      setUploadingBack(true);
      setProgressBack(0);
      try {
        const fileName = generateFileName(backFile.name, "back");
        const result = await uploadFile(backFile, fileName, setProgressBack);
        backUrl = result.url;
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
