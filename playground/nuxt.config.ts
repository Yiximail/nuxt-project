export default defineNuxtConfig({
  ssr: true,
  app: {
    pageTransition: { name: "page", mode: "out-in" }
  },
  image: {
    providers: {
      aliyun: {
        name: "aliyun",
        provider: "~/providers/aliyun.ts"
      }
    }
  },
  modules: ["../src/module", "@nuxt/image"],
  myModule: {
    prefix: "v",
    colors: ["red", "blue"],
    ui: {
      link: {}
    }
  },
  tailwindcss: {
    config: {
      safelist: []
    }
  },
  devtools: { enabled: true },
  compatibilityDate: "2024-07-09"
})
