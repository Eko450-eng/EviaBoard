<script lang="ts">
import * as Dialog from '../lib/components/ui/dialog/index.js';
import { getDb } from '../lib/db';
import { toast } from 'svelte-sonner';
import { Button } from '../lib/components/ui/button/index.js';
import { Label } from '../lib/components/ui/label/index.js';
import { Input } from '../lib/components/ui/input/index.js';
import type { News, Newspost } from '@/types.js';
import { userStore } from '@/stores/user.store.js';

export let addPostOpen: boolean;
export let post: News | undefined;
export let postData: Newspost = {
	name: '',
	owner: $userStore?.id!,
};

async function addPost() {
	let db = await getDb();
	postData.owner = $userStore?.id!;

	try {
		if (!postData) return;
		await db?.create('newspost', postData).then(async (data) => {
			let newPost = data;
			await db?.insert_relation('news_post', {
				in: post?.id,
				out: newPost[0].id,
			});
			addPostOpen = false;
		});
	} catch (e) {
		console.error(e);
		toast.error('Fehler', {
			description: `This failed due to: ${e}, probably not my fault`,
		});
	}
}
</script>

<Dialog.Root
    open={addPostOpen}
    onOpenChange={() => (addPostOpen = !addPostOpen)}
>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Post beitragen</Dialog.Title>
            <Dialog.Description>
                Trage zur Knowledgebase bei!
            </Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <form on:submit={addPost}>
                <div>
                    <Label for="title" class="text-right">Titel</Label>
                    <Input
                        id="title"
                        bind:value={postData.name}
                        class="col-span-3"
                    />
                </div>
                <Dialog.Footer>
                    <Button type="submit">Posten</Button>
                </Dialog.Footer>
            </form>
        </div>
    </Dialog.Content>
</Dialog.Root>
