<script lang="ts">
import type { Notes } from '@/types';
import { Button } from '$ui/button';
import AddNote from './addNote.svelte';
import { FaSolidNoteSticky } from 'svelte-icons-pack/fa';
import { Icon } from 'svelte-icons-pack';

let { data }: { data: { data: Notes[] } } = $props();
$inspect(data).with(console.log);
</script>
<div class="flex mt-4">
    <div class="flex flex-col gap-2">
        {#each data.data as note }
            <Button class="w-full flex justify-start" variant="secondary">
                <Icon src={FaSolidNoteSticky}/>
                {note.title}
            </Button>
        {/each}
    </div>
    <AddNote />
</div>
