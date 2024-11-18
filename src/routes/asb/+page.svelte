<script lang="ts">
import { onMount } from 'svelte';
import { Button } from '$lib/components/ui/button';
import { writable } from 'svelte/store';
import { userStore } from '@/stores/user.store';

type ASBCheck = {
	id: string;
	name: string;
};

let userNames = $state<ASBCheck[]>([]);

async function queryPosts() {
	await fetch('/api/downloadlinks', {
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

async function meldenHandler() {
	// let db = await getDb();
	// db?.create('ASBCheck', {
	// 	name: $userStore?.email,
	// }).then(async () => {
	// 	await queryPosts();
	// });
}
async function abmeldenHandler() {
	// let db = await getDb();
	// try {
	// 	await db
	// 		?.query(`DELETE ASBCheck WHERE name = '${$userStore?.email}'`)
	// 		.then(async () => {
	// 			await queryPosts();
	// 		});
	// } catch (e) {
	// 	console.error(e);
	// }
}

onMount(async () => {
	await queryPosts();
});
</script>

<div>
    <p>Aktuell ist auf ASB:</p>
    {#if userNames.length > 0}
        {#each userNames as u}
            <div class="border-solid border-2 border-sky-500 rounded-md p-1">
                {u.name}
            </div>
        {/each}
    {:else}
        <p>keiner</p>
    {/if}

    <div class="flex gap-2 my-3">
        <p>Bist du drauf?</p>
        {#if $userStore?.email}
            <Button
                onclick={async () =>
                    userNames.some((obj) => obj.name == $userStore?.email)
                        ? abmeldenHandler()
                        : meldenHandler()}
            >
                {userNames.some((obj) => obj.name == $userStore?.email)
                    ? "Abmelden"
                    : "Melden"}</Button
            >
        {/if}
    </div>
</div>
