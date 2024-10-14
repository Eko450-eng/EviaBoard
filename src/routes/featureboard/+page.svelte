<script lang="ts">
    import DataTable from "./bug-table.svelte";
    import { db, user_id_raw, type Report } from "$lib/db";
    import { toast } from "svelte-sonner";
    import * as Dialog from "../../lib/components/ui/dialog/index.js";
    import Plus from "svelte-radix/Plus.svelte";
    import { Label } from "../../lib/components/ui/label/index.js";
    import { Input } from "../../lib/components/ui/input/index.js";
    import * as Select from "../../lib/components/ui/select/index.js";
    import {
        Button,
        buttonVariants,
    } from "../../lib/components/ui/button/index.js";
    import { RecordId } from "surrealdb";

    let addPostOpen = false;

    let topics: Array<string> | undefined = ["Question", "Bug", "Feature"];
    let selectedTopic: any = "";

    let postData: Report = {
        title: "",
        body: "",
        status: "open",
        category: "",
        upvotes: 0,
        owner: { name: "", id: "" },
    };

    async function addPost() {
        try {
            if (!user_id_raw) return;
            let data: Report = {
                ...postData,
                category: selectedTopic,
                owner: new RecordId("user", user_id_raw),
            };
            await db?.create("bugreports", data).then(() => {
                addPostOpen = false;
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
                <Input
                    id="body"
                    bind:value={postData.body}
                    class="col-span-3"
                />
            </div>
            <Select.Root
                selected={selectedTopic}
                onSelectedChange={(v) => {
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
