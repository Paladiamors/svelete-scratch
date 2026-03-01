import { fail, redirect } from '@sveltejs/kit';
import { createUser } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    if (!username || !password) {
      return fail(400, { missing: true });
    }

    const user = createUser(username.toString(), password.toString());

    if (!user) {
      return fail(400, { userExists: true });
    }

    throw redirect(303, '/login');
  }
} satisfies Actions;
