<script lang="ts">
import '$lib/themes/github.scss';
import '$lib/themes/discord.scss';
import '$lib/themes/codedark.scss';
import 'carta-md/default.css';
import '@cartamd/plugin-anchor/default.css';
import '@cartamd/plugin-code/default.css';
import { MarkdownEditor } from 'carta-md';
import '@cartamd/plugin-attachment/default.css';
import carta from '$lib/helpers/carta';

let { text = $bindable() }: { text: string } = $props();
</script>

<div class="w-full">
    <MarkdownEditor
        {carta}
        bind:value={text}
    />
</div>
