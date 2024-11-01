<script lang="ts">
import DataTable from './bug-table.svelte';
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
import { getDb } from '@/db';
import { userStore } from '@/stores/user.store';

let addPostOpen = false;

let topics: Array<string> | undefined = ['Bug', 'Feature', 'Question'];
// eslint-disable-next-line
let selectedTopic: any = '';

let postData: Report = {
	title: '',
	body: '',
	status: 0,
	category: 0,
	upvotes: 0,
	owner: new RecordId('', ''),
};

async function addPost() {
	let db = await getDb();
	let user = $userStore;
	if (!user) return;
	let category = 0;
	switch (selectedTopic) {
		case 'Bug':
			category = 0;
			break;
		case 'Feature':
			category = 1;
			break;
		case 'Question':
			category = 2;
			break;
		default:
			category = 0;
			break;
	}
	try {
		let data: Report = {
			...postData,
			category: category,
			owner: user.id!,
		};
		await db?.create('bugreports', data).then(() => {
			addPostOpen = false;
			const message = () => {
				switch (data.category) {
					case 0:
						return `Jemand bemängelt ${data.title}`;
					case 1:
						return `Jemand will ${data.title}`;
					case 2:
						return `Jemand fragte ${data.title}`;
					default:
						return `Jemand bemängelt ${data.title}`;
				}
			};
			sendPush('New Featureboard entries', message());
			toast.success('Yey', {
				description: 'Danke für dein Feedback!',
			});
		});
	} catch (e) {
		toast.error('Fehler', {
			description: `This failed due to: ${e}, probably not my fault`,
		});
	}
}
</script>

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
            >
                <Select.Trigger class="w-[180px]">
                    <!-- <Select.Value -->
                    <!--     placeholder={selectedTopic == "" -->
                    <!--         ? "Kategorie" -->
                    <!--         : selectedTopic} -->
                    <!-- /> -->
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
                <Select.Item value="selectedTopic" />
            </Select.Root>
        </div>
        <Dialog.Footer>
            <Button type="submit" onclick={addPost}>Posten</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
<DataTable />
