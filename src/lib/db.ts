import { goto } from '$app/navigation';
import { env } from '$env/dynamic/public';
import { RecordId, Surreal } from 'surrealdb';
import { DB, userData } from '../routes/store';
import type { NotificationResult, User } from './types';

let HOST = env.PUBLIC_DB_HOST;
let NS = env.PUBLIC_DB_NS;
let DB_KEY = env.PUBLIC_DB_DB;
let guestpw = env.PUBLIC_DB_GUEST_PW;

export let db: Surreal | undefined;

export async function initDb(): Promise<Surreal | undefined> {
	if (db) {
		return db;
	}

	db = new Surreal();

	try {
		await db.connect(HOST, {
			versionCheck: false,
			auth: {
				namespace: NS,
				database: DB_KEY,
				username: 'eviaguest',
				password: guestpw,
			},
		});
		return db;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

export async function closeDb(): Promise<void> {
	if (!db) return;
	await db.close();
	db = undefined;
}

export async function getDb(): Promise<Surreal | undefined> {
	return db;
}

export async function signIn(data: {
	username: string;
	email: string;
	pass: string;
	confirmPass: string;
}): Promise<NotificationResult> {
	if (!db || !NS || !DB_KEY)
		return {
			title: 'Dang',
			desc: 'Uhhh... dieser Fehler ist unerwartet, bitte mal an Eko wenden',
			error: true,
		};
	try {
		const token = await db.signin({
			namespace: NS,
			database: DB_KEY,
			access: 'user',
			variables: {
				email: data.email,
				password: data.pass,
			},
		});
		if (token) {
			localStorage.setItem('user_token', token);
			DB.set(db);
			let q = `SELECT name FROM user WHERE email = '${data.email}'`;
			let [user] = await db.query<Array<Array<User>>>(q);
			return {
				title: 'Willkommen zurück',
				desc: `Wo warst du so lange ${user[0].name}`,
				error: false,
			};
		}
	} catch (e) {
		console.error(e);
		return {
			title: 'Oops',
			desc: 'Sicher dass alle deine Daten korrekt eingetragen sind?',
			error: true,
		};
	}
	return {
		title: 'Wie?',
		desc: 'Wie kamst du an diese Stelle von meinem code...',
		error: true,
	};
}

export async function signUp(data: {
	username: string;
	email: string;
	pass: string;
	confirmPass: string;
}): Promise<NotificationResult> {
	if (data.pass !== data.confirmPass) {
		return {
			title: 'Oops',
			desc: 'Versuch mal in beiden Feldern dasselbe Passwort',
			error: true,
		};
	}
	if (data.pass.length < 8) {
		return {
			title: 'Oops',
			desc: 'Passwort zu kurz',
			error: true,
		};
	}

	if (!db || !NS || !DB_KEY)
		return {
			title: 'Dang',
			desc: 'Uhhh... dieser Fehler ist unerwartet, bitte mal an Eko wenden',
			error: true,
		};

	const token = await db.signup({
		namespace: NS,
		database: DB_KEY,
		access: 'user',
		variables: {
			user: data.username,
			email: data.email,
			password: data.pass,
		},
	});
	if (token) {
		localStorage.setItem('user_token', token);
		DB.set(db);
		goto('/');
	}

	return {
		title: 'Nice',
		desc: 'Willkommen an Board',
		error: false,
	};
}

export async function signOut() {
	localStorage.clear();
	if (db) {
		try {
			await db.connect(HOST, {
				auth: {
					namespace: NS,
					database: DB_KEY,
					username: 'eviaguest',
					password: guestpw,
				},
			});
		} catch (err) {
			console.error(err);
			throw err;
		}
	}
	userData.set({
		email: '',
		id: new RecordId('user', 'tada'),
		name: '',
		password: '',
		role: '',
		created_at: new Date(),
	});
	goto('/');
	return {
		title: 'Bye',
		desc: 'Bis dann',
		error: false,
	};
}
