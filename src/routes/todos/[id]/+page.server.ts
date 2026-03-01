import { redirect, fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getTodo, updateTodo, deleteTodo } from '$lib/server/todos';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  const id = Number(params.id);
  const todo = getTodo(id, locals.user.id);

  if (!todo) {
    throw error(404, 'Todo not found');
  }

  return { todo };
};

export const actions: Actions = {
  update: async ({ request, locals, params }) => {
    if (!locals.user) {
      throw redirect(302, '/login');
    }

    const data = await request.formData();
    const title = data.get('title') as string;
    const content = data.get('content') as string;
    const isDone = data.has('is_done') ? 1 : 0;
    const id = Number(params.id);

    if (!title) {
      return fail(400, { missing: true });
    }

    updateTodo(id, locals.user.id, title, content, isDone);

    throw redirect(302, '/todos');
  },
  delete: async ({ locals, params }) => {
    if (!locals.user) {
      throw redirect(302, '/login');
    }

    const id = Number(params.id);
    deleteTodo(id, locals.user.id);

    throw redirect(302, '/todos');
  }
};
