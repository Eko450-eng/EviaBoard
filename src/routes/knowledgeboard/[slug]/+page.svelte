<script lang="ts">
import { goto } from '$app/navigation';
import * as Alert from '$lib/components/ui/alert/index.js';
import { Button } from '$lib/components/ui/button';
import { Separator } from '$lib/components/ui/separator';
import AvatarBar from '@/components/mycomp/avatar.svelte';
import CartaRender from '@/components/mycomp/cartarender.svelte';
import Idview from '@/components/mycomp/idview.svelte';
import type { User } from '@/types.js';
import { Icon } from 'svelte-icons-pack';
import { FaSolidPencil } from 'svelte-icons-pack/fa';
import { FiAlertTriangle } from 'svelte-icons-pack/fi';
import Comments from './comment-view.svelte';
import { checkOwner } from '@/helpers/admin';
import type { PageServerData } from './$types';
import { Skeleton } from '@/components/ui/skeleton';

const { data }: PageServerData = $props();
</script>

{#if data.data.posts}
    {#each data.data.posts as post}
        <div class="flex flex-col w-full">
            <h1
                class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
            >
                {#if checkOwner(post.owner)}
                    <Button
                        aria-label="Post bearbeiten"
                        variant="outline"
                        onclick={() => goto(`/knowledgeboard/${post.id}/edit`)}
                    >
                        <Icon src={FaSolidPencil} />
                    </Button>
                {/if}
                <div class="flex items-center justify-between mr-5">
                    {post.title}
                </div>
                {#if post.deleted}
                    <Alert.Root>
                        <Icon src={FiAlertTriangle} />
                        <Alert.Title>Heads up!</Alert.Title>
                        <Alert.Description
                            >Dieser Post wurde gelöscht!</Alert.Description
                        >
                    </Alert.Root>
                {/if}
            </h1>
            <div
                class="flex flex-col justify-between my-5 [&:not(:first-child)]:mt-6"
            >
                <p class="text-sm opacity-80">Beschreibung</p>
                <CartaRender text={post.body} />
            </div>
            <Separator />
            <div
                class="flex flex-col justify-between my-5 [&:not(:first-child)]:mt-6"
            >
                <p class="text-sm opacity-80">Lösung</p>
                {#if post.solution}
                    <CartaRender text={post.solution} />
                {:else}
                    <p>Der Autor hat keine Lösung angegeben</p>
                {/if}
            </div>
            <div
                class="flex flex-col justify-between my-5 border-t text-sm opacity-80"
            >
                <p>Kategorie: {post.topic}</p>
                <AvatarBar user={post.owner as User} />
                {#if post.id}
                    <Idview id={post.id} />
                {/if}
            </div>
        </div>
        <Comments id={post.id} bind:comments={data.comments} />
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

