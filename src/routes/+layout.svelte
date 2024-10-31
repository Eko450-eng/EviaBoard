<script lang="ts">
import * as Sidebar from '@/components/ui/sidebar';
import { ModeWatcher } from 'mode-watcher';
import '../app.css';
import { afterNavigate, goto } from '$app/navigation';
import { Toaster } from '$lib/components/ui/sonner';
import { Button } from '$ui/button';
import { onMount } from 'svelte';
import { Icon } from 'svelte-icons-pack';
import { FaSolidArrowLeft } from 'svelte-icons-pack/fa';
import { DB, checkAdminMode, checkLoggedIn } from './store';
import Appsidebar from '@/components/mycomp/appsidebar.svelte';
import { useSidebar } from "$lib/components/ui/sidebar/index.js";

let previousPage = $state('/');

afterNavigate(({ from }) => {
	if (!from?.url) return;
	previousPage = from.url.pathname || previousPage;
});

onMount(async () => {
	checkLoggedIn();
	checkAdminMode();
});

let { children } = $props();

</script>

<ModeWatcher />
<Toaster />

<main class="m-4">
    <Sidebar.Provider open={false}>
      <Appsidebar />
      <main>
        <Sidebar.Trigger />
        <Button
            aria-label="go to last page"
            variant="outline"
            onclick={() => goto(previousPage)}
        >
            <Icon src={FaSolidArrowLeft} />
        </Button>
        {@render children()}
      </main>
    </Sidebar.Provider>
</main>

<div class={$DB.status !== "connected" ? "offline" : "online"}></div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
    .offline {
        width: 0.5em;
        height: 0.5em;
        border-radius: 100%;
        background: red;
        position: fixed;
        top: 1em;
        right: 1em;
    }
    .online {
        width: 0.5em;
        height: 0.5em;
        border-radius: 100%;
        background: green;
        position: fixed;
        top: 1em;
        right: 1em;
    }
</style>
