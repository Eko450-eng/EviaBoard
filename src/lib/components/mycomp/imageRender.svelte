<script>
import * as Dialog from '$ui/dialog';
import { Button } from '../ui/button';

export let src;
export let alt;

let open = false;
</script>

<div role="button" aria-label="Fullscreen this Image" onkeydown={()=>open = true} tabindex=0 onclick={()=>open = true}>
    <img class="w-1/3" {src} {alt} />
</div>

<Dialog.Root
    open={open}
    onOpenChange={() => (open = !open)}
>
    <Dialog.Content class="w-4/5 h-4/5 max-w-[80%] max-h-[80vh] flex">
        <img class="w-100lvw" {src} {alt} />
    </Dialog.Content>
</Dialog.Root>
