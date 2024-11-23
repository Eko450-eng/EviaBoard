<script lang="ts">
import { Button } from '$ui/button';
import { Input } from '$ui/input';
import { sendPush } from '@/helpers/push';
import { userStore } from '@/stores/userstore';

let food = $state('Pizza');
let user = $state($userStore?.name);

async function sendPushHandler() {
	try {
		await sendPush(
			'Essensbestellung',
			`${user} will ${food} bestellen, wenn du auch was willst meld dich bei ${user}`,
		);
	} catch (e) {
		console.error(e);
	}
}
</script>

<div class="flex">
    <Input
        class="mt-3"
        type="text"
        name="food"
        placeholder="Was gibt es zu essen?"
        bind:value={food}
    />
    <Button class="m-3" onclick={sendPushHandler} variant="secondary"
        >Absenden!</Button
    >
</div>

<h3 class="mt-3">Vorschau</h3>
<p>
    {user} will {food} bestellen, wenn du auch was willst meld dich bei {user}
</p>
