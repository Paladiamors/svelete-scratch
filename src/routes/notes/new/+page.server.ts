import { fail, redirect } from '@sveltejs/kit';
import { createNote } from '$lib/server/notes';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }
};

export const actions: Actions = {
    default: async ({ locals, request }) => {
        if (!locals.user) {
            throw redirect(302, '/login');
        }

        const data = await request.formData();
        const title = data.get('title')?.toString();
        const content = data.get('content')?.toString();
        const tagsString = data.get('tags')?.toString();

        if (!title || !content) {
            return fail(400, { missing: true });
        }

        const tags = tagsString ? tagsString.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];
        const noteId = createNote(locals.user.id, title, content, tags);

        throw redirect(303, `/notes/${noteId}`);
    }
};
