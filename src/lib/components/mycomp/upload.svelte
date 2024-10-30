<script lang="ts">
import { uploadToMinio } from '$lib/minio';
import { toast } from 'svelte-sonner';
import { Button } from '$ui/button';
import { Input } from '$ui/input';

let file: File | null = null;

function fileUploadHandler(e: Event) {
	const input = e.target as HTMLInputElement;
	if (!input.files || !input.files[0]) return;
	file = input.files[0];
}

// Function to handle the file upload
const uploadFile = async (fileName: string) => {
	if (!file) {
		toast.error('Fehler', {
			description: `Wolltest du denn auch noch was hochladen?`,
		});
		return;
	}
	try {
		uploadToMinio('eviaboard', fileName, file);
	} catch (error) {
		console.error('Error uploading file:', error);
		toast.error('Fehler', {
			description: `Da ist was schief gelaufen: ${error}, wahrscheinlich nicht meine Schuld`,
		});
	}
};
</script>

<div class="flex gap-2">
    <Input type="file" onchange={fileUploadHandler} />
    <Button onclick={() => uploadFile("TADA")}>Hochladen</Button>
</div>
