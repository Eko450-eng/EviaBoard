<script lang="ts">
import * as Select from '$lib/components/ui/select/index.js';
import { toast } from 'svelte-sonner';
import { Button } from '$lib/components/ui/button/index.js';
import { Label } from '$lib/components/ui/label/index.js';
import { Input } from '$lib/components/ui/input/index.js';
import type { Post, Topic } from '@/types.js';
import { sendPush } from '@/helpers/push.js';
import { RecordId } from 'surrealdb';
import carta from '@/helpers/carta.js';
import { MarkdownEditor } from 'carta-md';
import { getDb } from '@/db.js';
import { userStore } from '@/stores/user.store.js';

let { data } = $props();
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
	let db = await getDb();
	let topic = new RecordId('topics', value);
	postData.topic = topic;
	postData.owner = $userStore?.id!;

	if (!postData.topic || postData.topic === new RecordId('', '')) {
		toast.error('Fehler', {
			description: 'Kategorie nicht vergessen!',
		});
		return;
	}
	try {
		if (!postData) return;
		await db?.create<Post>('posts', postData).then(() => {
			sendPush(
				'New Posts',
				`Es gab einen neuen Post von ${$userStore?.name} - ${postData.title}`,
			);
		});
	} catch (e) {
		console.error(e);
		toast.error('Fehler', {
			description: `This failed due to: ${e}, probably not my fault`,
		});
	}
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
            theme="discord"
            {carta}
            bind:value={postData.body}
        />
    </div>
    <div>
        <Label for="solution" class="text-right">Lösung</Label>
        <MarkdownEditor
            mode="tabs"
            theme="discord"
            {carta}
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
