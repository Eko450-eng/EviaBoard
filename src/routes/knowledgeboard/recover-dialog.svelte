<script lang="ts">
import * as Dialog from '$lib/components/ui/dialog/index.js';
import { Button } from '$lib/components/ui/button/index.js';
import type { Post } from '@/types';
import * as cookies from 'js-cookie';
import { invalidateAll } from '$app/navigation';
import { PUBLIC_HOST } from '$env/static/public';

async function recoverPost(data: Post) {
	const token = cookies.default.get('jwt');

	await fetch(`${PUBLIC_HOST}/api/knowledgebase`, {
		method: 'PATCh',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ id: data.id, state: false }),
	}).then(() => {
		invalidateAll();
	});
}

export let recoverDialog: boolean;
export let postToRecover: Post | undefined;
document.addEventListener('keydown', function (event) {
	if (event.key === 'Escape' || event.key === 'Esc') recoverDialog = false;
});
</script>

<Dialog.Root
    open={recoverDialog}
    onOpenChange={() => (recoverDialog = !recoverDialog)}
>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Really?</Dialog.Title>
            <Button
                variant="destructive"
                onclick={() => {
                    if (postToRecover) {
                        recoverPost(postToRecover);
                        recoverDialog = !recoverDialog;
                    }
                }}>Yes</Button
            >
            <Button
                onclick={() => {
                    recoverDialog = !recoverDialog;
                    postToRecover = undefined;
                }}>No</Button
            >
        </Dialog.Header>
    </Dialog.Content>
</Dialog.Root>
