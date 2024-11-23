<script lang="ts">
import * as Sidebar from '@/components/ui/sidebar';
import '../app.css';
import { afterNavigate, goto } from '$app/navigation';
import { Toaster } from '$lib/components/ui/sonner';
import { Button } from '$ui/button';
import { Icon } from 'svelte-icons-pack';
import { FaSolidArrowLeft } from 'svelte-icons-pack/fa';
import Appsidebar from '@/components/mycomp/appsidebar.svelte';
import { onMount } from 'svelte';
import { isLoggedIn, userStore } from '@/stores/userstore';

let previousPage = $state('/');

let { children, data }: any = $props();

$effect(() => {
	if (data.resUserData) {
		userStore.set(data.resUserData.userObject);
		isLoggedIn.set(data.resUserData.isValid);
	}
});

afterNavigate(({ from }) => {
	if (!from?.url) return;
	previousPage = from.url.pathname || previousPage;
});

onMount(async () => {});
</script>

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

    :global(textarea.carta-font-code, div.carta-font-code){
        line-height: 1.2rem;
        font-size: 0.9rem;
    }
</style>
