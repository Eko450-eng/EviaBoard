<script lang="ts">
import { Button } from "$lib/components/ui/button";
import * as Dialog from "$lib/components/ui/dialog/index.js";
import type { Post } from "@/types";
import { onMount } from "svelte";

export let post: Post | null;

let texts: string[] = [];

function loadImageWithText(input: string) {
	const regex = /\[\[(.*?)\]\]/g;

	const textParts: string[] = [];

	// Track the last index to split text outside of [[...]]
	let lastIndex = 0;

	let match;
	while ((match = regex.exec(input)) !== null) {
		// Extract the text before the match
		const textBefore = input.slice(lastIndex, match.index).trim();
		if (textBefore) {
			textParts.push(textBefore);
		}

		// Push the content inside [[...]] into the images array
		textParts.push(match[1].trim());

		// Update the last index to the end of the current match
		lastIndex = regex.lastIndex;
	}

	// Add the remaining text after the last match
	const remainingText = input.slice(lastIndex).trim();
	if (remainingText) {
		textParts.push(remainingText);
	}

	texts = textParts;
}

onMount(() => {
	if (!post) return;
	loadImageWithText(post.body);
});
const imageOpened = false;
const imageUrl = "";
export let clickable: boolean;
</script>

{#if texts}
    {#each texts as entry}
        {#if entry.startsWith("https://minio.eko450eng.org")}
            <div class="flex">
                {#if clickable}
                    <Button
                        variant="ghost"
                        on:click={() => {
                            imageUrl = entry;
                            imageOpened = true;
                        }}
                    >
                        <img class="w-10" src={entry} alt={entry} />
                    </Button>
                {:else}
                    <img class="w-10" src={entry} alt={entry} />
                {/if}
            </div>
        {:else}
            <p>{entry}</p>
        {/if}
    {/each}
{/if}

<Dialog.Root
    open={imageOpened}
    onOpenChange={() => (imageOpened = !imageOpened)}
>
    <Dialog.Content class="sm:max-w-[425px]">
        <div class="grid gap-4 py-4">
            <img class="w-full" src={imageUrl} alt={imageUrl} />
        </div>
    </Dialog.Content>
</Dialog.Root>
