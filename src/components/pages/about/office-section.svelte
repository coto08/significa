<script lang="ts">
  import type { NotepadCardStoryblok, PhotoCardStoryblok } from '$types/bloks';
  import HoverableGallery from '$components/hoverable-gallery.svelte';

  export let cards: (NotepadCardStoryblok | PhotoCardStoryblok)[] | undefined = undefined;
  export let firstTitle: string | undefined = undefined;
  export let secondTitle: string | undefined = undefined;
  export let description: string | undefined = undefined;
</script>

<section class="overflow-hidden border-y">
  <div class="container mx-auto px-container pt-8 lg:pt-12">
    <div class="flex flex-col justify-between gap-7 lg:flex-row lg:gap-4">
      <div class="lg:max-w-lg">
        <h2 class="text-5xl text-foreground-secondary">{firstTitle}</h2>
        <p class="text-5xl">{secondTitle}</p>
      </div>

      <p class="whitespace-pre-line text-2xl text-foreground-secondary lg:max-w-xl">
        {description}
      </p>
    </div>

    {#if !!cards?.length}
      <HoverableGallery {cards} class="mt-12 lg:-mt-10" />
    {/if}
  </div>
</section>
