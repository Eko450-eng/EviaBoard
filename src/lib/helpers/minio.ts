import { uploadToMinio } from "@/minio";

let file: File | null;

export function fileUploadHandler(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files || !input.files[0]) return;
  file = input.files[0];
}

// Function to handle the file upload
export const uploadFile = async (fileName: string): Promise<{ success: boolean, msg: string }> => {
  if (!file) {
    return {
      success: false,
      msg: `Wolltest du denn auch noch was hochladen?`,
    };
  }
  try {
    uploadToMinio("eviaboard", fileName, file);
    return {
      success: true,
      msg: `Upload erfolgreich`
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      msg: `Da ist was schief gelaufen: ${error}, wahrscheinlich nicht meine Schuld`,
    }
  }
};