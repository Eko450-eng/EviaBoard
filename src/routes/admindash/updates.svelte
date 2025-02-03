<script lang="ts">
import { Input } from '$ui/input';
import { Button } from '$ui/button';
import { Label } from '@/components/ui/label';
import NumberTicker from '@/components/mycomp/animated/NumberTicker.svelte';
import BorderBeam from '$lib/components/mycomp/animated/BorderBeam.svelte';

let category = $state('0,1,2');
let statuses = $state('0,1,2');

let changes: Object = $state(Object);
async function getData() {
	let dataRaw = await fetch(`/api/admindashboard/changes`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	let data = await dataRaw.json();
	console.log(data);
	changes = data;
}
</script>

<Button onclick={getData}>Get</Button>
{changes}

<article
  class="flex max-w-xl flex-col items-start justify-between relative rounded-3xl p-7 border border-gray-700/70 bg-background"
>
  <BorderBeam size={150} duration={12} />
  <div class="flex items-center gap-x-4 text-xs">
  </div>
  <div class="group relative">
    <p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
      Welcome to Svelte Animation website. This website includes Qualtiy
      Tailwind CSS and Framer Motion Components. Inspired from <span
        class="text-gray-300 underline underline-offset-2">Magic UI</span
      >
      and <span class="text-gray-300 underline underline-offset-2">Luxe</span>
      Componenets.
    </p>
  </div>
  <div class="relative mt-8 flex items-center gap-x-4">
    <img
      src="https://avatars.githubusercontent.com/u/93428946?v=4"
      alt="bhide"
      class="h-10 w-10 rounded-full bg-gray-50"
    />
    <div class="text-sm leading-5">
      <p class="font-semibold text-white">
        <a href="https://github.com/SikandarJODD">
          <span class="absolute inset-0"></span>
          Sikandar Bhide
        </a>
      </p>
      <p class="text-gray-500">Svelte Developer</p>
    </div>
  </div>
</article>
