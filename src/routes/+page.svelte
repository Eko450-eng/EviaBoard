<script lang="ts">
import AvatarBar from '$lib/components/mycomp/avatar.svelte';
import { Button } from '$lib/components/ui/button/index';
import { Skeleton } from '$ui/skeleton';
import { adminOnly } from '@/helpers/admin';
import { formatDate } from '@/helpers/formating';
import type { News, User } from '@/types';
import { Icon } from 'svelte-icons-pack';
import { FaCalendarDays } from 'svelte-icons-pack/fa';
import Addnews from './addnews.svelte';
import Addnewspost from './addnewspost.svelte';
import { userStore } from '@/stores/userstore';

let { data } = $props();

let addPostOpen = $state(false);
let addNewsPostOpen = $state(false);
let selectedPost: News | undefined = $state(undefined);
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
            <AvatarBar user={post.owner as User} />
        </div>
    {/each}
{:else}
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
