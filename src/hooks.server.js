// src/hooks.server.js
import PocketBase from 'pocketbase';

export async function handle({ event, resolve }) {
  // Initialize PocketBase instance
  event.locals.pb = new PocketBase('https://nuts-plant.pockethost.io/'); // Replace with your PocketBase URL
  
  // Load auth store from cookie
  event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

  try {
    // Refresh authentication if valid
    if (event.locals.pb.authStore.isValid) {
      await event.locals.pb.collection('Puser').authRefresh();
    }
  } catch (_) {
    // Clear auth store if refresh fails
    event.locals.pb.authStore.clear();
  }

  const response = await resolve(event);

  // Send back the auth cookie
  response.headers.append(
    'set-cookie',
    event.locals.pb.authStore.exportToCookie({ 
      secure: true, // Set to true in production with HTTPS
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    })
  );

  return response;
}

// Optional: Add user to locals for easy access
export function handleFetch({ request, fetch }) {
  // Clone the request
  const url = new URL(request.url);
  
  // If it's an API request to PocketBase, handle it
  if (url.origin === 'https://nuts-plant.pockethost.io/') { // Replace with your PocketBase URL
    return fetch(request);
  }

  return fetch(request);
}