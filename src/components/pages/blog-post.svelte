<script lang="ts">
  import { richTextBlockWidths } from '$lib/constants';
  import { getImageAttributes } from '$lib/utils/cms';
  import { formatDate } from '$lib/utils/dates';
  import { Button, Tag } from '@significa/svelte-ui';
  import RichText from '$components/rich-text.svelte';
  import { drawerLinks } from '$lib/actions/drawer-links';
  import Person from '$components/person.svelte';
  import BlogEntry from '$components/blog-entry.svelte';
  import { t } from '$lib/i18n';
  import TwoEggs from '$components/illustrations/two-eggs.svelte';
  import Seo from '$components/seo.svelte';
  import type { BlogPostPage } from '$lib/content';
  import { TrackingEvent, track } from '$lib/track';
  import { page } from '$app/stores';
  import { drawer } from '$lib/stores/drawer';

  export let story: BlogPostPage;
  export let related: BlogPostPage[];
</script>

<Seo
  title={story.content.seo_title || story.content.tagline}
  description={story.content.seo_description || story.content.intro}
  image={story.content.seo_og_image || story.content.cover}
/>
<div class="container mx-auto px-container">
  <header class="mx-auto mb-10 mt-10 max-w-2xl md:mt-14 lg:mt-20">
    {#if story.first_published_at}
      <p class="text-base font-medium text-foreground-secondary">
        {formatDate(new Date(story.first_published_at || story.published_at || story.created_at), {
          dateStyle: 'medium'
        })}
      </p>
    {/if}
    <h1 class="text-5xl">{story.name}</h1>
    {#if story.tag_list.length}
      <div class="mt-5 flex flex-wrap gap-2">
        {#each story.tag_list as tag}
          <Tag
            href="/blog?t={encodeURIComponent(tag)}"
            on:click={() => {
              track(TrackingEvent.BLOG_POST_TAG_CLICK, {
                props: { name: tag, path: $drawer || $page.url.pathname }
              });
            }}
            label={tag}
          />
        {/each}
      </div>
    {/if}
    {#if story.content.intro}
      <p class="mt-9 text-2xl font-medium">{story.content.intro}</p>
    {/if}
  </header>
  {#if story.content.cover?.filename}
    {@const { alt, src, width, height } = getImageAttributes(story.content.cover, {
      size: [1440, 0]
    })}
    <img class="mx-auto h-auto w-full max-w-6xl rounded-md" {src} {alt} {width} {height} />
  {/if}
  {#if story.content.body}
    <div use:drawerLinks>
      <RichText
        class="my-10 md:my-14 lg:my-20"
        doc={story.content.body}
        getAttributes={(_, block) => ({
          class: `mx-auto ${richTextBlockWidths[block?.width || 'narrow']}`
        })}
      />
    </div>
  {/if}

  <!-- Author -->
  {#if story.content.author?.id}
    {@const author = story.content.author}
    <div use:drawerLinks class="mx-auto mt-10 max-w-2xl border-b border-t py-8 md:mt-14 lg:mt-20">
      <Person name={author.name} position={author.content.position} photo={author.content.photo} />
      <p class="mt-6 text-xl text-foreground-secondary">{author.content.bio}</p>
      <Button
        variant="secondary"
        as="a"
        href={`/about/${author.slug}`}
        on:click={() =>
          track(TrackingEvent.BLOG_POST_AUTHOR_PAGE_CLICK, {
            props: { path: $drawer || $page.url.pathname, to: `/about/${author.slug}` }
          })}
        class="mt-6"
        arrow
        icon="document"
      >
        {t('author-page')}
      </Button>
    </div>
  {/if}
</div>

<div class="mx-auto px-container">
  <div class="relative mx-auto mt-20 max-w-2xl">
    <div data-theme="yellow" class="flex justify-between gap-8 rounded-3xl p-6 md:p-8">
      <div class="flex flex-col items-start">
        <div class="flex-1">
          <h4 class="max-w-md text-3xl font-bold">{t('blog.pre-footer.title')}</h4>
        </div>
        <Button
          class="mt-6"
          as="a"
          href="/get-a-quote"
          on:click={() => {
            track(TrackingEvent.GET_A_QUOTE_LINK, {
              props: { path: $drawer || $page.url.pathname, context: 'blog post' }
            });
          }}
          arrow
          icon="document">{t('blog.pre-footer.cta')}</Button
        >
      </div>
      <TwoEggs class="hidden w-60 sm:block" />
    </div>
  </div>
</div>

<!-- Related Posts -->
{#if related.length}
  <div class="mt-28">
    {#each related as post}
      <BlogEntry {post} />
    {/each}
  </div>
{/if}
