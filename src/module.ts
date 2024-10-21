import {
  addImports,
  addPlugin,
  defineNuxtModule,
  updateRuntimeConfig,
  addComponentsDir,
  createResolver,
  installModule
} from "@nuxt/kit"
import useTailwindcss from "./tailwindcss"

import type { ModuleAppConfig, ModuleOptions } from "./types"

declare module "nuxt/schema" {
  interface CustomAppConfig {
    ui?: ModuleAppConfig
  }
  interface PublicRuntimeConfig {
    ui: ModuleOptions
  }
}
declare module "@nuxt/schema" {
  interface CustomAppConfig {
    ui?: ModuleAppConfig
  }
  interface PublicRuntimeConfig {
    ui: ModuleOptions
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "my-module",
    configKey: "myModule"
  },
  defaults: {
    prefix: "v",
    primary: "blue",
    success: "green",
    warning: "yellow",
    danger: "red",
    natural: "slate",
    watchTheme: false,
    colors: [],
    strategy: "merge"
  },
  async setup (_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    _nuxt.options.build.transpile.push("@floating-ui/dom")

    addPlugin({
      src: resolver.resolve("./runtime/plugins/ui")
    })
    updateRuntimeConfig({ public: { ui: _options } })

    await installModule("@nuxt/image")
    await installModule("@nuxtjs/color-mode", { classSuffix: "" })
    await useTailwindcss(_options, _nuxt, resolver)

    addComponentsDir({
      path: resolver.resolve("./runtime/components"),
      pattern: "**/*.vue",
      prefix: _options.prefix
    })

    _nuxt.options.css.push(resolver.resolve("./runtime/assets/css/main.css"))
    _nuxt.options.css.push("quill/dist/quill.snow.css")

    addPlugin({
      src: resolver.resolve("./runtime/plugins/loading")
    })
    addImports({
      name: "default",
      as: "$message",
      from: resolver.resolve("./runtime/utils/message")
    })
    addImports({
      name: "default",
      as: "$dialog",
      from: resolver.resolve("./runtime/utils/dialog")
    })
    addImports({
      name: "default",
      as: "$notification",
      from: resolver.resolve("./runtime/utils/notification")
    })

    _nuxt.options.alias["#ui"] = resolver.resolve("./runtime/types/index")
  }
})
