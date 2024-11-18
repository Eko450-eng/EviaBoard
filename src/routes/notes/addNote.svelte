<script lang="ts">
import { Input } from '$ui/input';
import { Button } from '$ui/button';
import { MarkdownEditor } from 'carta-md';
import type { Notes } from '@/types';
import { userStore } from '@/stores/userstore';
import carta from '$lib/helpers/carta.js';
import '$lib/themes/github.scss';
import { RecordId } from 'surrealdb';

let note = $state<Notes>({
	title: '',
	note: '',
	owner: ($userStore?.id as RecordId) ?? new RecordId('', ''),
	tag: [],
	created_at: new Date(),
});

$effect(() => {
	note.owner = $userStore?.id as RecordId;
});

async function handlePost() {
	// let db = await getDb();
	// db?.create('notes', note);
}
</script>

<form onsubmit={handlePost} class="flex flex-col mx-2 gap-4">
    <Input bind:value={note.title} placeholder="Titel" />
    <MarkdownEditor 
        mode="tabs" 
        theme="github" 
        {carta} 
        bind:value={note.note} 
    /> 
    <!-- <Input bind:value={note.title} placeholder="Titel" /> -->
    <Button type="submit">Speichern</Button>
</form>
