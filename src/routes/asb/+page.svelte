<script lang="ts">
import { db } from '@/db';
import { onMount } from 'svelte';
import { Button } from '$lib/components/ui/button';
import { userData } from '../store';
import { get, writable } from 'svelte/store';

type ASBCheck = {
	id: string;
	name: string;
};

let userNamesRaw: Array<ASBCheck> = [];
let userNames = writable(userNamesRaw);

async function queryPosts() {
	let data = await db?.select<ASBCheck>('ASBCheck');
	if (!data) {
		return;
	}

	data.forEach((u) => {
		userNamesRaw.push(u);
	});

	userNames.set(userNamesRaw);
}

async function meldenHandler() {
	db?.create('ASBCheck', {
		name: $userData.email,
	}).then(async () => {
		await queryPosts();
	});
}
async function abmeldenHandler() {
	try {
		await db
			?.query(`DELETE ASBCheck WHERE name = '${get(userData).email}'`)
			.then(async () => {
				await queryPosts();
			});
	} catch (e) {
		console.error(e);
	}
}

onMount(async () => {
	await queryPosts();
});
</script>

<div>
    <p>Aktuell ist auf ASB:</p>
    {#if $userNames.length > 0}
        {#each $userNames as u}
            <div class="border-solid border-2 border-sky-500 rounded-md p-1">
                {u.name}
            </div>
        {/each}
    {:else}
        <p>keiner</p>
    {/if}

    <div class="flex gap-2 my-3">
        <p>Bist du drauf?</p>
        {#if $userData.email}
            <Button
                onclick={async () =>
                    $userNames.some((obj) => obj.name == $userData.email)
                        ? abmeldenHandler()
                        : meldenHandler()}
            >
                {$userNames.some((obj) => obj.name == $userData.email)
                    ? "Abmelden"
                    : "Melden"}</Button
            >
        {/if}
    </div>
</div>
