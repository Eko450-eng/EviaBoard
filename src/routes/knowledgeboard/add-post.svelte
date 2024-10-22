<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import { db } from "$lib/db";
    import { toast } from "svelte-sonner";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import { userData } from "../store.js";
    import Plus from "svelte-radix/Plus.svelte";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Textarea } from "$lib/components/ui/textarea";
    import type { Post } from "@/types.js";
    import { sendPush } from "@/helpers/push.js";

    export let addPostOpen: boolean;
    export let selectedTopic: any;
    export let topics: any;
    export let postData: Post = {
        deleted: false,
        title: "",
        body: "",
        solution: "",
        owner: { id: "", name: "" },
        topic: "",
    };

    async function addPost() {
        let topic = `topics:${selectedTopic}`;
        postData.topic = topic;

        if (postData.topic === "") {
            toast.error("Fehler", {
                description: "Kategorie nicht vergessen!",
            });
            return;
        }
        try {
            if (!postData) return;
            await db
                ?.query(
                    ` CREATE posts CONTENT{
            title:  "${postData.title}",
            deleted:  ${postData.deleted},
            body:  "${postData.body}",
            solution:  "${postData.solution}",
            owner: ${$userData.id},
            topic: ${topic}
        }`,
                )
                .then(() => {
                    addPostOpen = false;
                    sendPush("New Posts", "Es gab einen neuen Post!");
                });
        } catch (e) {
            toast.error("Fehler", {
                description: `This failed due to: ${e}, probably not my fault`,
            });
        }
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" || event.key === "Esc") addPostOpen = false;
    });
</script>

<Dialog.Root
    open={addPostOpen}
    onOpenChange={() => (addPostOpen = !addPostOpen)}
>
    <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
        <Plus />
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Post beitragen</Dialog.Title>
            <Dialog.Description>
                Trage zur Knowledgebase bei!
            </Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <div>
                <Label for="title" class="text-right">Titel</Label>
                <Input
                    id="title"
                    bind:value={postData.title}
                    class="col-span-3"
                />
            </div>
            <div>
                <Label for="body" class="text-right">Beschreibung</Label>
                <Textarea
                    id="body"
                    bind:value={postData.body}
                    class="col-span-3"
                />
            </div>
            <div>
                <Label for="solution" class="text-right">Lösung</Label>
                <Textarea
                    id="solution"
                    bind:value={postData.solution}
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
                                <Select.Item
                                    value={topic.name}
                                    label={topic.name}>{topic.name}</Select.Item
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
