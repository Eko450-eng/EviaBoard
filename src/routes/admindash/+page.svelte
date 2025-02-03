<script lang="ts">
import type { PageServerData } from './$types';
import UserCard from './userCard.svelte';
import Updates from './updates.svelte';
import FeatureBoardEntries from './featureBoardEntries.svelte';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// TODO: Add user Managment
// TODO: Add Analytics Managment
// TODO: Add Analytics for Notify messages

let { data }: PageServerData = $props();
let showUsers = $state(true);
</script>

<div class="flex flex-col">
    <h1>Admin Dashboard</h1>
    <div class="flex gap-2 my-4 items-center">
        <Label for="showUsers" >Show Users</Label>
        <Switch
            id="showUsers"
            bind:checked={showUsers}
        />
    </div>
    <Separator />
    <div class="flex gap-4 flex-wrap my-4 justify-center w-full">
        <Updates /> 
    </div>
    <Separator />
    <div class="flex gap-4 flex-wrap my-4 justify-center w-full">
        <FeatureBoardEntries data={data} />
    </div>
    <Separator />
    <div class="flex gap-4 flex-wrap my-4 justify-center w-full">
        {#if showUsers}
            {#each data.data as user} 
                <UserCard data={data} user={user} />
            {/each} 
        {/if}
    </div>
</div>
