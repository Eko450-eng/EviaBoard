<script lang="ts">
import * as Card from '$lib/components/ui/card/index.js';
import { Input } from '$lib/components/ui/input/index.js';
import { Button } from '$lib/components/ui/button/index.js';
import { Label } from '$lib/components/ui/label/index.js';
import type { Comments, User } from '@/types';
import { formatDate } from '@/helpers/formating';
import AvatarBar from '$lib/components/mycomp/avatar.svelte';
import { invalidateAll } from '$app/navigation';

let { id, comments = $bindable() }: { id: any; comments: Comments[] } =
	$props();
let message: string = $state('');

async function sendPost() {
	await fetch('/api/knowledgebase/comments', {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({ message, id }),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(() => {
		invalidateAll();
	});
}
</script>

<div>kommentare</div>
{#each comments as comment}
    <Card.Root class="my-1 w-full">
        <Card.Header>
            <Card.Title>
                <AvatarBar user={comment.owner as User} size={6}/>
            </Card.Title>
        </Card.Header>
        <Card.Content>
            <div class="flex flex-col">
                <p class="text-m">{comment.comment}</p>
            </div>
            <Card.Description class="text-xs opacity-80">
                <span class="flex items-center gap-2">
                    {formatDate(comment.created_at ?? new Date())}
                </span>
            </Card.Description>
        </Card.Content>
    </Card.Root>
{/each}

<form onsubmit={sendPost}>
    <Label for="title" class="text-right">Nachricht</Label>
    <div class="flex gap-2">
        <Input id="title" bind:value={message} class="col-span-3" />
        <Button type="submit">Send</Button>
    </div>
</form>
