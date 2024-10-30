<script lang="ts">
import DotsHorizontal from 'svelte-radix/DotsHorizontal.svelte';
import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
import { Button } from '$lib/components/ui/button';
import { db } from '@/db';
import { RecordId } from 'surrealdb';
import { userData } from '../store';
import { toast } from 'svelte-sonner';
import type { Report } from '@/types';
import { editorOnly } from '@/helpers/admin';

export let id: string;
type Votes = {
	id: RecordId;
	bugreports: string;
	voter: string;
};

async function upvote(id: string) {
	let recordId = new RecordId('bugreports', id);
	let userId = new RecordId('user', $userData.id ? $userData.id.id : '');

	let report = await db?.select<Report>(recordId);

	let votes = await db?.query<Array<Array<Votes>>>(`SELECT * FROM votes WHERE 
                  voter = ${'user:' + userId.id}
                  AND
                  bugreport = ${'bugreports:' + id}
                  `);

	if (!report || !votes) return;
	let newUpvotes = report?.upvotes;

	if (votes[0]?.length >= 1) {
		await db?.delete(votes[0][0].id);
		newUpvotes -= 1;
	} else {
		newUpvotes += 1;
		await db?.create('votes', {
			bugreport: recordId,
			voter: userId,
		});
	}

	await db
		?.patch(recordId, [
			{
				op: 'replace',
				path: '/upvotes',
				value: newUpvotes,
			},
		])
		.then(() => {
			toast.success('Yey', {
				description: 'Danke für dein Feedback!',
			});
		});
}

async function setStatus(id: string, status: number) {
	let recordId = new RecordId('bugreports', id);
	await db
		?.patch(recordId, [
			{
				op: 'replace',
				path: '/status',
				value: status,
			},
		])
		.then(() => {
			toast.success('Yey', {
				description: 'Status gändert',
			});
		});
}
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        <Button
            variant="ghost"
            size="icon"
            class="relative h-8 w-8 p-0"
        >
            <span class="sr-only">Open menu</span>
            <DotsHorizontal class="h-4 w-4" />
        </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Group>
            <DropdownMenu.Label>Actions</DropdownMenu.Label>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onclick={() => upvote(id)}>Upvote</DropdownMenu.Item
        >

        <DropdownMenu.Separator />
        <DropdownMenu.Group>
            <DropdownMenu.Label>Actions</DropdownMenu.Label>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />

        {#if editorOnly($userData)}
            <DropdownMenu.Item onclick={() => setStatus(id, 0)}
                >Open</DropdownMenu.Item
            >
            <DropdownMenu.Item onclick={() => setStatus(id, 1)}
                >WIP</DropdownMenu.Item
            >
            <DropdownMenu.Item onclick={() => setStatus(id, 2)}
                >Accepted</DropdownMenu.Item
            >
            <DropdownMenu.Item onclick={() => setStatus(id, 3)}
                >Denied</DropdownMenu.Item
            >
            <DropdownMenu.Item onclick={() => setStatus(id, 4)}
                >Closed</DropdownMenu.Item
            >
            <DropdownMenu.Item onclick={() => setStatus(id, 10)}
                >Archived</DropdownMenu.Item
            >
        {/if}
    </DropdownMenu.Content>
</DropdownMenu.Root>
