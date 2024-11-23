<script lang="ts">
import * as Select from '$lib/components/ui/select/index.js';
import { toast } from 'svelte-sonner';
import { Button } from '$lib/components/ui/button/index.js';
import { Label } from '$lib/components/ui/label/index.js';
import { Input } from '$lib/components/ui/input/index.js';
import '$lib/themes/github.scss';
import type { Post } from '@/types.js';
import { goto } from '$app/navigation';
import { Carta, MarkdownEditor } from 'carta-md';
import { code } from '@cartamd/plugin-code';
import { attachment } from '@cartamd/plugin-attachment';
import { anchor } from '@cartamd/plugin-anchor';
import { imsize } from 'carta-plugin-imsize';
import DOMPurify from 'isomorphic-dompurify';
import { uploadFileGeneric } from '@/helpers/minio.js';
import '$lib/themes/github.scss';
import type { PageServerData } from './$types';
import { onDestroy } from 'svelte';

let { data }: PageServerData = $props();
let selectedTopic = $state<string>('');

const cartaBody = new Carta({
	sanitizer: DOMPurify.sanitize,
	extensions: [
		anchor(),
		code(),
		imsize(),
		attachment({
			upload(file) {
				return uploadFileGeneric(file);
			},
		}),
	],
});

const cartaSolution = new Carta({
	sanitizer: DOMPurify.sanitize,
	extensions: [
		anchor(),
		code(),
		imsize(),
		attachment({
			upload(file) {
				return uploadFileGeneric(file);
			},
		}),
	],
});

let postData: Post = $state(data.posts[0]);

onDestroy(() => {
	cartaBody.dispatcher;
});

async function editPost() {
	console.log(postData);
	await fetch(`/api/knowledgebase/edit?id=${postData.id}`, {
		method: 'PATCH',
		credentials: 'include',
		body: JSON.stringify({ postData }),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(async (res) => {
		let response = await res.json();
		if (res.status === 200) {
			goto(`/knowledgeboard/${postData.id}`, { replaceState: true });
			toast.success(response.title, {
				description: response.description,
			});
		} else {
			toast.error(response.title, {
				description: response.description,
			});
		}
	});
}
</script>

<h1>Post Anpassen</h1>
<p>Trage zur Knowledgebase bei!</p>
<div class="grid gap-4 py-4">
    <div>
        <Label for="title" class="text-right">Titel</Label>
        <Input id="title" bind:value={postData.title} class="col-span-3" />
    </div>
    <div>
        <Label for="body" class="text-right">Beschreibung</Label>
    </div>

    <MarkdownEditor
        mode="tabs"
        theme="github"
        carta={cartaBody}
        bind:value={postData.body}
    />

    <div>
        <Label for="solution" class="text-right">Lösung</Label>
        <MarkdownEditor
            mode="tabs"
            theme="github"
            carta={cartaSolution}
            bind:value={postData.solution}
        />
    </div>
    <Select.Root type="single">
        <Select.Trigger class="w-[180px]">
            <Select.Item value={selectedTopic} />
        </Select.Trigger>
        <Select.Content>
            <Select.Group>
                <Select.GroupHeading>Themen</Select.GroupHeading>
                {#if data.topics}
                    {#each data.topics as topic}
                        <Select.Item value={topic.name} label={topic.name}
                            >{topic.name}</Select.Item
                        >
                    {/each}
                {/if}
            </Select.Group>
        </Select.Content>
    </Select.Root>
</div>
<Button type="submit" onclick={editPost}>Updaten</Button>
