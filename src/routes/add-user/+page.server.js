import { redirect, fail } from '@sveltejs/kit';

export async function load({ locals }) {
  // Check if user is authenticated
  if (!locals.pb.authStore.isValid) {
    throw redirect(303, '/login');
  }

  // Check if user is in Puser collection (admin)
  const user = locals.pb.authStore.model;
  if (!user || user.collectionName !== 'Puser') {
    throw redirect(303, '/unauthorized');
  }

  return {
    user: user
  };
}

export const actions = {
  addUser: async ({ locals, request }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const passwordConfirm = formData.get('passwordConfirm');
    const name = formData.get('name');

    // Validation
    if (!email || !password || !passwordConfirm) {
      return fail(400, { 
        error: 'جميع الحقول مطلوبة',
        email,
        name
      });
    }

    if (password !== passwordConfirm) {
      return fail(400, { 
        error: 'كلمات المرور غير متطابقة',
        email,
        name
      });
    }

    if (password.length < 8) {
      return fail(400, { 
        error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
        email,
        name
      });
    }

    try {
      // Create user in Fuser collection
      await locals.pb.collection('Fuser').create({
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
        name: name || email,
        emailVisibility: true
      });

      return { success: true, message: 'تم إضافة المستخدم بنجاح' };
    } catch (error) {
      console.error('Error creating user:', error);
      return fail(400, { 
        error: error.message || 'حدث خطأ أثناء إضافة المستخدم',
        email,
        name
      });
    }
  }
};