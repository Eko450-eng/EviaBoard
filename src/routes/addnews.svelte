<script lang="ts">
import * as Dialog from '$lib/components/ui/dialog/index.js';
import { toast } from 'svelte-sonner';
import { Button, buttonVariants } from '../lib/components/ui/button/index.js';
import Plus from 'svelte-radix/Plus.svelte';
import { Label } from '../lib/components/ui/label/index.js';
import { Input } from '../lib/components/ui/input/index.js';
import type { News } from '@/types';
import { userStore } from '@/stores/userstore';
import { invalidateAll } from '$app/navigation';
import { getToken } from '@/helpers/gettoken.js';

export let addPostOpen: boolean;
export let postData: News = {
	title: '',
	owner: $userStore?.id!,
};

async function addPost() {
	if (!postData) return;
	let token = getToken();
	await fetch('/api/news/addNews', {
		method: 'POST',
		body: JSON.stringify({ postData, token }),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(async (res) => {
		let response = await res.json();
		if (res.status === 200) {
			addPostOpen = false;
			toast.success(await response.title, {
				description: response.description,
			});
			invalidateAll();
		} else {
			toast.error(await response.title, {
				description: response.description,
			});
		}
	});
}
</script>

<Dialog.Root
    open={addPostOpen}
    onOpenChange={() => (addPostOpen = !addPostOpen)}
>
    <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
        <Plus />
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Post beitragen</Dialog.Title>
            <Dialog.Description>
                Trage zur Knowledgebase bei!
            </Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <div>
                <Label for="title" class="text-right">Titel</Label>
                <Input
                    id="title"
                    bind:value={postData.title}
                    class="col-span-3"
                />
            </div>
        </div>
        <Dialog.Footer>
            <Button type="submit" onclick={addPost}>Posten</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
