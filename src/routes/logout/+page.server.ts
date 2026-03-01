import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions = {
    default: async ({ cookies }) => {
        const sessionId = cookies.get('session_id');
        if (sessionId) {
            deleteSession(sessionId);
            cookies.delete('session_id', { path: '/' });
        }
        throw redirect(303, '/login');
    }
} satisfies Actions;
