<script lang="ts">
import { toast } from 'svelte-sonner';
import * as Dialog from '$lib/components/ui/dialog/index.js';
import Plus from 'svelte-radix/Plus.svelte';
import { Label } from '$lib/components/ui/label/index.js';
import { Input } from '$lib/components/ui/input/index.js';
import { Textarea } from '$lib/components/ui/textarea/index.js';
import * as Select from '$lib/components/ui/select/index.js';
import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
import type { Report } from '@/types';
import { sendPush } from '@/helpers/push';
import { RecordId } from 'surrealdb';
import { userStore } from '@/stores/user.store';
import { columns } from './columns';
import DataTable from './bug-table.svelte';
import { invalidateAll } from '$app/navigation';

let addPostOpen = $state(false);

let {
	data,
}: {
	data: {
		data: Report[];
	};
} = $props();

let topics: Array<string> | undefined = ['Bug', 'Feature', 'Question'];
let selectedTopic = $state<string>('');
let selectedPriority = $state<string>('');

let postData: Report = $state({
	title: '',
	body: '',
	status: 0,
	category: 0,
	upvotes: 0,
	owner: new RecordId('', ''),
	priority: 0,
});

async function addPost() {
	// let db = await getDb();
	// let user = $userStore;
	// if (!user) return;
	// let category = 0;
	// switch (selectedTopic) {
	// 	case 'Bug':
	// 		category = 0;
	// 		break;
	// 	case 'Feature':
	// 		category = 1;
	// 		break;
	// 	case 'Question':
	// 		category = 2;
	// 		break;
	// 	default:
	// 		category = 0;
	// 		break;
	// }
	// try {
	// 	let data: Report = {
	// 		...postData,
	// 		category: category,
	// 		owner: user.id!,
	// 		priority: parseInt(selectedPriority),
	// 	};
	// 	await db?.create('bugreports', data).then(() => {
	// 		addPostOpen = false;
	// 		const message = () => {
	// 			switch (data.category) {
	// 				case 0:
	// 					return `Jemand bemängelt ${data.title}`;
	// 				case 1:
	// 					return `Jemand will ${data.title}`;
	// 				case 2:
	// 					return `Jemand fragte ${data.title}`;
	// 				default:
	// 					return `Jemand bemängelt ${data.title}`;
	// 			}
	// 		};
	// 		sendPush('New Featureboard entries', message());
	// 		toast.success('Yey', {
	// 			description: 'Danke für dein Feedback!',
	// 		});
	// 		postData = {
	// 			title: '',
	// 			body: '',
	// 			status: 0,
	// 			category: 0,
	// 			upvotes: 0,
	// 			owner: $userStore?.id!,
	// 			priority: 0,
	// 		};
	// 		invalidateAll();
	// 	});
	// } catch (e) {
	// 	toast.error('Fehler', {
	// 		description: `This failed due to: ${e}, probably not my fault`,
	// 	});
	// }
}
</script>

<main class="w-full">
    <h1>Bugs and Requests</h1>

    <Dialog.Root
        open={addPostOpen}
        onOpenChange={() => (addPostOpen = !addPostOpen)}
    >
        <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
            <Plus />
        </Dialog.Trigger>
        <Dialog.Content class="sm:max-w-[425px]">
            <Dialog.Header>
                <Dialog.Title>Add post</Dialog.Title>
                <Dialog.Description>
                    Trage zur Knowledgebase bei!
                </Dialog.Description>
            </Dialog.Header>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="title" class="text-right">Titel</Label>
                    <Input
                        id="title"
                        bind:value={postData.title}
                        class="col-span-3"
                    />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="body" class="text-right">Beschreibung</Label>
                    <Textarea
                        id="body"
                        bind:value={postData.body as string}
                        class="col-span-3"
                    />
                </div>
                <Select.Root
                    type="single"
                    name="topic" 
                    bind:value={selectedTopic}
                >
                    <Select.Trigger class="w-[180px]">
                        {selectedTopic === "" ? "Kategorie" : selectedTopic}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            <Select.GroupHeading>Themen</Select.GroupHeading>
                            {#if topics}
                                {#each topics as topic}
                                    <Select.Item value={topic} label={topic}
                                        >{topic}</Select.Item
                                    >
                                {/each}
                            {/if}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
                <Select.Root
                    type="single"
                    name="priority" 
                    bind:value={selectedPriority}
                >
                    <Select.Trigger class="w-[180px]">
                        {selectedPriority ? `Priorität: ${selectedPriority}` : "Priorität"}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            <Select.GroupHeading>Themen</Select.GroupHeading>
                            <Select.Item 
                                value="0" 
                                label="0" 
                                >Leicht</Select.Item
                            >
                            <Select.Item 
                                value="1" 
                                label="1"
                                >Mittel</Select.Item
                            >
                            <Select.Item 
                                value="2" 
                                label="2"
                                >Schwer</Select.Item
                            >
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
            </div>
            <Dialog.Footer>
                <Button type="submit" onclick={addPost}>Posten</Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
    <DataTable data={data.data} {columns} />
</main>
