<script lang="ts">
import * as Sidebar from '@/components/ui/sidebar';
import { ModeWatcher, setMode } from 'mode-watcher';
import '../app.css';
import { afterNavigate, goto } from '$app/navigation';
import { Toaster } from '$lib/components/ui/sonner';
import { Button } from '$ui/button';
import { Icon } from 'svelte-icons-pack';
import { FaSolidArrowLeft } from 'svelte-icons-pack/fa';
import Appsidebar from '@/components/mycomp/appsidebar.svelte';
import { onMount } from 'svelte';

let previousPage = $state('/');

afterNavigate(({ from }) => {
	if (!from?.url) return;
	previousPage = from.url.pathname || previousPage;
});

onMount(async () => {
	setMode('dark');
});

let { children } = $props();
</script>

<ModeWatcher />
<Toaster />

<main class="m-4">
    <Sidebar.Provider open={false}>
      <Appsidebar  />
      <main class="w-full">
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

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
    /* .offline { */
    /*     width: 0.5em; */
    /*     height: 0.5em; */
    /*     border-radius: 100%; */
    /*     background: red; */
    /*     position: fixed; */
    /*     top: 1em; */
    /*     right: 1em; */
    /* } */
    /* .online { */
    /*     width: 0.5em; */
    /*     height: 0.5em; */
    /*     border-radius: 100%; */
    /*     background: green; */
    /*     position: fixed; */
    /*     top: 1em; */
    /*     right: 1em; */
    /* } */
    :global(textarea.carta-font-code, div.carta-font-code){
        line-height: 1.2rem;
        font-size: 0.9rem;
    }
</style>
