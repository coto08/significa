<script lang="ts">
  import RichText from '$components/rich-text.svelte';
  import { drawerLinks } from '$lib/actions/drawer-links';
  import { intersectionObserver } from '@significa/svelte-ui/actions';
  import { t } from '$lib/i18n';
  import type { HandbookPage } from '$lib/storyblok';
  import { getImageAttributes } from '$lib/utils/cms';
  import { slugify } from '$lib/utils/paths';
  import { RichTextResolver, type ISbRichtext } from '@storyblok/js';
  import clsx from 'clsx';

  export let story: HandbookPage;

  // set headings from content
  const resolver = new RichTextResolver();

  type Heading = {
    content: string;
    location: undefined | 'in-viewport' | 'above-viewport';
    level: number;
  };

  let headings: Map<string, Heading> = new Map();

  $: ((story.content.body as ISbRichtext)?.content || []).forEach((section) => {
    if (section.type === 'heading' && section.content?.length && section.attrs?.level <= 3) {
      const content = resolver.render(section);
      const id = slugify(content);

      if (!headings.has(id)) {
        headings.set(id, { content, level: section.attrs.level, location: undefined });
      }
    }
  });

  // active heading
  // should be the first heading in the viewport OR the last heading above the viewport
  $: active =
    [...headings.entries()].find(([, { location }]) => location === 'in-viewport')?.[0] ||
    [...headings.entries()]
      .reverse()
      .find(([, { location }]) => location === 'above-viewport')?.[0];
</script>

<div class="flex items-start gap-4 @container">
  <div class="flex-1">
    <header class="container my-10 mx-auto max-w-2xl md:my-14 lg:my-20">
      <h1 class="text-5xl">{story.name}</h1>
      <p class="mt-4 max-w-2xl text-2xl">{story.content.intro}</p>
    </header>

    {#if story.content.cover?.filename}
      {@const { alt, src, width, height } = getImageAttributes(story.content.cover, {
        size: [1440, 0]
      })}
      <div class="container mx-auto mt-10 max-w-4xl">
        <img class="w-full rounded-lg" {src} {alt} {width} {height} />
      </div>
    {/if}

    <div class="container mx-auto max-w-2xl">
      {#if story.content.body}
        <div
          use:drawerLinks
          use:intersectionObserver={{
            querySelectorAll: 'h2[id], h3[id]',
            callback: (observers) => {
              observers.forEach((o) => {
                const heading = headings.get(o.target.id);

                if (!heading) return;

                if (o.isIntersecting) {
                  heading.location = 'in-viewport';
                } else if (o.boundingClientRect.top < 0) {
                  heading.location = 'above-viewport';
                }

                // reactivity
                headings = headings;
              });
            },
            options: { threshold: [1] }
          }}
        >
          <RichText
            class="my-10 md:my-14 lg:my-20"
            doc={story.content.body}
            getAttributes={(section) => {
              if (section.type === 'heading') {
                const heading = resolver.render(section);
                // add id to heading
                return { id: slugify(heading) };
              }

              return {};
            }}
          />
        </div>
      {/if}
    </div>
  </div>

  <aside class="sticky top-10 mt-10 mb-10 hidden h-auto w-56 @5xl:block">
    <h4 class="mb-4 text-xs uppercase tracking-wider text-foreground-secondary">
      {t('on-this-page')}
    </h4>
    {#each Array.from(headings.entries()) as [id, { content, level }]}
      <a
        href={'#' + id}
        class={clsx(
          'block border-l border-border py-1 px-3 text-sm',
          active === id
            ? 'border-l-2 border-foreground text-foreground'
            : 'text-foreground-secondary',
          level >= 3 ? 'pl-6' : 'pl-3'
        )}><span class={clsx('block', active === id && '-ml-px')}>{@html content}</span></a
      >
    {/each}
  </aside>
</div>