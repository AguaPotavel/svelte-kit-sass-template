import { Lucia } from "lucia";
import { dev } from "$app/environment";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Google } from "arctic";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private"
import { prismaClient } from "$lib/db";

const adapter = new PrismaAdapter(prismaClient.session, prismaClient.user); // your adapter

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using https
      secure: !dev
    },
  },
  getUserAttributes: (attributes: DatabaseUserAttributes) => {
    return {
      id: attributes.id,
      email: attributes.email,
    }
  }
});

export const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, "http://localhost:5173/login/google/callback");

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  email: string
  id: string
}
