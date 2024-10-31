<script lang="ts">
import { goto } from '$app/navigation';
import { env } from '$env/dynamic/public';
import * as Alert from '$lib/components/ui/alert/index.js';
import { Button } from '$lib/components/ui/button';
import { Separator } from '$lib/components/ui/separator';
import AvatarBar from '@/components/mycomp/avatar.svelte';
import CartaRender from '@/components/mycomp/cartarender.svelte';
import Idview from '@/components/mycomp/idview.svelte';
import type { User } from '@/types.js';
import { RecordId } from 'surrealdb';
import { Icon } from 'svelte-icons-pack';
import { FaSolidPencil } from 'svelte-icons-pack/fa';
import { FiAlertTriangle } from 'svelte-icons-pack/fi';
import { userData } from '../../store.js';
import Comments from './comment-view.svelte';

const { data } = $props();

async function downloadPdf(onlySolution: boolean) {
	const formData = new URLSearchParams();
	if (onlySolution) {
		if (!data.posts) return;
		formData.append('markdown', data.posts[0].solution);
	} else {
		formData.append(
			'markdown',
			`${data.posts?.[0].body} ${data.posts?.[0].solution}`,
		);
	}

	try {
		const response = await fetch('https://md-to-pdf.fly.dev', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: formData,
		});

		if (!response.ok) {
			throw new Error('PDF konnte nicht generiert werden');
		}

		const blob = await response.blob();

		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = `${data.posts?.[0].title}.pdf`;
		a.click();

		URL.revokeObjectURL(url);
	} catch (error) {
		console.error('Error:', error);
	}
}
</script>

{#if data.posts}
    {#each data.posts as post}
        <div class="flex flex-col w-full">
            <h1
                class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
            >
                {#if $userData.id!.toString() === (post.owner.id as RecordId).toString()}
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
                    <div class={env.PUBLIC_FEATURE_DOWNLOAD === "1" ? "w-min" : "soon w-min"}>
                        <Button variant="outline" disabled={env.PUBLIC_FEATURE_DOWNLOAD === "0"} onclick={()=>downloadPdf(true)}>
                            Download als PDF
                        </Button>
                    </div>
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
        <Comments />
    {/each}
{/if}

