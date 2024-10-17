<script lang="ts">
    import Links from "$lib/links.svelte";
    import Optionbuttons from "$lib/optionbuttons.svelte";
    import { ModeWatcher } from "mode-watcher";
    import "../app.css";
    import { Toaster } from "$lib/components/ui/sonner";
    import { onMount } from "svelte";
    import { checkLoggedIn, userData } from "./store";

    onMount(async () => {
        checkLoggedIn();
    });
</script>

<ModeWatcher />
<Toaster />

<div class="logo"></div>
<div class="mainview">
    <nav>
        <div class="spacebetween">
            <div>
                <Links />
            </div>
            <Optionbuttons />
        </div>
    </nav>
    <main>
        <slot></slot>
    </main>
</div>

<div class={$userData.email ? "online" : "offline"}></div>
<div style="position: absolute; top: 1em; left: 50%">{$userData.id}</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }

    nav {
        height: 100vh;
        margin-right: 1em;
        display: flex;
        width: min-content;
        align-items: center;
        flex-direction: column;
        border-right: 1px solid teal;
        border-top: 1px solid teal;
        border-top-right-radius: 10px;
        position: fixed;
    }

    main {
        margin-left: 5em;
    }

    .mainview {
        display: flex;
        grid-template-columns: 1fr 10fr;
    }

    .spacebetween {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 90%;
    }
    .logo {
        width: 10em;
        height: 1em;
        background-image: url(../lib/assets/Evia-Board.svg);
        background-size: contain;
        background-repeat: no-repeat;
        margin: 1em 2em;
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
