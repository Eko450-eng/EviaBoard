<script lang="ts">
import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
import * as Dialog from "$lib/components/ui/dialog/index.js";
import { Input } from "$lib/components/ui/input/index.js";
import { Label } from "$lib/components/ui/label/index.js";
import * as Select from "$lib/components/ui/select/index.js";
import { Textarea } from "$lib/components/ui/textarea/index.js";
import { db } from "$lib/db";
import { sendPush } from "@/helpers/push";
import type { Report } from "@/types";
import { RecordId } from "surrealdb";
import Plus from "svelte-radix/Plus.svelte";
import { toast } from "svelte-sonner";
import { get } from "svelte/store";
import { userData } from "../store";
import DataTable from "./bug-table.svelte";

let addPostOpen = false;

const topics: Array<string> | undefined = ["Bug", "Feature", "Question"];
// eslint-disable-next-line
const selectedTopic: any = "";

const postData: Report = {
	title: "",
	body: "",
	status: 0,
	category: 0,
	upvotes: 0,
	owner: new RecordId("", ""),
};

async function addPost() {
	const user = get(userData);
	if (!user) return;
	let category = 0;
	switch (selectedTopic) {
		case "Bug":
			category = 0;
			break;
		case "Feature":
			category = 1;
			break;
		case "Question":
			category = 2;
			break;
		default:
			category = 0;
			break;
	}
	try {
		const data: Report = {
			...postData,
			category: category,
			owner: user.id!,
		};
		await db?.create("bugreports", data).then(() => {
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
			sendPush("New Featureboard entries", message());
			toast.success("Yey", {
				description: "Danke für dein Feedback!",
			});
		});
	} catch (e) {
		toast.error("Fehler", {
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
                selected={selectedTopic}
                onSelectedChange={(v) => {
                    // eslint-disable-next-line
                    v && (selectedTopic = v.value);
                }}
            >
                <Select.Trigger class="w-[180px]">
                    <Select.Value
                        placeholder={selectedTopic == ""
                            ? "Kategorie"
                            : selectedTopic}
                    />
                </Select.Trigger>
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Themen</Select.Label>
                        {#if topics}
                            {#each topics as topic}
                                <Select.Item value={topic} label={topic}
                                    >{topic}</Select.Item
                                >
                            {/each}
                        {/if}
                    </Select.Group>
                </Select.Content>
                <Select.Input name="selectedTopic" />
            </Select.Root>
        </div>
        <Dialog.Footer>
            <Button type="submit" on:click={addPost}>Posten</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
<DataTable />
