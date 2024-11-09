<script lang="ts">
import * as Select from '$lib/components/ui/select/index.js';
import { toast } from 'svelte-sonner';
import { Button } from '$lib/components/ui/button/index.js';
import { Label } from '$lib/components/ui/label/index.js';
import { Input } from '$lib/components/ui/input/index.js';
import '$lib/themes/github.scss';
import type { Post, Topic } from '@/types.js';
import { goto } from '$app/navigation';
import { RecordId } from 'surrealdb';
import carta from '@/helpers/carta.js';
import { MarkdownEditor } from 'carta-md';
import { getDb } from '@/db.js';

let { data } = $props();
// eslint-disable-next-line
let selectedTopic: any = $state();
let topics: Topic[] = $state([]);

async function getPost() {
	let db = await getDb();
	if (data.params.slug) {
		let query = `select id, body, title, solution, topic.name as topic, owner.id, owner.name, owner.image, deleted from posts WHERE id=${data.params.slug}`;
		let posts_raw = await db?.query<Array<Array<Post>>>(query);
		if (!posts_raw) return;
		postData = posts_raw[0][0];
		selectedTopic = postData.topic;
	}
}

$effect(() => {
	getPost();
});

let postData: Post = $state({
	deleted: false,
	title: '',
	body: '',
	solution: '',
	owner: new RecordId('', ''),
	topic: '',
});

$effect(() => {
	topics = data.topics as Topic[];
});

async function editPost() {
	let db = await getDb();
	try {
		if (!postData.id) return;
		await db
			?.patch(postData.id, [
				{
					op: 'replace',
					path: '/deleted',
					value: postData.deleted,
				},
				{ op: 'replace', path: '/title', value: postData.title },
				{ op: 'replace', path: '/body', value: postData.body },
				{
					op: 'replace',
					path: '/solution',
					value: postData.solution,
				},
			])
			.then(() => {
				toast.success('Geupdated', {
					description: `Update hochgeladen`,
				});
				goto(`/knowledgeboard`);
			});
	} catch (e) {
		console.error(e);
		toast.error('Fehler', {
			description: `This failed due to: ${e}, probably not my fault`,
		});
	}
}
</script>

<h1>Post beitragen</h1>
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
        {carta}
        bind:value={postData.body}
    />

    <div>
        <Label for="solution" class="text-right">Lösung</Label>
        <MarkdownEditor
            mode="tabs"
            theme="discord"
            {carta}
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
                {#if topics}
                    {#each topics as topic}
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
