import '$lib/i18n' // Import to initialize. Important :)
import type { LayoutServerLoad } from './$types'
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ locals }) => {
  const { user, session } = locals

  if (user === null) {
    redirect(302, "/")
  }

  return { user }
}
