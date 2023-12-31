export enum TrackingEvent {
  NAV_MENU = 'Navigation menu',
  GET_A_QUOTE_LINK = 'Get a quote link',
  CTA_CLICK = 'CTA click',
  HOME_REEL = 'Home showreel play',
  HOME_HIGHLIGHT = 'Home highlight',
  PROJECT_CLICK = 'Project click',
  PROJECT_CAROUSEL = 'Project carousel interaction',
  PROJECT_FILTER_CLICK = 'Project filter click',
  PROJECT_AUTHOR_PAGE_CLICK = 'Project author page click',
  AUTHOR_PAGE_TAB_INTERACTION = 'Author Page tab interaction',
  CAREERS_INTERACT_WITH_CANVAS = 'Careers interaction with canvas',
  CAREERS_SPONTANEOUS_APPLICATION = 'Careers spontaneous application click',
  CAREERS_CANVAS_PLAYED_TIC_TAC_TOE = 'Careers canvas played tictactoe',
  CAREERS_CANVAS_FLIPPED_TAROT = 'Careers canvas flipped a tarot card',
  CAREERS_CANVAS_GROW_PLANT = 'Careers canvas grew a plant',
  CAREERS_CANVAS_EGG_FRY = 'Careers canvas fried an egg',
  CAREERS_CANVAS_EGG_HATCH = 'Careers canvas hatched an egg',
  CAREERS_CANVAS_EGGMANDMENDS = 'Careers canvas checked all Eggmandmends',
  DRAW_YOUR_SEGG_INTERACT = 'Draw your segg interaction',
  DRAW_YOUR_SEGG_COPY = 'Draw your segg copy url',
  DRAW_YOUR_SEGG_DOWNLOAD = 'Draw your segg download',
  CAREER_CLICK = 'Career click',
  BLOG_POST_CLICK = 'Blog post click',
  BLOG_POST_TAG_CLICK = 'Blog post tag click',
  BLOG_INDEX_LOAD_MORE = 'Blog index load more',
  BLOG_POST_AUTHOR_PAGE_CLICK = 'Blog post author page click',
  SERVICES_AWARD_CLICK = 'Services award click',
  DRAWER_EXPAND = 'Drawer expand',
  FORM_SUBMISSION = 'Form submission',
  FORM_CHOOSE_MAILTO = 'Form choose to mail',
  NOBITA_FOUND = '404 Nobita found'
}

type EventOptions = {
  props?: { path?: string; to?: string; context?: string; [k: string]: unknown };
  callback?: VoidFunction;
};

export type TrackingEventProps = { event: TrackingEvent; options?: EventOptions };

export function track(event: TrackingEvent, options?: EventOptions): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).plausible?.(event, options);
}
