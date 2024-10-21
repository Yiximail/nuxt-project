import {
  defineNuxtPlugin,
  useAppConfig,
  useRuntimeConfig,
  updateAppConfig,
  computed,
  watch,
  useHead
} from "#imports"
import { updateUi } from "../ui"
import twcolors from "#tailwind-config/theme/colors"

import hex2rgb from "../utils/hex-to-rgb"

export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig()
  const runtimeConfig = useRuntimeConfig()
  const config = runtimeConfig.public.ui

  if (config?.ui) updateUi(config.ui, config.strategy)

  const colorsConfig = computed(() => {
    if (import.meta.server) return
    let primary = config.watchTheme
      ? (appConfig.ui?.primary ?? "blue")
      : (config?.primary ?? "blue")
    let success = config.watchTheme
      ? (appConfig.ui?.success ?? "green")
      : (config?.success ?? "green")
    let warning = config.watchTheme
      ? (appConfig.ui?.warning ?? "yellow")
      : (config?.warning ?? "yellow")
    let danger = config.watchTheme
      ? (appConfig.ui?.danger ?? "red")
      : (config?.danger ?? "red")
    let natural = config.watchTheme
      ? (appConfig.ui?.natural ?? "slate")
      : (config?.natural ?? "slate")
    if (!Reflect.has(twcolors, primary)) {
      console.warn(`primary color "${primary}" not found in tailwind config`)
      primary = config?.primary ?? "blue"
    }
    if (!Reflect.has(twcolors, success)) {
      console.warn(`success color "${success}" not found in tailwind config`)
      success = config?.success ?? "green"
    }
    if (!Reflect.has(twcolors, warning)) {
      console.warn(`warning color "${warning}" not found in tailwind config`)
      warning = config?.warning ?? "yellow"
    }
    if (!Reflect.has(twcolors, danger)) {
      console.warn(`danger color "${danger}" not found in tailwind config`)
      danger = config?.danger ?? "red"
    }
    if (!Reflect.has(twcolors, natural)) {
      console.warn(`natural color "${natural}" not found in tailwind config`)
      natural = config?.natural ?? "slate"
    }
    const primaryColor = Reflect.get(twcolors, primary) as
      | Record<string, string>
      | undefined
    const successColor = Reflect.get(twcolors, success) as
      | Record<string, string>
      | undefined
    const warningColor = Reflect.get(twcolors, warning) as
      | Record<string, string>
      | undefined
    const dangerColor = Reflect.get(twcolors, danger) as
      | Record<string, string>
      | undefined
    const naturalColor = Reflect.get(twcolors, natural) as
      | Record<string, string>
      | undefined
    let colors = [
      "primary",
      "success",
      "warning",
      "danger",
      "natural",
      ...(config.colors ?? [])
    ]
    colors = Array.from(new Set(colors))
    return {
      primary,
      primaryColor,
      natural,
      naturalColor,
      success,
      successColor,
      warning,
      warningColor,
      danger,
      dangerColor,
      colors
    }
  })
  const colorStyle = computed(() => {
    if (!colorsConfig.value) return ""
    const { primaryColor, successColor, warningColor, dangerColor, naturalColor } =
      colorsConfig.value
    if (!primaryColor || !naturalColor) return ""
    const lines: string[] = []
    lines.push(":root {")
    for (const key in primaryColor) {
      const value = hex2rgb(primaryColor[key])
      lines.push(`  --color-primary-${key}: ${value};`)
    }
    lines.push("  --color-primary-DEFAULT: var(--color-primary-500);")
    for (const key in successColor) {
      const value = hex2rgb(successColor[key])
      lines.push(`  --color-success-${key}: ${value};`)
    }
    lines.push("  --color-success-DEFAULT: var(--color-success-500);")
    for (const key in warningColor) {
      const value = hex2rgb(warningColor[key])
      lines.push(`  --color-warning-${key}: ${value};`)
    }
    lines.push("  --color-warning-DEFAULT: var(--color-warning-500);")
    for (const key in dangerColor) {
      const value = hex2rgb(dangerColor[key])
      lines.push(`  --color-danger-${key}: ${value};`)
    }
    lines.push("  --color-danger-DEFAULT: var(--color-danger-500);")
    for (const key in naturalColor) {
      const value = hex2rgb(naturalColor[key])
      lines.push(`  --color-natural-${key}: ${value};`)
    }
    lines.push("  --color-natural-DEFAULT: var(--color-natural-500);")
    lines.push("}")

    lines.push(".dark {")
    lines.push("  --color-primary-DEFAULT: var(--color-primary-400);")
    lines.push("  --color-success-DEFAULT: var(--color-success-400);")
    lines.push("  --color-warning-DEFAULT: var(--color-warning-400);")
    lines.push("  --color-danger-DEFAULT: var(--color-danger-400);")
    lines.push("  --color-natural-DEFAULT: var(--color-natural-400);")
    lines.push("}")

    return lines.join("\n")
  })

  if (import.meta.client) {
    const storage = window.localStorage.getItem("ui-colors-config")
    if (storage) {
      try {
        const { primary, success, warning, danger, natural, rootStyle, colors } =
          JSON.parse(storage)
        if (config.watchTheme) {
          updateAppConfig({
            ui: { primary, success, warning, danger, natural, colors }
          })
        } else {
          updateAppConfig({
            ui: {
              primary: config.primary,
              success: config.success,
              warning: config.warning,
              danger: config.danger,
              natural: config.natural,
              colors: [
                "primary",
                "success",
                "warning",
                "danger",
                "natural",
                ...(config.colors ?? [])
              ]
            }
          })
        }
        const uiColors = document.querySelector("#ui-root-colors")
        if (uiColors) uiColors.innerHTML = rootStyle
      } catch {}
    }
    watch(
      colorStyle,
      (val) => {
        if (!val) return
        window.localStorage.setItem(
          "ui-colors-config",
          JSON.stringify({
            primary: colorsConfig.value?.primary,
            success: colorsConfig.value?.success,
            warning: colorsConfig.value?.warning,
            danger: colorsConfig.value?.danger,
            natural: colorsConfig.value?.natural,
            colors: colorsConfig.value?.colors,
            rootStyle: val
          })
        )
      },
      { immediate: true }
    )
    useHead({
      style: [
        {
          innerHTML: () => colorStyle.value,
          id: "ui-root-colors"
        }
      ]
    })
  }
  if (import.meta.server) {
    useHead({
      style: [
        {
          innerHTML: "",
          id: "ui-root-colors"
        }
      ],
      script: [
        {
          innerHTML: `try {
      const { rootStyle } = JSON.parse(window.localStorage.getItem('ui-colors-config'))
      const uiColors = document.querySelector('#ui-root-colors')
      if (uiColors) uiColors.innerHTML = rootStyle
    } catch {}`,
          type: "text/javascript"
        }
      ]
    })
  }
})
