<script lang="ts">
import * as Sidebar from '$lib/components/ui/sidebar/index.js';
import {
	FaSolidArrowRightToBracket,
	FaSolidBook,
	FaSolidBug,
	FaSolidDownload,
	FaSolidGlobe,
	FaSolidHouse,
	FaSolidPlateWheat,
	FaSolidTrain,
	FaSolidUser,
} from 'svelte-icons-pack/fa';
import { Icon } from 'svelte-icons-pack';
import { page } from '$app/stores';
import { isLoggedIn } from '@/stores/user.store';

let authenticatedLinks = [
	{
		icon: FaSolidBook,
		name: 'knowledgeboard',
		value: '/knowledgeboard',
	},
	{
		icon: FaSolidDownload,
		name: 'Downloadlinks',
		value: '/downloadlinks',
	},
	{
		icon: FaSolidGlobe,
		name: 'ASB Online Checker',
		value: '/asb',
	},
	{
		icon: FaSolidPlateWheat,
		name: 'Bestellnotifier',
		value: '/essensbestellungen',
	},
	// {
	// 	icon: FaSolidTrain,
	// 	name: 'Bestellnotifier',
	// 	value: '/dbjournal',
	// },
	{
		icon: FaSolidUser,
		name: 'Profile',
		value: '/user',
	},
	{
		icon: FaSolidBug,
		name: 'Bugs and Features',
		value: '/featureboard',
	},
];

let unauthenticatedLinks = [
	{
		icon: FaSolidArrowRightToBracket,
		name: 'Login or Signup',
		value: '/login',
	},
];

let links = [
	{
		icon: FaSolidHouse,
		name: 'Home & News',
		value: '/',
	},
];
let pathname = $state('/');
$effect(() => {
	pathname = $page.url.pathname;
});
</script>

<Sidebar.Root collapsible="icon" variant="floating">
    <Sidebar.Header>
    <Sidebar.Menu>
    <div class="logo"></div>
    </Sidebar.Menu>
    </Sidebar.Header>
    <Sidebar.Content>
        <Sidebar.Group />
        <Sidebar.SidebarGroupContent>
            <Sidebar.Menu>
                {#each links as item}
                    <Sidebar.MenuItem class="mx-auto">
                        <Sidebar.MenuButton isActive={pathname === item.value}>
                            {#snippet child({props})}
                                <a href={item.value} {...props}>
                                    <Icon src={item.icon} size={24} />
                                    <span class="linkButton-active text-muted-foreground">{item.name}</span>
                              </a>
                            {/snippet}
                        </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                {/each}
                {#if $isLoggedIn}
                    {#each authenticatedLinks as item}
                        <Sidebar.MenuItem class="mx-auto">
                            <Sidebar.MenuButton isActive={pathname === item.value}>
                                {#snippet child({props})}
                                    <a href={item.value} {...props}>
                                        <Icon src={item.icon} size={24} />
                                        <span class="linkButton-active text-muted-foreground">{item.name}</span>
                                  </a>
                                {/snippet}
                            </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                    {/each}
                    {:else}
                    {#each unauthenticatedLinks as item}
                        <Sidebar.MenuItem class="mx-auto">
                            <Sidebar.MenuButton isActive={pathname === item.value}>
                                {#snippet child({props})}
                                    <a href={item.value} {...props}>
                                        <Icon src={item.icon} size={24} />
                                        <span class="linkButton-active text-muted-foreground">{item.name}</span>
                                  </a>
                                {/snippet}
                            </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                    {/each}
                {/if}
            </Sidebar.Menu>
        </Sidebar.SidebarGroupContent>
    </Sidebar.Content>
    <Sidebar.Footer />
</Sidebar.Root>

<style>
    .optionButtons {
        display: flex;
        justify-content: center;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1em;
    }

    .logo {
        margin: 0 auto;
        aspect-ratio: 1/1;
        background-image: url(../../../../favicon.png);
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
        filter: blur(100px);
        z-index: -1;
    }
</style>
