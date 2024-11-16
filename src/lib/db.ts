import { goto } from '$app/navigation';
import { env } from '$env/dynamic/public';
import { Surreal } from 'surrealdb';
import type { NotificationResult, User } from './types';
import { checkUser, isLoggedIn, userStore } from './stores/user.store';

let HOST = env.PUBLIC_DB_HOST;
let NS = env.PUBLIC_DB_NS;
let DB_KEY = env.PUBLIC_DB_DB;
let ADMINPW = env.PUBLIC_DB_ROOT_PW;
let ADMINUSER = 'admin';

let db: Surreal | undefined;

export async function initDb(): Promise<Surreal | undefined> {
	console.log('Started connecting');
	if (!db) {
		db = new Surreal();

		try {
			await db.connect(HOST, {
				versionCheck: false,
				auth: {
					namespace: NS,
					database: DB_KEY,
					username: ADMINUSER,
					password: ADMINPW,
				},
			});
			console.log('connected');
			return db;
		} catch (err) {
			console.error(err);
			throw err;
		}
	}
	return db;
}

export async function closeDb(): Promise<void> {
	if (!db) return;
	await db.close();
	db = undefined;
}

export async function getDb(): Promise<Surreal | undefined> {
	if (!db) {
		return await initDb();
	}
	return db;
}

export async function signIn(data: User): Promise<NotificationResult> {
	db = await getDb();

	if (!db)
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
				password: data.password,
			},
		});
		if (token) {
			localStorage.setItem('user_token', token);
			let q = `SELECT name FROM user WHERE email = '${data.email}'`;
			let [user] = await db.query<Array<Array<User>>>(q);
			await checkUser(token);
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

export async function signUp(
	data: User,
	confirmPass: string,
): Promise<NotificationResult> {
	db = await getDb();
	if (data.password !== confirmPass) {
		return {
			title: 'Oops',
			desc: 'Versuch mal in beiden Feldern dasselbe Passwort',
			error: true,
		};
	}

	if (data.password.length < 8) {
		return {
			title: 'Oops',
			desc: 'Passwort zu kurz',
			error: true,
		};
	}

	if (!db || !NS || !DB_KEY) {
		return {
			title: 'Dang',
			desc: 'Uhhh... dieser Fehler ist unerwartet, bitte mal an Eko wenden',
			error: true,
		};
	}

	const token = await db?.signup({
		namespace: NS,
		database: DB_KEY,
		access: 'user',
		variables: {
			email: data.email,
			image: '',
			user: data.name,
			password: data.password,
			role: 0,
		},
	});

	if (token) {
		localStorage.setItem('user_token', token);
		await checkUser(token);
		goto('/', { replaceState: true });
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
					username: ADMINUSER,
					password: ADMINPW,
				},
			});
		} catch (err) {
			console.error(err);
			throw err;
		}
	}
	goto('/', { replaceState: true });
	userStore.set(undefined);
	isLoggedIn.set(false);
	goto('/', { replaceState: true });
	return {
		title: 'Bye',
		desc: 'Bis dann',
		error: false,
	};
}
