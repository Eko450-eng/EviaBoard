<script lang="ts">
    import * as Avatar from "$ui/avatar/index";
    import type { User } from "$lib/types";

    export let user: User;
</script>

<div class="flex center mx-2 items-center">
    <Avatar.Root class="w-6 h-6">
        <Avatar.Image
            src={user.image}
            alt={user.name}
            loading="lazy"
            width="10"
            height="10"
        />
        <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
    <p class="p-2">
        {user.name}
    </p>
</div>
