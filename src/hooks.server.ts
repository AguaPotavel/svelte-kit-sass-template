import { lucia } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";
import { locale } from 'svelte-i18n'

export const handle: Handle = async ({ event, resolve }) => {
  // get session id 
  const sessionId = event.cookies.get(lucia.sessionCookieName);

  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    // sveltekit types deviates from the de-facto standard
    // you can use 'as any' too
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });
  }
  event.locals.user = user;
  event.locals.session = session;

  // get locale
  const lang = event.request.headers.get('accept-language')?.split(',')[0]
  if (lang) {
    locale.set(lang)
  }
  return resolve(event);


};
