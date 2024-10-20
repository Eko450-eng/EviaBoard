<script lang="ts">
    import * as Avatar from "./components/ui/avatar/index";
    import type { user } from "./db";
    import { userData } from "../routes/store";

    export let user: user;
</script>

<div class="flex center mx-2 items-center">
    <Avatar.Root class="w-6 h-6">
        <Avatar.Image src={$userData.image} />
        <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
    <h2 class="text-1xl p-2">
        {user.name}
    </h2>
</div>
