<script lang="ts">
import * as Select from '$lib/components/ui/select/index.js';
import { toast } from 'svelte-sonner';
import { Button } from '$lib/components/ui/button/index.js';
import { Label } from '$lib/components/ui/label/index.js';
import { Input } from '$lib/components/ui/input/index.js';
import type { Post, Topic } from '@/types.js';
import { sendPush } from '@/helpers/push.js';
import { RecordId } from 'surrealdb';
import { MarkdownEditor } from 'carta-md';
import { userStore } from '@/stores/userstore.js';
import { Carta } from 'carta-md';
import { code } from '@cartamd/plugin-code';
import { attachment } from '@cartamd/plugin-attachment';
import { anchor } from '@cartamd/plugin-anchor';
import { imsize } from 'carta-plugin-imsize';
import DOMPurify from 'isomorphic-dompurify';
import { uploadFileGeneric } from '@/helpers/minio.js';
import '$lib/themes/github.scss';
import { goto } from '$app/navigation';

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

const { data } = $props();
$effect(() => {
	console.log(data);
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

// let { data } = $props();
// eslint-disable-next-line
let value: any = $state();
let topics: Topic[] = $state([]);

let postData: Post = $state({
	deleted: false,
	title: '',
	body: '',
	solution: '',
	owner: new RecordId('', ''),
	topic: new RecordId('', ''),
});

$effect(() => {
	topics = data.topics as Topic[];
});

async function addPost() {
	let topic = new RecordId('topics', value);
	postData.topic = topic;
	postData.owner = $userStore?.id!;

	if (!postData.topic || postData.topic === new RecordId('', '')) {
		toast.error('Fehler', {
			description: 'Kategorie nicht vergessen!',
		});
		return;
	}
	if (!postData) return;

	await fetch('/api/knowledgebase', {
		method: 'POST',
		body: JSON.stringify({ postData }),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(async (res) => {
		let response = await res.json();

		if (res.status === 200) {
			toast.success(response.title, {
				description: response.description,
			});
			sendPush(
				'New Posts',
				`Es gab einen neuen Post von ${$userStore?.name} - ${postData.title}`,
			);
			await goto('/knowledgeboard', { replaceState: true });
		} else {
			toast.error(response.title, {
				description: response.description,
			});
		}
	});
}

const triggerContent = $derived(
	data.topics!.find((f: Topic) => f.name === value)?.name ?? 'Kategorie',
);
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


        <MarkdownEditor 
        mode="tabs" 
        theme="github" 
        carta={cartaBody} 
        bind:value={postData.body} 
        /> 



    </div>
    <div>
        <Label for="solution" class="text-right">Lösung</Label>
        <MarkdownEditor
            mode="tabs"
            theme="github" 
            carta={cartaSolution}
            bind:value={postData.solution}
        />
    </div>
    <Select.Root type="single" name="topic" bind:value={value}>
      <Select.Trigger class="w-[180px]">
        {triggerContent}
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.GroupHeading>Kategorie</Select.GroupHeading>
          {#each data.topics! as topic}
            <Select.Item value={topic.name} label={topic.name}
              >{topic.name}</Select.Item
            >
          {/each}
        </Select.Group>
      </Select.Content>
    </Select.Root>
</div>
<Button type="submit" onclick={addPost}>Posten</Button>
