<script lang="ts">
import AvatarBar from '$lib/components/mycomp/avatar.svelte';
import { Button } from '$lib/components/ui/button/index';
import { Skeleton } from '$ui/skeleton';
import { adminOnly } from '@/helpers/admin';
import { formatDate } from '@/helpers/formating';
import type { News, User } from '@/types';
import { Icon } from 'svelte-icons-pack';
import { FaCalendarDays, FaSolidHeart } from 'svelte-icons-pack/fa';
import Addnews from './addnews.svelte';
import Addnewspost from './addnewspost.svelte';
import { userStore } from '@/stores/userstore';
import type { PageServerData } from './$types';
import type { RecordId } from 'surrealdb';
import { toast } from 'svelte-sonner';
import { invalidateAll } from '$app/navigation';

let { data }: PageServerData = $props();

let addPostOpen = $state(false);
let addNewsPostOpen = $state(false);
let selectedPost: News | undefined = $state(undefined);
$effect(() => {
	console.log(data);
});

async function upvote(recordId: RecordId) {
	let userId = $userStore?.id;
	await fetch(`/api/news`, {
		method: 'PATCH',
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

{#if $userStore && adminOnly()}
    <Addnews bind:addPostOpen />
{/if}
<Addnewspost bind:addPostOpen={addNewsPostOpen} post={selectedPost} />

{#if data.data}
    {#each data.data as post}
        <div class="border rounded my-2 py-2">
            <div class="flex justify-between">
                <h2 class="text-2xl p-2">{post.title}</h2>
                {#if adminOnly()}
                    <Button
                        aria-label="Add a post"
                        onclick={() => {
                            if (!adminOnly()) return;
                            selectedPost = post;
                            addNewsPostOpen = true;
                        }}>Add post</Button
                    >
                {/if}
            </div>
            <div class="flex flex-col">
                <p class="p-2 opacity-80">
                    <span class="flex items-center gap-2">
                        <Icon src={FaCalendarDays} size={15} />
                        {formatDate(post.date)}
                    </span>
                </p>
                <ul class="feature-description-list-item list-disc">
                    {#each post.newspost as entry}
                        <li>
                            {entry.name}
                        </li>
                    {/each}
                </ul>
            </div>
            <div class="flex justify-between mx-2">
                <AvatarBar user={post.owner as User} />

                <Button variant="link" class="flex items-center gap-2 opacity-80"
                    onclick={()=>upvote(post.id!)}
                >
                    <Icon
                        src={FaSolidHeart}
                        size={15}
                        color={post.voter?.some((obj: any)=>obj.name == $userStore?.name) ? "red" : "white"}
                    />
                    {post.upvoteCount}
                </Button>
            </div>
        </div>
    {/each}
{:else}
    <p class="mb-2 mt-2">Wenn die Seite nicht lädt, kann es sein dass du dich neu anmelden musst!</p>
    <div class="flex items-center space-x-4">
        <div class="space-y-2 w-full">
            <Skeleton class="h-4 w-4/5 rounded-full" />
            <Skeleton class="h-4 w-2/5 rounded-full" />
            <Skeleton class="h-4 w-3/5 rounded-full" />
        </div>
    </div>
{/if}

<style>
    ul {
        margin-inline: 1rem;
        padding-inline: 1rem;
    }
</style>
