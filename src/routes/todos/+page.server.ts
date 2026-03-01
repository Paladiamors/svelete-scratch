import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getTodos, updateTodo, getTodo } from '$lib/server/todos';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  const filter = (url.searchParams.get('filter') as 'all' | 'done' | 'not_done') || 'all';
  const q = url.searchParams.get('q') || '';

  const todos = getTodos(locals.user.id, filter, q);

  return {
    todos,
    filter,
    q
  };
};

export const actions: Actions = {
  toggle: async ({ request, locals }) => {
    if (!locals.user) {
      throw redirect(302, '/login');
    }

    const data = await request.formData();
    const id = Number(data.get('id'));

    if (id) {
      const todo = getTodo(id, locals.user.id);
      if (todo) {
        updateTodo(id, locals.user.id, todo.title, todo.content, todo.is_done ? 0 : 1);
      }
    }
  }
};
