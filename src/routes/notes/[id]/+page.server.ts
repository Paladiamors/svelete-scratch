import { fail, redirect, error } from '@sveltejs/kit';
import { getNote, updateNote, deleteNote } from '$lib/server/notes';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const noteId = parseInt(params.id);
    const note = getNote(noteId, locals.user.id);

    if (!note) {
        throw error(404, 'Note not found');
    }

    return { note };
};

export const actions: Actions = {
    update: async ({ request, locals, params }) => {
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

        const noteId = parseInt(params.id);
        const tags = tagsString ? tagsString.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];

        updateNote(noteId, locals.user.id, title, content, tags);

        return { success: true };
    },
    delete: async ({ locals, params }) => {
        if (!locals.user) {
            throw redirect(302, '/login');
        }

        const noteId = parseInt(params.id);
        deleteNote(noteId, locals.user.id);

        throw redirect(303, '/');
    }
};
