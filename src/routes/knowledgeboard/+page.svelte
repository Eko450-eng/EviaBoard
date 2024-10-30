<script lang="ts">
    import * as Select from "$ui/select";
    import * as Card from "../../lib/components/ui/card/index.js";
    import { onMount } from "svelte";
    import { Button } from "../../lib/components/ui/button/index.js";
    import { Toggle } from "../../lib/components/ui/toggle/index.js";
    import { checkLoggedIn, DB, userData } from "../store.js";
    import { goto, invalidateAll } from "$app/navigation";
    import DeleteDialog from "./delete-dialog.svelte";
    import RecoverDialog from "./recover-dialog.svelte";
    import AvatarBar from "$lib/components/mycomp/avatar.svelte";
    import type { Post, User } from "@/types.js";
    import Plus from "svelte-radix/Plus.svelte";
    import Cartarender from "@/components/mycomp/cartarender.svelte";
    import { FaCalendarDays } from "svelte-icons-pack/fa";
    import { Icon } from "svelte-icons-pack";

    let { data } = $props();
    let deleteDialog = $state(false);
    let postToDelete: Post | undefined = $state(undefined);
    
    let recoverDialog = $state(false);
    let postToRecover: Post | undefined = $state(undefined);

    let showDeleted: boolean = $state(false);
    // let open = false;
    let selectedValue = $state("Kategorie");

    onMount(async () => {
        checkLoggedIn();
        if (data.failed) goto("/");

        // eslint-disable-next-line
        const queryUuid = await $DB?.live("posts", (action, _result) => {
            if (action === "CLOSE") return;
        });
        // eslint-disable-next-line
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

    const triggerContent = $derived(
        data.topics!.find((f)=>f.name === selectedValue)?.name ?? "Kategorie"
    )
</script>

<div class="flex flex-wrap p-4 items-center justify-between">
    <h1>Knowledgebase</h1>
    <DeleteDialog bind:deleteDialog {postToDelete} />
    <RecoverDialog bind:recoverDialog {postToRecover} />

    {#if $userData.email}
        <Toggle variant="outline" onclick={() => (showDeleted = !showDeleted)}>
            {showDeleted ? "Hide" : "Show"}
            your Deleted posts
        </Toggle>
    {/if}

    <Button
        aria-label="Select a topic from a dropdown menu"
        variant="outline"
        onclick={() => goto("/knowledgeboard/add")}
    >
        <Plus />
    </Button>
</div>

<Select.Root type="single" name="topic" bind:value={selectedValue}>
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

<div class="p-4">
    {#if data.posts}
        <div class="flex flex-wrap gap-2">
            {#each data.posts as post}
                {#if (showDeleted && post.deleted) || !post.deleted}
                    {#if selectedValue === "Kategorie" || post.topic === selectedValue.toLowerCase()}
                        <div class="hoverpointer w-full">
                            <!-- <Card.Root class="my-2 w-[33%]"> -->
                            <Card.Root class="">
                                <div
                                    class="hoverpointer"
                                    role="button"
                                    tabindex="0"
                                    aria-label="Go to Post"
                                    onkeydown={() => console.info("Clicked")}
                                    onclick={() =>
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
                                        <AvatarBar user={post.owner as User} />
                                        <span class="flex items-center gap-2">
                                            <Icon
                                                src={FaCalendarDays}
                                                size={15}
                                            />
                                            <!-- {formatDate(post.created_at)} -->
                                        </span>
                                    </Card.Description>
                                    {#if $userData.id}
                                        {#if post.owner.id!.toString() === $userData.id.toString() && !post.deleted}
                                            <Button
                                                variant="destructive"
                                                onclick={() => {
                                                    deleteDialog = true;
                                                    postToDelete = post;
                                                }}>Delete</Button
                                            >
                                        {:else if post.owner.id!.toString() === $userData.id.toString() && post.deleted}
                                            <Button
                                                variant="default"
                                                onclick={() => {
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
