<script lang="ts">
  import type { RichtextTestimonialStoryblok } from '$types/bloks';
  import clsx from 'clsx';
  import Person from '$components/person.svelte';

  export let block: RichtextTestimonialStoryblok;
</script>

<div class={clsx('not-rich-text px-4 py-2 md:px-8 md:py-4 lg:px-16 lg:py-10', $$restProps.class)}>
  {#if block.testimonial}
    <p class="text-2xl/7 font-semibold">
      <span class="bg-border">&ldquo;{block.testimonial}&rdquo;</span>
    </p>
  {/if}
  <Person class="mt-6" name={block.name} position={block.position} photo={block?.photo} />
</div>
