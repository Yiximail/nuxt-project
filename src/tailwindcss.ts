import {
  addTemplate,
  addTypeTemplate,
  createResolver,
  installModule,
  useNuxt
} from "@nuxt/kit"

import type { ModuleOptions as TwOptions } from "@nuxtjs/tailwindcss"
import type { ModuleOptions } from "./types"

const variableColors = ["primary", "success", "warning", "danger", "natural"] as const
const variableKeys = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
  "DEFAULT"
] as const
const getVariableColors = () => {
  const result: Record<string, Record<string, string>> = {}
  for (const color of variableColors) {
    const variableColor: Record<string, string> = {}
    for (const key of variableKeys) {
      variableColor[key] = `rgb(var(--color-${color}-${key}) / <alpha-value>)`
    }
    result[color] = variableColor
  }
  return result
}

export default async (
  _options: ModuleOptions,
  _nuxt = useNuxt(),
  resolver = createResolver(import.meta.url)
) => {
  const configDir = resolver.resolve(_nuxt.options.buildDir, "ui.config")

  const colors: string[] = []
  if (_options.primary) colors.push("primary")
  if (_options.success) colors.push("success")
  if (_options.warning) colors.push("warning")
  if (_options.danger) colors.push("danger")
  if (_options.natural) colors.push("natural")
  if (_options.colors) colors.push(..._options.colors)

  /** tailwindcss的配置 */
  addTemplate({
    filename: "tailwind.config.mjs",
    write: true,
    dst: resolver.resolve(configDir, "tailwind.config.mjs"),
    getContents: () => `import plugin from "tailwindcss/plugin"
import getSafelist from ${JSON.stringify(resolver.resolve("./runtime/ui/get-safelist"))}

export default {
  darkMode: "selector",
  content: {
    files: [
      ${JSON.stringify(resolver.resolve(_nuxt.options.rootDir, "nuxt.config.{js,ts}"))},
      ${JSON.stringify(resolver.resolve("./runtime/**/*.{vue,js,ts}"))}
    ],
    transform: {
      ts: (content) => {
        // 这里避免匹配到ui中的变量值classname发出匹配错误的警告, 这里先替换, 然后交给safelist去匹配
        return content.replace(/\\{color\\}/g, "primary")
      }
    }
  },
  safelist: getSafelist(${JSON.stringify(colors)}),
  theme: {
    extend: {
      colors: ${JSON.stringify(getVariableColors())}
    }
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("is-active", "&:has([data-is-active=true])")
      addVariant("fieldset-active", ".v-fieldset:has([data-is-active=true]) &")

      addVariant("is-hover", ["&:hover", "&:has([data-is-hover=true])"])
      addVariant("fieldset-hover", [".v-fieldset:hover &", ".v-fieldset:has([data-is-hover=true]) &"])

      addVariant("is-focus", ["&:focus-within", "&:has([data-is-focus=true])"])
      addVariant("fieldset-focus", [".v-fieldset:focus-within &", ".v-fieldset:has([data-is-focus=true]) &"])

      addVariant("is-active-focus", ["&:has([data-is-active=true])", "&:focus-within", "&:has([data-is-focus=true])"])
      addVariant("fieldset-active-focus", [".v-fieldset:has([data-is-active=true]) &", ".v-fieldset:focus-within &", ".v-fieldset:has([data-is-focus=true]) &"])

      addVariant("is-disabled", "&:has([data-is-disabled=true]):not(:has([data-is-disabled=false]))")
      addVariant("fieldset-disabled", ".v-fieldset:has([data-is-disabled=true]):not(:has([data-is-disabled=false])) &")

      addVariant("is-success", "&:has([data-form-status=success])")
      addVariant("is-warning", "&:has([data-form-status=warning])")
      addVariant("is-error", "&:has([data-form-status=error])")
      addVariant("fieldset-success", [".v-fieldset:has([data-form-status=success]) &", ".v-form-item:has([data-form-status=success]) &"])
      addVariant("fieldset-warning", [".v-fieldset:has([data-form-status=warning]) &", ".v-form-item:has([data-form-status=warning]) &"])
      addVariant("fieldset-error", [".v-fieldset:has([data-form-status=error]) &", ".v-form-item:has([data-form-status=error]) &"])
    })
  ]
}`
  })
  addTemplate({
    filename: "colors.mjs",
    dst: resolver.resolve(configDir, "colors.mjs"),
    getContents: () => `export default ${JSON.stringify(colors)}`,
    write: true
  })
  addTypeTemplate({
    filename: "colors.d.ts",
    dst: resolver.resolve(configDir, "colors.d.ts"),
    getContents: () => `export default ${JSON.stringify(colors)} as const`,
    write: true
  })

  let configPath = [
    resolver.resolve(configDir, "tailwind.config.mjs"),
    resolver.resolve(_nuxt.options.rootDir, "tailwind.config")
  ]

  // eslint-disable-next-line
  // @ts-ignore-next-line
  const twOptions = _nuxt.options?.tailwindcss as TwOptions | undefined
  if (twOptions) {
    configPath = [
      ...(twOptions.configPath ?? []),
      ...configPath
    ]
    await installModule("@nuxtjs/tailwindcss", {
      ...twOptions,
      configPath,
      exposeConfig: true
    })
  } else {
    await installModule("@nuxtjs/tailwindcss", {
      exposeConfig: true,
      configPath
    })
  }
}
