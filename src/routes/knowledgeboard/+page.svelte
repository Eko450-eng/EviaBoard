<script lang="ts">
import * as Select from '$ui/select';
import * as Card from '../../lib/components/ui/card/index.js';
import { Button } from '../../lib/components/ui/button/index.js';
import { Toggle } from '../../lib/components/ui/toggle/index.js';
import { goto, invalidateAll } from '$app/navigation';
import DeleteDialog from './delete-dialog.svelte';
import RecoverDialog from './recover-dialog.svelte';
import AvatarBar from '$lib/components/mycomp/avatar.svelte';
import type { Post, Topic, User } from '@/types.js';
import Plus from 'svelte-radix/Plus.svelte';
import Cartarender from '@/components/mycomp/cartarender.svelte';
import { FaCalendarDays, FaSolidHeart } from 'svelte-icons-pack/fa';
import { Icon } from 'svelte-icons-pack';
import { formatDate } from '@/helpers/formating.js';
import { userStore } from '@/stores/userstore';
import { RecordId } from 'surrealdb';
import { toast } from 'svelte-sonner';
import NumberTicker from '@/components/mycomp/animated/NumberTicker.svelte';

let { data } = $props();

let deleteDialog = $state(false);
let postToDelete: Post | undefined = $state(undefined);

let recoverDialog = $state(false);
let postToRecover: Post | undefined = $state(undefined);

let showDeleted: boolean = $state(false);
let selectedValue = $state('Kategorie');

const triggerContent = $derived(
	data.topics!.find((f: Topic) => f.name === selectedValue)?.name ??
		'Kategorie',
);

async function upvote(recordId: RecordId) {
	let userId = $userStore?.id;
	await fetch(`/api/knowledgebase/upvote`, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({ userId, recordId }),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(async (res) => {
		let response = await res.json();
		if (res.status === 200) {
			toast.success(response.title, {
				description: response.description,
			});
			invalidateAll();
		} else {
			toast.error(response.title, {
				description: response.description,
			});
		}
	});
}
</script>

{#if !$userStore || $userStore.role <= 0}
    <h1>You don't have the correct permissions</h1>
    {:else}
    <div class="flex flex-wrap p-4 items-center justify-between">
        <h1>Knowledgebase</h1>
        <DeleteDialog bind:deleteDialog {postToDelete} />
        <RecoverDialog bind:recoverDialog {postToRecover} />

        {#if $userStore?.email}
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
                                <Card.Root>
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
                                            <AvatarBar user={post.owner as User} size={6}/>
                                            <div class="flex justify-evenly gap-6 w-full">
                                                <span class="flex items-center gap-2 opacity-80">
                                                    <Icon
                                                        src={FaCalendarDays}
                                                        size={15}
                                                    />
                                                    {post.created_at ? formatDate(post.created_at) : "Older than this feature"}
                                                </span>
                                                <Button variant="link" class="flex items-center gap-2 opacity-80"
                                                    onclick={()=>upvote(post.id!)}
                                                >
                                                    <Icon
                                                        src={FaSolidHeart}
                                                        size={15}
                                                        color={post.voter?.some((obj: any)=>obj.name == $userStore.name) ? "red" : "white"}
                                                    />

                                                    <div class="flex justify-center items-center h-fit">
                                                        <NumberTicker class="whitespace-pre-wrap font-medium tracking-tighter text-black dark:text-white" value={post.upvoteCount} />
                                                    </div>
                                                    
                                                </Button>
                                            </div>
                                        </Card.Description>
                                        {#if $userStore?.id}
                                            {#if post.owner.id!.toString() === $userStore?.id?.toString() && !post.deleted}
                                                <Button
                                                    variant="destructive"
                                                    onclick={() => {
                                                        deleteDialog = true;
                                                        postToDelete = post;
                                                    }}>Delete</Button
                                                >
                                            {:else if post.owner.id!.toString() === $userStore?.id?.toString() && post.deleted}
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
{/if}

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
