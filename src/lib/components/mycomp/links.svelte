<script lang="ts">
import { page } from "$app/stores";
import {
	FaSolidArrowRightToBracket,
	FaSolidBook,
	FaSolidDownload,
	FaSolidGlobe,
	FaSolidHouse,
} from "svelte-icons-pack/fa";
import { isLoggedIn } from "../../../routes/store";
import LinkButton from "./link-button.svelte";

const authenticatedLinks = [
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

const unauthenticatedLinks = [
	{
		icon: FaSolidArrowRightToBracket,
		name: "Login or Signup",
		value: "/login",
	},
];

const links = [
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

