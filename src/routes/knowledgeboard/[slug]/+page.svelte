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
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import type {
	ImageDefinition,
	TDocumentDefinitions,
	TFontDictionary,
} from 'pdfmake/interfaces.js';
import { checkOwner } from '@/helpers/admin';

const { data } = $props();

function splitTextAndUrls(input: string): TDocumentDefinitions {
	// Regex to match URLs
	const urlRegex = /(?<url>https.*?.png)/g;
	const removeRegex = /(!.*?\()/g;
	const removeRegexSizes = /(=\d*x\d*(.?))/g;

	let text = input.replaceAll(removeRegex, '').replaceAll(removeRegexSizes, '');

	// Find all URLs in the text
	const matches = text.match(urlRegex) || [];

	const result = [];
	let images: Record<string, string | ImageDefinition> = {};
	let lastIndex = 0;

	// Find and split URLs
	matches.forEach((url: any, index) => {
		const urlIndex = text.indexOf(url, lastIndex);

		// Add text before URL
		if (urlIndex > lastIndex) {
			result.push(text.slice(lastIndex, urlIndex));
		}

		// Add URL
		let r = {
			[`image${index}`]: `${url}`,
		};
		images = {
			...images,
			...r,
		};
		result.push({
			image: `image${index}`,
			width: 100,
			height: 100,
		});
		// Update last index
		lastIndex = urlIndex + url.length;
	});

	// Add remaining text after last URL
	if (lastIndex < text.length) {
		result.push(text.slice(lastIndex));
	}

	let content: TDocumentDefinitions = {
		images: images,
		content: result,
	};

	return content;
}

async function downloadPdf() {
	let pdfmaker = pdfMake;

	let font: TFontDictionary = {
		Roboto: {
			normal:
				'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.3.0-beta.1/fonts/Roboto/Roboto-Regular.ttf',
			bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.3.0-beta.1/fonts/Roboto/Roboto-Medium.ttf',
			italics:
				'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.3.0-beta.1/fonts/Roboto/Roboto-Italic.ttf',
			bolditalics:
				'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.3.0-beta.1/fonts/Roboto/Roboto-MediumItalic.ttf',
		},
	};

	var docDefinition = splitTextAndUrls(data.posts![0].solution);

	pdfmaker.createPdf(docDefinition, undefined, font).download();
}
</script>

{#if data.posts}
    {#each data.posts as post}
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
                    <div class="w-min">
                        <Button variant="outline"  onclick={downloadPdf}>
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

