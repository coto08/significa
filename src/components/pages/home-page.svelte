<script lang="ts">
  import BlogEntry from '$components/blog-entry.svelte';
  import ProjectEntry from '$components/project-entry.svelte';
  import Slogan from '$components/slogan.svelte';
  import { VIDEO_EXTENSIONS } from '$lib/constants';
  import type { BlogPostPage } from '$lib/content';
  import { getFileExtension } from '$lib/utils/strings';
  import type { HomePageStoryblok } from '$types/bloks';
  import SmallHighlights from './home/small-highlights.svelte';
  import Reel from './home/reel.svelte';
  import clsx from 'clsx';
  import HomeAbout from './home/home-about.svelte';
  import { getImageAttributes } from '$lib/utils/cms';
  import Person from '$components/person.svelte';
  import { page } from '$app/stores';
  import { Button, Icon } from '@significa/svelte-ui';
  import { t } from '$lib/i18n';
  import Seo from '$components/seo.svelte';
  import { afterNavigate } from '$app/navigation';
  import { browser } from '$app/environment';
  import { theme } from '$lib/stores/theme';

  export let data: HomePageStoryblok;
  export let posts: BlogPostPage[] | undefined;

  let show = false;

  afterNavigate(() => {
    if (window.scrollY > 500) {
      show = true;
    }
  });
</script>

<Seo />
<div class="container mx-auto px-container">
  <Slogan
    animate
    on:end={() => (show = true)}
    as="h1"
    class="mt-10 text-7xl font-bold md:mt-14 lg:mt-20"
  />
</div>

<div
  class={clsx(
    'transition-all duration-700 ease-motion',
    show ? 'opacity-1 translate-y-0' : 'translate-y-10 opacity-0'
  )}
>
  <div class="container mx-auto px-container">
    <section class="mt-10 md:mt-14 lg:mt-20">
      <SmallHighlights highlights={data.small_highlights} />
    </section>
    {#if data.showreel?.filename && VIDEO_EXTENSIONS.includes(getFileExtension(data.showreel.filename))}
      <Reel src={data.showreel.filename} play_label={data.showreel_button_label} />
    {/if}
  </div>

  <section class="mt-10 md:mt-14 lg:mt-20">
    <div class="container mx-auto px-container">
      <h2 class="text-5xl text-foreground-secondary">{data.work_title}</h2>
    </div>
    <div class="mt-4 md:mt-6 lg:mt-8">
      {#each data.projects || [] as project}
        <ProjectEntry {project} />
      {/each}
    </div>
  </section>

  <section class="border-b">
    <HomeAbout {data} />
  </section>

  <section class="container mx-auto mt-10 px-container md:mt-14 lg:mt-20">
    <h2 class="text-5xl text-foreground-secondary">{data.testimonials_title1}</h2>
    <p class="text-5xl">{data.testimonials_title2}</p>

    <div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {#if data.testimonials_image?.filename}
        {@const { src, alt, width, height } = getImageAttributes(data.testimonials_image, {
          size: [1200, 0]
        })}
        <img class="w-full rounded-lg md:col-span-2" {src} {alt} {width} {height} />
      {/if}
      {#each data.testimonials || [] as testimonial}
        <div class="flex flex-col rounded-lg border p-6">
          <div class="flex-1">
            <span class="text-5xl text-foreground-tertiary">&ldquo;</span>
            <p class="text-2xl/tight font-medium">{testimonial.testimonial}</p>
          </div>
          <Person
            class="mt-8"
            name={testimonial.name}
            position={testimonial.position}
            photo={testimonial.photo}
          />
        </div>
      {/each}
    </div>
  </section>

  <section class="mt-10 md:mt-14 lg:mt-20">
    <div class="container mx-auto px-container">
      <h2 class="text-5xl text-foreground-secondary">{data.blog_title1}</h2>
      <p class="text-5xl">{data.blog_title2}</p>
    </div>
    <div class="mt-4 md:mt-6 lg:mt-8">
      {#each posts || [] as post}
        <BlogEntry {post} />
      {/each}
    </div>
  </section>

  {#if $page.data.careers.length}
    <section class="mt-10 md:mt-14 lg:mt-20">
      <div class="container mx-auto justify-between gap-12 px-container lg:flex">
        <div class="flex flex-1 flex-col items-start">
          <div class="w-full flex-1">
            <h2 class="text-5xl">Careers</h2>
            <ul class="mt-10">
              {#each $page.data.careers as career}
                <li class="border-b first:border-t">
                  <a
                    class="flex w-full items-center justify-between py-4 text-xl transition-colors hover:text-foreground-secondary"
                    href={career.full_slug}
                  >
                    <span>{career.name}</span>
                    <Icon class="text-foreground-tertiary" icon="arrow-right" />
                  </a>
                </li>
              {/each}
            </ul>
          </div>
          <Button as="a" href="/careers" class="mt-10" variant="secondary" arrow
            >{data.careers_button_label}</Button
          >
        </div>
        <aside
          data-theme={browser ? ($theme === 'light' ? 'dark' : 'light') : 'light'}
          class="mt-10 flex flex-col items-start justify-between rounded-lg p-8 lg:mt-0 lg:min-h-[500px] lg:max-w-md"
        >
          <div class="flex-1">
            <h3 class="text-4xl">{data.handbook_title}</h3>
            <p class="mt-4 text-xl text-foreground-secondary">{data.handbook_description}</p>
          </div>
          <Button variant="secondary" as="a" href="/handbook" class="mt-10" icon="handbook" arrow
            >{t('handbook')}</Button
          >
        </aside>
      </div>
    </section>
  {/if}
</div>