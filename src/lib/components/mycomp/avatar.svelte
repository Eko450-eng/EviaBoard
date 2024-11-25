<script lang="ts">
import * as Avatar from '$ui/avatar/index';
import type { User } from '$lib/types';
// import { createAvatar } from '@dicebear/core';
// import { lorelei } from '@dicebear/collection';

export let user: User;
export let size: number;

// const avatar = createAvatar(lorelei, {
// 	seed: user.name,
// }).toDataUri();
</script>

<div class="flex center mx-2 items-center">
    <Avatar.Root class="w-6 h-6">
        {#if user.image && user.image !== ''}
            <img class={`w-${size} h-${size} rounded-full  aspect-auto object-cover`} loading="lazy" src={user.image} alt={`${user.name}s Profilbild`}>
        {:else}
            <img class={`w-${size} h-${size} rounded-full  aspect-auto object-cover`} loading="lazy" src="https://minio.eko450eng.org/eviaboard/avatar-scaled-1866805039.jpeg" alt={`${user.name}s Profilbild`}>
        {/if}
    </Avatar.Root>
    <p class="p-2">
        {user.name}
    </p>
</div>
