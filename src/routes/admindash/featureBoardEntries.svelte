<script lang="ts">
import { Input } from '$ui/input';
import { Button } from '$ui/button';
import { Label } from '@/components/ui/label';
import NumberTicker from '@/components/mycomp/animated/NumberTicker.svelte';

let category = $state('0,1,2');
let statuses = $state('0,1,2');

let count = $state([0]);

// TODO: update this here to work more betterly
async function handleSubmit(e: any) {
	e.preventDefault();
	category.split(',');
	statuses.split(',');

	let dataRaw = await fetch(`/api/featureboard/count`, {
		method: 'PATCH',
		body: JSON.stringify({ category, statuses }),
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	let data = await dataRaw.json();
	count = data.number;
}
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-2">
    <div class="flex gap-2 items-center">
        <Label for="category" class="text-2xl">Categories</Label>
        <Input name="category" bind:value={category} placeholder="Categorys" />
    </div>
    <div class="flex gap-2 items-center">
        <Label for="statuses" class="text-2xl">Statuses</Label>
        <Input name="statuses" bind:value={statuses} placeholder="Statuses"/>
    </div>
    <Button type="submit">Count</Button>
    <div class="flex gap-2 items-center">
        <Label class="text-2xl">Anzahl:</Label>
        <NumberTicker className="text-2xl" bind:value={count[0]}/>
    </div>
</form>
