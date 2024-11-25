<script lang="ts">
import { Input } from '$ui/input';
import { formatDate } from '@/helpers/formating';
import Card from '$lib/components/mycomp/animated/Card.svelte';
import CardDesc from '$lib/components/mycomp/animated/CardDesc.svelte';
import CardSkeletonContainer from '$lib/components/mycomp/animated/CardSkeletonContainer.svelte';
import CardTitle from '$lib/components/mycomp/animated/CardTitle.svelte';
import FeatureSkeleton from '$lib/components/mycomp/animated/FeatureSkeleton.svelte';
import { userStore } from '@/stores/userstore';
import { Label } from '@/components/ui/label';
import { Icon } from 'svelte-icons-pack';
import { FaSolidClipboard } from 'svelte-icons-pack/fa';
import { Button } from '@/components/ui/button';
import { toast } from 'svelte-sonner';
import type { PageServerData } from './$types';
import type { User } from '@/types';

interface Props {
	data: PageServerData;
	user: User;
}

function copy(value: string) {
	navigator.clipboard.writeText(value).then(() => {
		toast.success('Copied');
	});
}

let { user }: Props = $props();
let userObject: User = $state<User>(user);
</script>

{#if $userStore && $userStore.role > 10 && userObject.id}
    <form method="POST" action="?/update">
        <Card>
          <CardSkeletonContainer>
            {#if userObject}
                <FeatureSkeleton user={user} />
            {/if}
          </CardSkeletonContainer>
            <CardTitle>
                <Input name="name" type="text" bind:value={userObject.name} />
            </CardTitle>
          <CardDesc>
            <div class="flex items-center justify-between">
                <Label for="role" class="">Role: </Label>
                <Input name="role" type="number" bind:value={userObject.role} />
            </div>
            <div class="flex items-center justify-between">
                <Label for="email" class="flex items-center">EMail:</Label>
                <Input name="email" type="email" bind:value={userObject.email} />
                <Button variant="ghost" onclick={()=> copy(userObject.email)}>
                    <Icon src={FaSolidClipboard} />
                </Button>
            </div>
            <div class="flex items-center justify-between">
                <Label for="id" class="flex items-center">ID:</Label>
                <Input name="id" value={userObject.id.toString()} />
                <Button variant="ghost" onclick={()=> copy(userObject.id?.toString() ?? "")}>
                    <Icon src={FaSolidClipboard} />
                </Button>
            </div>
            <div class="flex items-center justify-between">
                {#if userObject.created_at} 
                    {formatDate(userObject.created_at)}
                {/if}
                <Button type="submit" variant="outline">
                    Save
                </Button>
            </div>
          </CardDesc>
        </Card>
    </form>
{/if}
