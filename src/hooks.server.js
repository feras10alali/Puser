// src/hooks.server.js
import PocketBase from 'pocketbase';

export async function handle({ event, resolve }) {
  // Initialize PocketBase instance
  event.locals.pb = new PocketBase('https://nuts-plant.pockethost.io/');
  
  // Load auth store from cookie
  event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

  try {
    // Refresh authentication if valid
    if (event.locals.pb.authStore.isValid && event.locals.pb.authStore.model) {
      // Get the user's collection name
      const collectionName = event.locals.pb.authStore.model.collectionName;
      
      if (collectionName === 'Puser' || collectionName === 'Fuser') {
        // Only refresh if the token is about to expire (within 5 minutes)
        const token = event.locals.pb.authStore.token;
        if (token) {
          // Decode JWT to check expiration
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expiresIn = payload.exp * 1000 - Date.now();
          
          // Refresh only if less than 5 minutes remaining
          if (expiresIn < 5 * 60 * 1000) {
            await event.locals.pb.collection(collectionName).authRefresh();
          }
        }
      }
    }
  } catch (error) {
    // Only clear on specific auth errors, not network errors
    if (error.status === 401 || error.status === 403) {
      event.locals.pb.authStore.clear();
    }
    console.error('Auth refresh error:', error);
  }

  const response = await resolve(event);

  // Send back the auth cookie
  response.headers.append(
    'set-cookie',
    event.locals.pb.authStore.exportToCookie({ 
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
  );

  return response;
}