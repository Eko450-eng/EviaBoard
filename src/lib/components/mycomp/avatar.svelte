<script lang="ts">
import * as Avatar from '$ui/avatar/index';
import type { User } from '$lib/types';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

export let user: User;
export let size: number;

const avatar = createAvatar(lorelei, {
	seed: user.name,
}).toDataUri();
</script>

<div class="flex center mx-2 items-center">
    <Avatar.Root class="w-6 h-6">
        <img class={`w-${size} h-${size} rounded-full  aspect-auto object-cover`} loading="lazy" src={user.image && user.image !== '' ? user.image : avatar} alt={`${user.name}s Profilbild`}>
    </Avatar.Root>
    <p class="p-2">
        {user.name}
    </p>
</div>
