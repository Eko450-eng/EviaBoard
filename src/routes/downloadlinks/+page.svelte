<script lang="ts">
import {
	Button,
	buttonVariants,
} from '../../lib/components/ui/button/index.js';
import { onMount } from 'svelte';
import * as Dialog from '$lib/components/ui/dialog/index.js';
import Plus from 'svelte-radix/Plus.svelte';
import Label from '@/components/ui/label/label.svelte';
import Input from '@/components/ui/input/input.svelte';
import { RecordId } from 'surrealdb';
import type { Downloadlinks, User } from '@/types.js';
import { checkOwner, editorOnly } from '@/helpers/admin.js';
import { userStore } from '@/stores/userstore.js';

let { data } = $props();

let dialogOpen = false;

let postData: Downloadlinks = {
	id: new RecordId('', ''),
	name: 'Name',
	description: 'Kurze Beschreibung!',
	link: 'https://....',
	owner: $userStore!,
};

// TODO: Implement
async function deleteLink(id: RecordId) {
	// let db = await getDb();
	// await db?.delete(id);
}

// TODO: Implement
async function postLinks() {
	// let db = await getDb();
	// await db
	// 	?.query(
	// 		` CREATE downloadlinks CONTENT{
	//            name:  "${postData.name}",
	//            description:  "${postData.description}",
	//            link:  "${postData.link}",
	//            owner: ${user_id},
	//            created_at: d"${new Date().toISOString()}",
	//        }`,
	// 	)
	// 	.then(() => {
	// 		dialogOpen = false;
	// 	});
}

// TODO: Implement
onMount(async () => {
	// let db = await getDb();
	// if (db && db.ready) {
	// 	getLinks();
	// 	const queryUuid = await db?.live(
	// 		'downloadlinks',
	// 		// eslint-disable-next-line
	// 		(action, _result) => {
	// 			if (action === 'CLOSE') return;
	// 		},
	// 	);
	// 	// eslint-disable-next-line
	// 	await db?.subscribeLive(queryUuid!, async (action, _result) => {
	// 		if (action === 'CREATE' || action === 'UPDATE' || action === 'DELETE') {
	// 			getLinks();
	// 		}
	// 	});
	// }
});
</script>

<div class="flex flex-wrap items-center justify-end">
    <Dialog.Root open={dialogOpen}>
        {#if editorOnly()}
            <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
                <Plus />
            </Dialog.Trigger>
        {/if}
        <Dialog.Content class="sm:max-w-[425px]">
            <Dialog.Header>
                <Dialog.Title>Add post</Dialog.Title>
                <Dialog.Description>
                    Trage zur Knowledgebase bei!
                </Dialog.Description>
            </Dialog.Header>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="title" class="text-right">Name</Label>
                    <Input
                        id="title"
                        bind:value={postData.name}
                        class="col-span-3"
                    />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="body" class="text-right">Beschreibung</Label>
                    <Input
                        id="body"
                        bind:value={postData.description}
                        class="col-span-3"
                    />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="solution" class="text-right">Link</Label>
                    <Input
                        id="solution"
                        bind:value={postData.link}
                        class="col-span-3"
                    />
                </div>
            </div>
            <Dialog.Footer>
                <Button type="submit" onclick={postLinks}>Posten</Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
</div>

<div>
    {#each data.data as link}
        <div class="flex flex-wrap w-full justify-between my-2">
            <Button
                class="gap-3"
                variant="link"
                href={link.link}
                target="_blank"
            >
                <p>{link.name}</p>
                <p class="opacity-80">{link.description}</p>
            </Button>
            {#if $userStore?.id && checkOwner(link.owner as User)}
                <Button
                    variant="destructive"
                    onclick={() => {
                        if (link && link.id) deleteLink(link.id);
                    }}>Delete</Button
                >
            {/if}
        </div>
    {/each}
</div>
