import { initDb } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';

initDb();

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session_id');

	if (sessionId) {
		const user = getSession(sessionId);
		if (user) {
			event.locals.user = { id: user.id, username: user.username };
		} else {
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
