<script lang="ts">
    import * as Sidebar from '@/components/ui/sidebar';
    import '../app.css';
    import { Toaster } from '$lib/components/ui/sonner';
    import { Button } from '$ui/button';
    import { Icon } from 'svelte-icons-pack';
    import { FaBell } from 'svelte-icons-pack/fa';
    import Appsidebar from '@/components/mycomp/appsidebar.svelte';
    import { isLoggedIn, userStore } from '@/stores/userstore';
    
    let { children, data }: any = $props();
    
    $effect(() => {
    	if (data.resUserData) {
    		userStore.set(data.resUserData.userObject);
    		isLoggedIn.set(data.resUserData.isValid);
    	}
    });
    let notifications = 0;
</script>

<Toaster />

<main class="m-4">
    <Sidebar.Provider open={false}>
      <Appsidebar  />
      <main class="w-full">
        <div class="flex justify-between">
            <Sidebar.Trigger />
            <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
            >
                <Icon className="notification" src={FaBell} />
                {notifications}
            </Button>
        </div>
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

    :global(.notification-received){
        position: relative;
    }

    :global(.notification-received::before){
        content: "tes";
        position: absolute;
        top: 0;
        left: 0;
        width: 10px;
        height: 10px;
        color: red;
    }
</style>
