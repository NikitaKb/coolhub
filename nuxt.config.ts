// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: true,
  app: {
    head: {
      script: [
        {
          innerHTML: `
            if (window.localStorage.getItem('auth')) {
              window.__NUXT__.state.auth = JSON.parse(window.localStorage.getItem('auth'))
            }
          `,
          type: 'text/javascript'
        }
      ]
    }
  }
})
