<script lang="ts">
import SparkleCard from './SparkleCard.svelte';
import Container from './Container.svelte';
import AvatarImage from '$lib/components/mycomp/avatarImage.svelte';
import type { User } from '@/types';

let key = $state(false);
let { user }: { user: User } = $props();
</script>

<div
  class="p-8 overflow-hidden h-full relative flex items-center justify-center"
>
  <div class="flex flex-row flex-shrink-0 justify-center items-center gap-2">
    {#key key}
      <div class="animate-ty" style="--animation-delay:3.5s">
        <Container class="h-80 w-80 circle-5">
            <AvatarImage size={80} user={user}/>
        </Container>
      </div>
    {/key}
  </div>
  <SparkleCard />
</div>
