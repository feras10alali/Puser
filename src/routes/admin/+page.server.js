//admin/+page.server.js
import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
  // Check if user is authenticated
  if (!locals.pb.authStore.isValid) {
    throw redirect(303, '/login');
  }

  // Check if user is in Puser collection
  const user = locals.pb.authStore.model;
  if (!user || user.collectionName !== 'Puser') {
    throw redirect(303, '/unauthorized');
  }

  // Get date range from URL params
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');

  try {
    // Build date filter
    let dateFilter = '';
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      dateFilter = `date >= "${start.toISOString()}" && date <= "${end.toISOString()}"`;
    } else if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      dateFilter = `date >= "${start.toISOString()}"`;
    } else if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter = `date <= "${end.toISOString()}"`;
    }

    // Fetch records from submits collection with filter
    const records = await locals.pb.collection('submits').getList(1, 50, {
      sort: '-date',
      filter: dateFilter
    });

    return {
      records: records.items,
      user: user,
      startDate: startDate,
      endDate: endDate
    };
  } catch (error) {
    console.error('Error fetching records:', error);
    return {
      records: [],
      user: user,
      startDate: startDate,
      endDate: endDate
    };
  }
}

export const actions = {
  logout: async ({ locals }) => {
    locals.pb.authStore.clear();
    throw redirect(303, '/login');
  }
};