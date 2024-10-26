import { uploadToMinio } from "@/minio";
import type { User } from "@/types";

let file: File | null;

export function fileUploadHandler(e: Event) {
	const input = e.target as HTMLInputElement;
	if (!input.files || !input.files[0]) return;
	file = input.files[0];
}

export const uploadFileGeneric = async (
	input: File,
): Promise<string | null> => {
	if (!input) return null;

	try {
		uploadToMinio("eviaboard", input.name, input);
		return `https://minio.eko450eng.org/eviaboard/${input.name} =100x100`;
	} catch (error) {
		console.error("Error uploading file:", error);
		return null;
	}
};

// Function to handle the file upload
export const uploadFile = async (
	fileName: string,
): Promise<{ success: boolean; msg: string }> => {
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
			msg: `Upload erfolgreich`,
		};
	} catch (error) {
		console.error("Error uploading file:", error);
		return {
			success: false,
			msg: `Da ist was schief gelaufen: ${error}, wahrscheinlich nicht meine Schuld`,
		};
	}
};

export async function generateAvatar(userData: User) {
	if (!userData.id) return;

	const userid = userData.id.toString();
	if (!userid) return "";

	await uploadFile(userData.id + ".png");
}
