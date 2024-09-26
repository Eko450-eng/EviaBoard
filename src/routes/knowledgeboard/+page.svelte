<script lang="ts">
    import Plus from "svelte-radix/Plus.svelte";
    import Cross from "svelte-radix/Cross1.svelte";
    import { onMount, tick } from "svelte";
    import * as Command from "../../lib/components/ui/command/index.js";
    import * as Popover from "../../lib/components/ui/popover/index.js";
    import * as Card from "../../lib/components/ui/card/index.js";
    import {
        Button,
        buttonVariants,
    } from "../../lib/components/ui/button/index.js";
    import { Label } from "../../lib/components/ui/label/index.js";
    import { Input } from "../../lib/components/ui/input/index.js";
    import * as Dialog from "../../lib/components/ui/dialog/index.js";
    import { getDb } from "../../lib/db";
    import { redirect } from "@sveltejs/kit";
    import type Surreal from "surrealdb";
    import { RecordId } from "surrealdb";

    const topics = [
        {
            value: "datev",
            label: "Datev",
        },
        {
            value: "eom",
            label: "EOM",
        },
        {
            value: "invoice",
            label: "Invoice",
        },
        {
            value: "contract",
            label: "Contract",
        },
        {
            value: "workflows",
            label: "Workflows",
        },
    ];

    let open = false;
    let value = "";

    $: selectedValue =
        topics.find((f) => f.value === value)?.label ?? "Select a Topic";

    function closeAndFocusTrigger(triggerId: string) {
        open = false;
        tick().then(() => {
            document.getElementById(triggerId)?.focus();
        });
    }

    type post = {
        id?: any;
        title: string;
        body: string;
        solution: string;
        owner: { name: string; id: string };
    };

    type user = {
        email: string;
        id: any;
        name: string;
        password: string;
    };

    let posts: post[] = [];
    let DB: Surreal | undefined;
    let token: string | null;
    let user: user[] | undefined;
    let user_id: string | undefined | null;

    onMount(async () => {
        token = localStorage.getItem("user_token");
        if (!token) {
            redirect(300, "/");
        } else {
            DB = await getDb();
            let query =
                "select id, body, title, owner.id, owner.name from posts";
            let postsList: Array<Array<post>> = (await DB?.query(
                query,
            )) as unknown as Array<Array<post>>;
            posts = postsList[0];
            user = await DB?.query<user[]>("$auth");
            const queryUuid = await DB?.live("posts", (action, result) => {
                if (action === "CLOSE") return;
            });
            await DB?.subscribeLive(queryUuid!, async (action, result) => {
                let postsList: Array<Array<post>> = (await DB?.query(
                    query,
                )) as unknown as Array<Array<post>>;
                posts = postsList[0];
            });
            user_id = `user:${user![0].id}`;
        }
    });

    let postData: post = {
        title: "Title",
        body: "Markdown support soooon!",
        solution: "test",
        owner: { id: "", name: "" },
    };

    async function deletePost(id: string) {
        await DB?.delete(new RecordId("posts", id));
    }

    async function addPost() {
        await DB?.query(` CREATE posts CONTENT{
            title:  "${postData.title}",
            body:  "${postData.body}",
            solution:  "${postData.solution}",
            owner: ${user_id},
        }`);
        open = false;
    }
</script>

<div class="flex p-4 items-center justify-between">
    <h1>Knowledgebase</h1>

    <Dialog.Root>
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
                    {#each topics as topic}
                        <Command.Item
                            value={topic.value}
                            onSelect={(currentValue) => {
                                value = currentValue;
                                closeAndFocusTrigger(ids.trigger);
                            }}
                        >
                            {topic.label}
                        </Command.Item>
                    {/each}
                </Command.Group>
            </Command.Root>
        </Popover.Content>
    </Popover.Root>

    <div class="grid grid-cols-[repeat(auto-fit,_minmax(350px,_1fr))] gap-2">
        {#each posts as post}
            {#if selectedValue === "Select a Topic" || post.topic.name === selectedValue.toLowerCase()}
                <Card.Root class="my-2 w-[350px]">
                    <Card.Header>
                        <Card.Title>{post.title}</Card.Title>
                        <!-- <Card.Description>{post.topic.name}</Card.Description> -->
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
                        <Card.Description>{post.owner.name}</Card.Description>
                        {#if post.owner.id == user_id}
                            <Button
                                variant="destructive"
                                on:click={deletePost(post.id.id)}>Delete</Button
                            >
                        {/if}
                    </Card.Footer>
                </Card.Root>
            {/if}
        {/each}
    </div>
</div>
