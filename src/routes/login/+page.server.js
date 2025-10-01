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
        error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور',
        email 
      });
    }

    try {
      await locals.pb.collection('Puser').authWithPassword(email, password);
    } catch (error) {
      console.error('Login error:', error);
      return fail(400, { 
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        email 
      });
    }

    throw redirect(303, '/admin');
  }
};
