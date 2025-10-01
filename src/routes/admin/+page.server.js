import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  // Check if user is authenticated
  if (!locals.pb.authStore.isValid) {
    throw redirect(303, '/login');
  }

  // Check if user is in Puser collection
  const user = locals.pb.authStore.model;
  if (!user || user.collectionName !== 'Puser') {
    throw redirect(303, '/unauthorized');
  }

  try {
    // Fetch records from submits collection
    const records = await locals.pb.collection('submits').getList(1, 50, {
      sort: '-date'
    });

    return {
      records: records.items,
      user: user
    };
  } catch (error) {
    console.error('Error fetching records:', error);
    return {
      records: [],
      user: user
    };
  }
}

export const actions = {
  logout: async ({ locals }) => {
    locals.pb.authStore.clear();
    throw redirect(303, '/login');
  }
};

