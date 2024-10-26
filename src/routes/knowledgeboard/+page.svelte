<script lang="ts">
    import * as Command from "../../lib/components/ui/command/index.js";
    import * as Popover from "../../lib/components/ui/popover/index.js";
    import * as Card from "../../lib/components/ui/card/index.js";
    import Cross from "svelte-radix/Cross1.svelte";
    import { onMount, tick } from "svelte";
    import { Button } from "../../lib/components/ui/button/index.js";
    import { Toggle } from "../../lib/components/ui/toggle/index.js";
    import { checkLoggedIn, DB, userData } from "../store.js";
    import { goto, invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";
    import DeleteDialog from "./delete-dialog.svelte";
    import RecoverDialog from "./recover-dialog.svelte";
    import AvatarBar from "$lib/components/mycomp/avatar.svelte";
    import type { Post, Topic } from "@/types.js";
    import Plus from "svelte-radix/Plus.svelte";
    import Cartarender from "@/components/mycomp/cartarender.svelte";
    import { formatDate } from "@/helpers/formating.js";
    import { FaCalendarDays } from "svelte-icons-pack/fa";
    import { Icon } from "svelte-icons-pack";

    let topics: Array<Topic> | Array<{ id: string; name: string }> | undefined =
        [{ name: "Select a Topic", id: "placeholder" }];

    let open = false;
    let value = "";

    export let data: {
        posts: Post[] | undefined;
        topics: Topic[] | undefined;
        failed: boolean;
    };

    topics = data.topics;

    $: selectedValue =
        topics?.find((f) => f.name === value)?.name ?? "Select a Topic";

    function closeAndFocusTrigger(triggerId: string) {
        open = false;
        tick().then(() => {
            document.getElementById(triggerId)?.focus();
        });
    }

    onMount(async () => {
        checkLoggedIn();
        if (data.failed) goto("/");

        const queryUuid = await $DB?.live("posts", (action, _result) => {
            if (action === "CLOSE") return;
        });
        await $DB?.subscribeLive(queryUuid!, async (action, _result) => {
            if (
                action === "CREATE" ||
                action === "UPDATE" ||
                action === "DELETE"
            ) {
                await invalidateAll();
            }
        });
    });

    let deleteDialog = false;
    let postToDelete: Post | undefined;

    let recoverDialog = false;
    let postToRecover: Post | undefined;

    let showDeleted: boolean = false;
</script>

<div class="flex flex-wrap p-4 items-center justify-between">
    <h1>Knowledgebase</h1>
    <DeleteDialog bind:deleteDialog {postToDelete} />
    <RecoverDialog bind:recoverDialog {postToRecover} />

    {#if $userData.email}
        <Toggle variant="outline" on:click={() => (showDeleted = !showDeleted)}>
            {showDeleted ? "Hide" : "Show"}
            your Deleted posts
        </Toggle>
    {/if}

    <Button variant="outline" on:click={() => goto("/knowledgeboard/add")}>
        <Plus />
    </Button>
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

    {#if $page.data.posts}
        <div class="flex flex-wrap gap-2">
            {#each $page.data.posts as post}
                {#if (showDeleted && post.deleted) || !post.deleted}
                    {#if selectedValue === "Select a Topic" || post.topic === selectedValue.toLowerCase()}
                        <div class="hoverpointer w-full">
                            <!-- <Card.Root class="my-2 w-[33%]"> -->
                            <Card.Root class="">
                                <div
                                    class="hoverpointer"
                                    role="button"
                                    tabindex="0"
                                    aria-label="Go to Post"
                                    on:keydown={() => console.log("Clicked")}
                                    on:click={() =>
                                        goto(`/knowledgeboard/${post.id}`)}
                                >
                                    <Card.Header>
                                        <Card.Title>{post.title}</Card.Title>
                                        <Card.Description
                                            >{post.topic}</Card.Description
                                        >
                                    </Card.Header>
                                    <Card.Content>
                                        <div
                                            class={post.deleted
                                                ? "grid w-full items-center gap-4 deleted"
                                                : "grid w-full items-center gap-4"}
                                        >
                                            <div
                                                class="flex flex-col space-y-1.5"
                                            >
                                                <Cartarender
                                                    text={post.body.substring(
                                                        0,
                                                        30,
                                                    ) + "..."}
                                                />
                                            </div>
                                        </div>
                                    </Card.Content>
                                </div>
                                <Card.Footer class="flex justify-between">
                                    <Card.Description>
                                        <AvatarBar user={post.owner} />
                                        <span
                                            class="flex items-center gap-2"
                                        >
                                            <Icon
                                                src={FaCalendarDays}
                                                size={15}
                                            />
                                            {formatDate(post.created_at)}
                                        </span>
                                    </Card.Description>
                                    {#if $userData.id}
                                        {#if post.owner.id.toString() === $userData.id.toString() && !post.deleted}
                                            <Button
                                                variant="destructive"
                                                on:click={() => {
                                                    deleteDialog = true;
                                                    postToDelete = post;
                                                }}>Delete</Button
                                            >
                                        {:else if post.owner.id.toString() === $userData.id.toString() && post.deleted}
                                            <Button
                                                variant="default"
                                                on:click={() => {
                                                    recoverDialog = true;
                                                    postToRecover = post;
                                                }}>Recover</Button
                                            >
                                        {/if}
                                    {/if}
                                </Card.Footer>
                            </Card.Root>
                        </div>
                    {/if}
                {/if}
            {/each}
        </div>
    {/if}
</div>

<style>
    :global(.carta-font-code) {
        font-family: "...", monospace;
        font-size: 1.1rem;
    }
    .deleted {
        color: red;
    }
    .hoverpointer {
        cursor: pointer;
    }
</style>
