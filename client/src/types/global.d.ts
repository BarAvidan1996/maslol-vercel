declare module 'stylis-plugin-rtl' {
  const rtlPlugin: any;
  export default rtlPlugin;
}

declare module '@emotion/cache' {
  import { EmotionCache } from '@emotion/utils';
  export default function createCache(options: any): EmotionCache;
}
