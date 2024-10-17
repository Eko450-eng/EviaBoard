<script lang="ts">
    import * as Command from "../../lib/components/ui/command/index.js";
    import * as Popover from "../../lib/components/ui/popover/index.js";
    import * as Card from "../../lib/components/ui/card/index.js";
    import * as Select from "../../lib/components/ui/select/index.js";
    import * as Dialog from "../../lib/components/ui/dialog/index.js";
    import Plus from "svelte-radix/Plus.svelte";
    import Cross from "svelte-radix/Cross1.svelte";
    import { onMount, tick } from "svelte";
    import {
        Button,
        buttonVariants,
    } from "../../lib/components/ui/button/index.js";
    import { Label } from "../../lib/components/ui/label/index.js";
    import { Input } from "../../lib/components/ui/input/index.js";
    import { db, type post, type topic, type user } from "../../lib/db";
    import { toast } from "svelte-sonner";
    import { userData } from "../store.js";
    import { goto } from "$app/navigation";
    import { RecordId } from "surrealdb";

    let topics: Array<topic> | Array<{ id: string; name: string }> | undefined =
        [{ name: "Select a Topic", id: "placeholder" }];
    let user: user | null;

    let open = false;
    let value = "";

    export let data: {
        posts: post[] | undefined;
        failed: boolean;
    };

    let posts: post[] | undefined = data.posts;

    $: selectedValue =
        topics?.find((f) => f.name === value)?.name ?? "Select a Topic";

    function closeAndFocusTrigger(triggerId: string) {
        open = false;
        tick().then(() => {
            document.getElementById(triggerId)?.focus();
        });
    }

    onMount(() => {
        console.log(data);
        if (data.failed) goto("/");
    });

    let postData: post = {
        deleted: false,
        title: "Title",
        body: "Markdown support soooon!",
        solution: "test",
        owner: { id: "", name: "" },
        topic: "",
    };

    let selectedTopic: any = "";

    async function deletePost(data: post) {
        console.log(data);
        let newData = data;
        newData.deleted = true;
        await db?.patch(data.id!, [
            {
                op: "replace",
                path: "/deleted",
                value: true,
            },
        ]);
    }

    let addPostOpen = false;
    async function addPost() {
        let topic = `topics:${selectedTopic}`;
        if (postData.topic === "") {
            toast.error("Fehler", {
                description: "Kategorie nicht vergessen!",
            });
            return;
        }
        try {
            await db
                ?.query(
                    ` CREATE posts CONTENT{
            title:  "${postData.title}",
            body:  "${postData.body}",
            solution:  "${postData.solution}",
            owner: ${user?.id},
            topic: ${topic}
        }`,
                )
                .then(() => (addPostOpen = false));
        } catch (e) {
            toast.error("Fehler", {
                description: `This failed due to: ${e}, probably not my fault`,
            });
        }
    }
</script>

<div class="flex p-4 items-center justify-between">
    <h1>Knowledgebase</h1>

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
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="solution" class="text-right">Lösung</Label>
                    <Input
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
                                        label={topic.name}
                                        >{topic.name}</Select.Item
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
</div>

<div class="p-4">
    <Popover.Root bind:open let:ids>
        <Popover.Trigger asChild let:builder>
            <div class="flex p-4 gap-1 items-center">
                <Button
                    builders={[builder]}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    class="w-[200px] justify-between"
                >
                    {selectedValue}
                </Button>
                <Button
                    on:click={() => (selectedValue = "Select a Topic")}
                    class="justify-between"
                    variant="outline"
                >
                    <Cross />
                </Button>
            </div>
        </Popover.Trigger>
        <Popover.Content class="w-[200px] p-0">
            <Command.Root>
                <Command.Input placeholder="Search topics" class="h-9" />
                <Command.Empty>No topic found.</Command.Empty>
                <Command.Group>
                    {#if topics}
                        {#each topics as topic}
                            <Command.Item
                                value={topic.name}
                                onSelect={(currentValue) => {
                                    value = currentValue;
                                    closeAndFocusTrigger(ids.trigger);
                                }}
                            >
                                {topic.name}
                            </Command.Item>
                        {/each}
                    {/if}
                </Command.Group>
            </Command.Root>
        </Popover.Content>
    </Popover.Root>

    {#if posts}
        <div class="flex flex-wrap gap-2">
            {#each posts as post}
                {#if selectedValue === "Select a Topic" || post.topic === selectedValue.toLowerCase()}
                    <Card.Root class="my-2 w-[350px]">
                        <Card.Header>
                            <Card.Title>{post.title}</Card.Title>
                            <Card.Description>{post.topic}</Card.Description>
                        </Card.Header>
                        <Card.Content>
                            <form>
                                <div class="grid w-full items-center gap-4">
                                    <div class="flex flex-col space-y-1.5">
                                        <p>{post.body}</p>
                                    </div>
                                </div>
                            </form>
                        </Card.Content>
                        <Card.Footer class="flex justify-between">
                            <Card.Description
                                >{post.owner.name}</Card.Description
                            >
                            {#if post.owner.id.toString() === $userData.id.toString()}
                                <Button
                                    variant="destructive"
                                    on:click={() => {
                                        deletePost(post);
                                    }}>Delete</Button
                                >
                            {/if}
                        </Card.Footer>
                    </Card.Root>
                {/if}
            {/each}
        </div>
    {/if}
</div>
