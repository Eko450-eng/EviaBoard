<script lang="ts">
import * as Dialog from '$lib/components/ui/dialog/index.js';
import { Button } from '$lib/components/ui/button/index.js';
import type { Post } from '@/types';
import * as cookies from 'js-cookie';
import { invalidateAll } from '$app/navigation';
import { PUBLIC_HOST } from '$env/static/public';

async function deletePost(data: Post) {
	const token = cookies.default.get('jwt');

	await fetch(`${PUBLIC_HOST}/api/knowledgebase`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ id: data.id, state: true }),
	}).then(() => {
		invalidateAll();
	});
}

export let deleteDialog: boolean;
export let postToDelete: Post | undefined;

document.addEventListener('keydown', function (event) {
	if (event.key === 'Escape' || event.key === 'Esc') deleteDialog = false;
});
</script>

<Dialog.Root
    open={deleteDialog}
    onOpenChange={() => (deleteDialog = !deleteDialog)}
>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Really?</Dialog.Title>
            <Button
                variant="destructive"
                onclick={() => {
                    if (postToDelete) {
                        deletePost(postToDelete);
                        deleteDialog = !deleteDialog;
                    }
                }}>Yes</Button
            >
            <Button
                onclick={() => {
                    deleteDialog = !deleteDialog;
                    postToDelete = undefined;
                }}>No</Button
            >
        </Dialog.Header>
    </Dialog.Content>
</Dialog.Root>
