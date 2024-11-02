<script lang="ts">
import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
import { Button } from '$lib/components/ui/button/index.js';

let { text = $bindable(), ...restProps } = $props();
</script>
 
<Button variant="ghost" {...restProps}>
    <p>{text}</p>
 <ArrowUpDown class="ml-2 size-4" />
</Button>
