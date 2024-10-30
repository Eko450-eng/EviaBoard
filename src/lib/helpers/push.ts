export async function sendPush(channelName: string, payload: string) {
	try {
		const response = await fetch('/api/notify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ payload, channelName }),
		});

		return await response.json();
	} catch (e) {
		console.error(e);
	}
}
