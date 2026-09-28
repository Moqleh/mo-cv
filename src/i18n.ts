import{useEffect}from'react';
export type UiLocale='ar'|'en';
export const getUiLocale=():UiLocale=>localStorage.getItem('mocv.locale')==='en'?'en':'ar';
export const setUiLocale=(v:UiLocale)=>localStorage.setItem('mocv.locale',v);
export const uiText=(ar:string,en:string,locale:UiLocale)=>locale==='ar'?ar:en;

/**
 * Legacy compatibility hook.
 * UI copy is rendered explicitly by React components now; this hook only keeps
 * the document language/direction synchronized and intentionally never mutates DOM text.
 */
export function usePageTranslation(locale:UiLocale){
 useEffect(()=>{
  document.documentElement.lang=locale;
  document.documentElement.dir=locale==='ar'?'rtl':'ltr';
 },[locale]);
}
