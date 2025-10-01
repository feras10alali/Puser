import { redirect, fail } from '@sveltejs/kit';

export async function load({ locals }) {
  // Check if user is authenticated
  if (!locals.pb.authStore.isValid) {
    throw redirect(303, '/form_login');
  }

  // Check if user is in Puser collection (admin)
  const user = locals.pb.authStore.model;
  if (user.collectionName !== 'Fuser' ||!user || user.collectionName !== 'Puser') {
    throw redirect(303, '/form_login');
  }

  return {
    user: user
  };
}