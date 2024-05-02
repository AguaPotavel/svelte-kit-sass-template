import { browser } from '$app/environment'
import '$lib/i18n' // Import to initialize. Important :)
import { locale, waitLocale } from 'svelte-i18n'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
  const { user, session } = locals

  console.log(user, session)

  if (browser) {
    locale.set(window.navigator.language)
  }

  await waitLocale()
  return { user }
}
