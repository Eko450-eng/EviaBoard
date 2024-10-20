<script lang="ts">
    import "../app.css";
    import { page } from "$app/stores";
    import { isLoggedIn } from "../routes/store";
    import LinkButton from "./link-button.svelte";
    import {
        FaSolidArrowRightToBracket,
        FaSolidBook,
        FaSolidDownload,
        FaSolidGlobe,
        FaSolidHouse,
    } from "svelte-icons-pack/fa";

    let authenticatedLinks = [
        {
            icon: FaSolidBook,
            name: "knowledgeboard",
            value: "/knowledgeboard",
        },
        {
            icon: FaSolidDownload,
            name: "Links",
            value: "/downloadlinks",
        },
        {
            icon: FaSolidGlobe,
            name: "ASB",
            value: "/asb",
        },
    ];

    let unauthenticatedLinks = [
        {
            icon: FaSolidArrowRightToBracket,
            name: "Login or Signup",
            value: "/login",
        },
    ];

    let links = [
        {
            icon: FaSolidHouse,
            name: "Home & News",
            value: "/",
        },
    ];
</script>

{#each links as link}
    <LinkButton {link} pathname={$page.url.pathname} />
{/each}
{#if $isLoggedIn}
    {#each authenticatedLinks as link}
        <LinkButton {link} pathname={$page.url.pathname} />
    {/each}
{:else}
    {#each unauthenticatedLinks as link}
        <LinkButton {link} pathname={$page.url.pathname} />
    {/each}
{/if}
