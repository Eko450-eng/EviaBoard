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

<img class={`w-${size} h-${size} rounded-full  aspect-auto object-cover`} loading="lazy" src={user.image && user.image !== '' ? user.image : avatar} alt={`${user.name}s Profilbild`}>
