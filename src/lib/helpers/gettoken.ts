export function getToken(): string {
	let token = localStorage.getItem('user_token');
	if (!token) return '';
	return token;
}
