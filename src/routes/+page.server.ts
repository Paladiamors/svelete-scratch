import { redirect } from '@sveltejs/kit';
import { getNotes } from '$lib/server/notes';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const notes = getNotes(locals.user.id);
	return { notes };
}) satisfies PageServerLoad;
