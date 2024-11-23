import { json } from '@sveltejs/kit';

export function jres(status: number, title?: string, desc?: string): Response {
	if (!title) {
		switch (status) {
			case 200:
				return json(
					{ title: 'OK', description: 'Ist gebonkt!' },
					{ status: status },
				);
			case 400:
				return json(
					{
						title: 'Something wong',
						description: 'Irgendwas stimmt nicht mit deiner Anfrage',
					},
					{ status: status },
				);
			case 401:
				return json(
					{ title: 'Nope', description: 'Du bist nicht angemeldet' },
					{ status: status },
				);
			case 403:
				return json(
					{ title: 'Nope', description: 'Du bist hierzu nicht befugt' },
					{ status: status },
				);
			case 404:
				return json(
					{
						title: 'Was suchst du?',
						description: 'Hier gibt es nichts zu sehen',
					},
					{ status: status },
				);
		}
	}
	return json({ title: title, description: desc }, { status: status });
}
