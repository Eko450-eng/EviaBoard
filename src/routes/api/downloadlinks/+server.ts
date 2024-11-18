import { getDb } from '@/server/db';
import type { ASBCheck } from '@/types';
import { json } from '@sveltejs/kit';

export async function GET() {
	let db = await getDb();
	let data = await db?.select<ASBCheck>('ASBCheck');
	if (!data) {
		return json({ status: 200 });
	}

	return json({ data }, { status: 200 });
}

export async function PATCH({ request }: { request: Request }) {}

export async function POST({ request }: { request: Request }) {}
