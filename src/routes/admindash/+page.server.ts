import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const fbSearchSchema = z.object({
	category: z.string(),
	statuses: z.string(),
});

const userSchema = z.object({
	id: z.string(),
	name: z.string().min(3),
	email: z.string().email(),
	role: z.coerce.number(),
});

export const load: PageServerLoad = async ({ parent, fetch }) => {
	const form = superValidate(zod(userSchema));

	await parent();

	let res = await fetch(`/api/admindashboard`, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	let { users } = await res.json();

	return { data: users, form };
};

export const actions = {
	fbEntries: async ({ fetch, request }) => {
		const searchData = Object.fromEntries(await request.formData());
		const search = fbSearchSchema.parse(searchData);

		let category = search.category.split(',');
		let statuses = search.statuses.split(',');

		let dataRaw = await fetch(`/api/featureboard/count`, {
			method: 'PATCH',
			body: JSON.stringify({ category, statuses }),
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		let data = await dataRaw.json();

		return { fbCount: data, success: true };
	},
	update: async ({ request, fetch }) => {
		const data = Object.fromEntries(await request.formData());
		const user = userSchema.parse(data);

		// await generateAvatar($userStore);
		await fetch(`/api/user/update`, {
			method: 'PATCH',
			body: JSON.stringify({ user }),
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		return { success: true };
	},
} satisfies Actions;
