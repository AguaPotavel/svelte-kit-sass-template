<script lang="ts">
  import "../app.pcss";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  import type { PageData } from "./$types";

  export let data: PageData;

  const user = writable();
  $: user.set(data.user);

  setContext("user", user);
</script>

<div class="flex flex-col min-h-dvh min-w-full bg-zinc-200">
  <main class="mt-24">
    <slot></slot>
  </main>

  <footer>
    {#if data.user}
      {data.user.email}
    {/if}
  </footer>
</div>
