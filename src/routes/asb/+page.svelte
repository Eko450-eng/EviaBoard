<script lang="ts">
import { Button } from '$lib/components/ui/button';
import { invalidateAll } from '$app/navigation';
import type { ASBCheck } from '@/types';
import { userStore } from '@/stores/userstore';

let { data }: { data: { asbcheck: ASBCheck[] } } = $props();

let userNames = $state<ASBCheck[]>([]);
$effect(() => {
	userNames = data.asbcheck;
});

async function meldenHandler() {
	let user = $userStore;
	await fetch('/api/asbcheck', {
		method: 'POST',
		body: JSON.stringify({ user }),
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	}).then(async (res) => {
		if (res.status === 200) invalidateAll();
	});
}
async function abmeldenHandler() {
	let user = $userStore;
	await fetch('/api/asbcheck', {
		method: 'POST',
		body: JSON.stringify({ user }),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(async (res) => {
		if (res.status === 200) invalidateAll();
	});
}
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
