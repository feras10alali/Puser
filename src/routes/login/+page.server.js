//login/+page.server.js
import { redirect, fail } from '@sveltejs/kit';

export async function load({ locals }) {
  // If already logged in, redirect to home
  if (locals.pb.authStore.isValid) {
    throw redirect(303, '/admin');
  }
  
  return {};
}

export const actions = {
  default: async ({ request, locals }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    if (!email || !password) {
      return fail(400, { 
        error: 'Please enter email and password',
        email 
      });
    }

    try {
      // Convert email to lowercase before authentication
      await locals.pb.collection('Puser').authWithPassword(email.toLowerCase(), password);
    } catch (error) {
      console.error('Login error:', error);
      return fail(400, { 
        error: 'Invalid email or password',
        email 
      });
    }

    throw redirect(303, '/admin');
  }
};