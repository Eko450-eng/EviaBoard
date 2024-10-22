<script lang="ts">
    import { isLoggedIn } from "../../../routes/store";
    import { Button } from "$ui/button";
    import { toggleMode } from "mode-watcher";
    import Sun from "svelte-radix/Sun.svelte";
    import Moon from "svelte-radix/Moon.svelte";
    import "@fortawesome/fontawesome-free/css/all.min.css";
    import { Icon } from "svelte-icons-pack";
    import {
        FaSolidUser,
        FaSolidBug,
    } from "svelte-icons-pack/fa";
</script>

<div class="optionButtons">
    {#if $isLoggedIn}
    <Button href="/user" variant="outline" size="icon">
        <Icon src={FaSolidUser} size={24} />
    </Button>
    {/if}
    <Button href="/featureboard" variant="outline" size="icon">
        <Icon src={FaSolidBug} size={24} />
    </Button>
    <Button on:click={toggleMode} variant="outline" size="icon">
        <Sun
            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Moon
            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
    </Button>
</div>

<style>
    .optionButtons {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 1em;
    }
</style>
