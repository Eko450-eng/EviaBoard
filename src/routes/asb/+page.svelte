<script lang="ts">
import { Button } from "$lib/components/ui/button";
import { db } from "@/db";
import { onMount } from "svelte";
import { get, writable } from "svelte/store";
import { userData } from "../store";

type ASBCheck = {
	id: string;
	name: string;
};

const userNamesRaw: Array<ASBCheck> = [];
const userNames = writable(userNamesRaw);

async function queryPosts() {
	const data = await db?.select<ASBCheck>("ASBCheck");
	if (!data) {
		return;
	}

	data.forEach((u) => {
		userNamesRaw.push(u);
	});

	userNames.set(userNamesRaw);
}

async function meldenHandler() {
	db?.create("ASBCheck", {
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
                on:click={async () =>
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
