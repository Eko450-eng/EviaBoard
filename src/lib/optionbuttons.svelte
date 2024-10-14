<script lang="ts">
    import { checkIsLoggedIn, isLoggedIn } from "../routes/store";
    import { Button } from "./components/ui/button/index";
    import { toggleMode } from "mode-watcher";
    import { signOut } from "./db";
    import Exit from "svelte-radix/Exit.svelte";
    import Sun from "svelte-radix/Sun.svelte";
    import Moon from "svelte-radix/Moon.svelte";
    import { Icon } from "svelte-icons-pack";
    import { AiFillBug } from "svelte-icons-pack/ai";
</script>

<div class="optionButtons">
    {#if $isLoggedIn}
        <Button
            on:click={async () => {
                signOut();
                checkIsLoggedIn(false);
            }}
            variant="outline"
            size="icon"
        >
            <Exit
                class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span class="sr-only">Toggle theme</span>
        </Button>
    {/if}
    <Button href="/featureboard" variant="outline" size="icon">
        <Icon
            src={AiFillBug}
            size={18}
        />
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
