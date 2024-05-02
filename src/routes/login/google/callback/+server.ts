import { redirect } from "@sveltejs/kit";
import { google, lucia } from "$lib/server/auth";
import type { RequestEvent } from "@sveltejs/kit";
import { findOrCreate } from "$lib/db/user";

export async function GET(event: RequestEvent): Promise<Response> {
  const url = event.url
  const state = url.searchParams.get("state")
  const code = url.searchParams.get("code")

  const codeVerifier = event.cookies.get("codeVerifier")
  const storedState = event.cookies.get("google_auth_state")

  if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
    redirect(302, "/login")
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    })

    const user = await response.json()

    // insert user in db
    const userDb = await findOrCreate({ email: user.email, verified: user.email_verified })

    if (userDb === null) throw new Error("Cannot can create user");

    const session = await lucia.createSession(userDb.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    })

  } catch (e) {
    console.log(e)
  }

  redirect(302, "/")
}
