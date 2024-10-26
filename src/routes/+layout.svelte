<script lang="ts">
import Links from "$lib/components/mycomp/links.svelte";
import Optionbuttons from "$lib/components/mycomp/optionbuttons.svelte";
import { ModeWatcher } from "mode-watcher";
import "../app.css";
import { afterNavigate, goto } from "$app/navigation";
import { Toaster } from "$lib/components/ui/sonner";
import { Button } from "$ui/button";
import { onMount } from "svelte";
import { Icon } from "svelte-icons-pack";
import { FaSolidArrowLeft } from "svelte-icons-pack/fa";
import { DB, checkAdminMode, checkLoggedIn } from "./store";

let previousPage = $state("/");

afterNavigate(({ from }) => {
	if (!from?.url) return;
	previousPage = from.url.pathname || previousPage;
});

onMount(async () => {
	checkLoggedIn();
	checkAdminMode();
});
</script>

<ModeWatcher />
<Toaster />

<div class="bg-muted/40 flex min-h-screen w-full flex-col">
    <main class="m-4">
        <aside
            class="bg-background fixed inset-y-0 left-0 z-10 w-20 flex-col border-r sm:flex"
        >
            <nav
                class="flex flex-col items-center gap-4 px-2 py-4 h-full border-r border-teal-500"
            >
                <div
                    class="flex flex-col justify-between content-between h-full"
                >
                    <div>
                        <Links />
                    </div>
                    <Optionbuttons />
                </div>
            </nav>
        </aside>
        <div class="flex flex-row gap-4 items-center">
            <Button
                aria-label="go to last page"
                variant="outline"
                on:click={() => goto("/knowledgeboard")}
            >
                <Icon src={FaSolidArrowLeft} />
            </Button>
            <div class="logo"></div>
        </div>
        <slot></slot>
    </main>
</div>

<div class={$DB.status !== "connected" ? "offline" : "online"}></div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }

    main {
        margin-left: 6em;
    }

    .logo {
        width: 10em;
        height: 1em;
        background-image: url(../lib/assets/Evia-Board.svg);
        background-size: contain;
        background-repeat: no-repeat;
        margin: 1em 0;
        position: relative;
    }
    .logo:after {
        content: "";
        width: 100%;
        height: 100%;
        top: 0;
        position: absolute;
        background: inherit;
        filter: blur(20px);
        z-index: -1;
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
