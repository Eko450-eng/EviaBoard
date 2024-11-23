<script lang="ts">
import { Markdown } from 'carta-md';
import '$lib/themes/github.scss';
import '$lib/themes/discord.scss';
import 'carta-md/default.css';
import '@cartamd/plugin-anchor/default.css';
import '@cartamd/plugin-code/default.css';
import '@cartamd/plugin-attachment/default.css';
import { component } from '@cartamd/plugin-component';
import { svelte, initializeComponents } from '@cartamd/plugin-component/svelte';
import Image from './imageRender.svelte';
import { Carta } from 'carta-md';
import { code } from '@cartamd/plugin-code';
import { attachment } from '@cartamd/plugin-attachment';
import { anchor } from '@cartamd/plugin-anchor';
import { imsize } from 'carta-plugin-imsize';
import DOMPurify from 'isomorphic-dompurify';
import { uploadFileGeneric } from '@/helpers/minio.js';

const mapped = [svelte('img', Image)];

const carta = new Carta({
	sanitizer: DOMPurify.sanitize,
	extensions: [
		component(mapped, initializeComponents),
		anchor(),
		code(),
		imsize(),
		attachment({
			upload(file) {
				return uploadFileGeneric(file);
			},
		}),
	],
});

let { text }: { text: string } = $props();
</script>

<Markdown {carta} value={text} />
