// src/routes/employees/+page.server.js
import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  // Check if user is authenticated
  if (!locals.pb.authStore.isValid) {
    throw redirect(303, '/login');
  }

  // Check if user is admin (Puser collection)
  const user = locals.pb.authStore.model;
  if (!user || user.collectionName !== 'Puser') {
    throw redirect(303, '/unauthorized');
  }

  try {
    // Fetch all employees (Fuser) from PocketBase
    const employees = await locals.pb.collection('Fuser').getFullList({
      sort: '-created',
    });

    return {
      employees: employees.map(emp => ({
        id: emp.id,
        name: emp.name,
        email: emp.email,
        created: emp.created,
        updated: emp.updated
      }))
    };
  } catch (error) {
    console.error('Error fetching employees:', error);
    return {
      employees: []
    };
  }
}

export const actions = {
  addUser: async ({ request, locals }) => {
    if (!locals.pb.authStore.isValid) {
      return fail(401, { error: 'Unauthorized' });
    }

    // Check if user is admin (Puser)
    const user = locals.pb.authStore.model;
    if (!user || user.collectionName !== 'Puser') {
      return fail(403, { error: 'Access denied. Admin privileges required.' });
    }

    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const passwordConfirm = formData.get('passwordConfirm');

    // Validation
    if (!name || !email || !password || !passwordConfirm) {
      return fail(400, { error: 'All fields are required' });
    }

    if (password.length < 8) {
      return fail(400, { error: 'Password must be at least 8 characters' });
    }

    if (password !== passwordConfirm) {
      return fail(400, { error: 'Passwords do not match' });
    }

    try {
      // Create new employee in Fuser collection
      await locals.pb.collection('Fuser').create({
        name,
        email: email.toLowerCase(),
        password,
        passwordConfirm,
        emailVisibility: true
      });

      return {
        success: true,
        message: 'Employee added successfully'
      };
    } catch (error) {
      console.error('Error adding employee:', error);
      
      // Handle specific PocketBase errors
      if (error.data?.data?.email) {
        return fail(400, { error: 'Email already exists' });
      }
      
      return fail(500, { 
        error: error.message || 'Failed to add employee' 
      });
    }
  },

  updateUser: async ({ request, locals }) => {
    if (!locals.pb.authStore.isValid) {
      return fail(401, { error: 'Unauthorized' });
    }

    // Check if user is admin (Puser)
    const user = locals.pb.authStore.model;
    if (!user || user.collectionName !== 'Puser') {
      return fail(403, { error: 'Access denied. Admin privileges required.' });
    }

    const formData = await request.formData();
    const userId = formData.get('userId');
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const passwordConfirm = formData.get('passwordConfirm');

    // Validation
    if (!userId || !name || !email) {
      return fail(400, { error: 'Name and email are required' });
    }

    try {
      const updateData = {
        name,
        email
      };

      // Only update password if provided
      if (password && password.trim() !== '') {
        if (password.length < 8) {
          return fail(400, { error: 'Password must be at least 8 characters' });
        }

        if (password !== passwordConfirm) {
          return fail(400, { error: 'Passwords do not match' });
        }

        updateData.password = password;
        updateData.passwordConfirm = passwordConfirm;
      }

      // Update employee in Fuser collection
      await locals.pb.collection('Fuser').update(userId, updateData);

      return {
        success: true,
        message: 'Employee updated successfully'
      };
    } catch (error) {
      console.error('Error updating employee:', error);
      
      if (error.data?.data?.email) {
        return fail(400, { error: 'Email already exists' });
      }
      
      return fail(500, { 
        error: error.message || 'Failed to update employee' 
      });
    }
  },

  deleteUser: async ({ request, locals }) => {
    if (!locals.pb.authStore.isValid) {
      return fail(401, { error: 'Unauthorized' });
    }

    // Check if user is admin (Puser)
    const user = locals.pb.authStore.model;
    if (!user || user.collectionName !== 'Puser') {
      return fail(403, { error: 'Access denied. Admin privileges required.' });
    }

    const formData = await request.formData();
    const userId = formData.get('userId');

    if (!userId) {
      return fail(400, { error: 'User ID is required' });
    }

    try {
      // Delete employee from Fuser collection
      await locals.pb.collection('Fuser').delete(userId);

      return {
        success: true,
        message: 'Employee deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting employee:', error);
      return fail(500, { 
        error: error.message || 'Failed to delete employee' 
      });
    }
  }
};