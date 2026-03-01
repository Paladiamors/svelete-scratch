import { fail, redirect } from '@sveltejs/kit';
import { verifyUser, createSession } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (!username || !password) {
			return fail(400, { missing: true });
		}

		const user = verifyUser(username.toString(), password.toString());

		if (!user) {
			return fail(400, { invalid: true });
		}

		const sessionId = createSession(user.id);
		cookies.set('session_id', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 // 1 week
		});

		throw redirect(303, '/');
	}
} satisfies Actions;
