export function categoryToText(value: number): string {
	switch (value) {
		case 0:
			return 'Bug';
		case 1:
			return 'Feature';
		case 2:
			return 'Question';
		default:
			return 'Bug';
	}
}

export function statusToText(value: number): string {
	switch (value) {
		case 0:
			return 'open';
		case 1:
			return 'WIP';
		case 2:
			return 'Accepted';
		case 3:
			return 'Denied';
		case 4:
			return 'Closed';
		case 10:
			return 'Archived';
		default:
			return 'Open';
	}
}

export function textToStatus(value: string): number {
	if (value === '') return -1;
	switch (value) {
		case 'open':
			return 0;
		case 'WIP':
			return 1;
		case 'Accepted':
			return 2;
		case 'Denied':
			return 3;
		case 'Closed':
			return 4;
		case 'Archived':
			return 10;
		default:
			return 0;
	}
}

export function textToCategory(value: string): number {
	if (value === '') return -1;
	switch (value) {
		case 'Bug':
			return 0;
		case 'Feature':
			return 1;
		case 'Question':
			return 2;
		default:
			return 0;
	}
}
