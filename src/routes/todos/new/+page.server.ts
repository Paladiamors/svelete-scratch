import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createTodo } from '$lib/server/todos';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      throw redirect(302, '/login');
    }

    const data = await request.formData();
    const title = data.get('title') as string;
    const content = data.get('content') as string;

    if (!title) {
      return fail(400, { missing: true });
    }

    const todoId = createTodo(locals.user.id, title, content);

    throw redirect(302, `/todos/${todoId}`);
  }
};
