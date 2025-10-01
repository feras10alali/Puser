// /+page.server.js
import { redirect, fail } from '@sveltejs/kit';

export async function load({ locals }) {
  if (!locals.pb.authStore.isValid) {
    throw redirect(303, '/form_login');
  }

  const user = locals.pb.authStore.model;
  
  // Allow both Puser (admin) and Fuser (worker) to access this page
  if (user.collectionName === 'Puser' || user.collectionName === 'Fuser') {
    return {
      user: user
    };
  }
  
  throw redirect(303, '/form_login');
}

export const actions = {
  submit: async ({ request, locals }) => {
    if (!locals.pb.authStore.isValid) {
      return fail(401, { error: 'غير مصرح' });
    }

    const data = await request.formData();
    const amount = data.get('amount');
    const date = data.get('date');
    const category = data.get('category');

    try {
      await locals.pb.collection('submits').create({
        amount: parseFloat(amount),
        date: date,
        category: category
      });

      return { success: true };
    } catch (error) {
      console.error('Submit error:', error);
      return fail(400, { 
        error: 'Failed to submit',
        details: error.message 
      });
    }
  }
};