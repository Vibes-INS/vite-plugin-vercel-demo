export function onBeforeRender() {
  return {
    pageContext: {
      pageProps: {
        d: String(new Date()),
      },
    },
  };
}

export async function prerender() {
  return ['/function/a'];
}
