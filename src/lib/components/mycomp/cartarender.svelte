<script lang="ts">
    import { Markdown } from "carta-md";
    import "$lib/themes/github.scss";
    import "$lib/themes/discord.scss";
    import "carta-md/default.css";
    import "@cartamd/plugin-anchor/default.css";
    import "@cartamd/plugin-code/default.css";
    import "@cartamd/plugin-attachment/default.css";
    import carta from '$lib/helpers/carta'

    let { text }: { text: string } = $props();
</script>

<Markdown {carta} value={text} />
