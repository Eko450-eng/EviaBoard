export function formatDate(rawDate: Date) {
	const date = new Date(rawDate);
	const formattedDate = new Intl.DateTimeFormat('de-DE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	}).format(date);
	return formattedDate;
}
