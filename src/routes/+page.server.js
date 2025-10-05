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
      return fail(401, { error: 'unauthrized' });
    }

    const user = locals.pb.authStore.model;

    // Ensure only Fuser can submit (not Puser admin)
    if (user.collectionName !== 'Fuser') {
      return fail(403, { error: 'Only employees can submit' });
    }

    const data = await request.formData();
    const amount = data.get('amount');
    const date = data.get('date');
    const category = data.get('category');

    try {
      // Create submission with the logged-in user's ID in the added_by field
      await locals.pb.collection('submits').create({
        amount: parseFloat(amount),
        date: date,
        category: category,
        added_by: user.id  // Automatically set the relation to current user
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