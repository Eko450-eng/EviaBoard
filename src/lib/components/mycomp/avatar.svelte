<script lang="ts">
    import * as Avatar from "$ui/avatar/index";
    import type { User } from "$lib/types";

    export let user: User;
</script>

<div class="flex center mx-2 items-center">
    <Avatar.Root class="w-6 h-6">
        <Avatar.Image src={user.image} />
        <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
    <h2 class="text-1xl p-2">
        {user.name}
    </h2>
</div>
