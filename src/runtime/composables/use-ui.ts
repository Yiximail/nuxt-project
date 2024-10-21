import { useRuntimeConfig } from "#imports"
import { unref, toRef, computed } from "vue"
import _ui, { getUi } from "../ui"
import uiMerge from "../utils/ui-merge"

import type { DeepPartial } from "../types"
import type { MaybeRef, ComputedRef } from "vue"

import type { ModuleOptions } from "../../types"

const replaceParams = <T extends Record<string, unknown>>(
  target: T,
  params = {} as Record<string, MaybeRef<string>>
): T => {
  for (const key in target) {
    if (typeof target[key] === "string") {
      let str = target[key] as string
      for (const key in params) {
        const val = unref(params[key])
        str = str.replace(new RegExp(`\\{${key}\\}`, "g"), val)
      }
      Reflect.set(target, key, str)
    } else if (typeof target[key] === "object") {
      replaceParams(target[key] as Record<string, unknown>, params)
    }
  }
  return target
}

const useUi = <K extends keyof typeof _ui>(
  key: K,
  props: { ui?: DeepPartial<(typeof _ui)[K]> },
  params?: Record<string, MaybeRef<string> | ComputedRef<string>>
): { config: ModuleOptions; ui: ComputedRef<(typeof _ui)[K]> } => {
  const runtimeConfig = useRuntimeConfig()
  const config = runtimeConfig.public.ui as ModuleOptions

  const propUi = toRef(props, "ui")
  const ui = computed(() => {
    const _ui = getUi()
    const ui = uiMerge<(typeof _ui)[K]>(_ui[key], propUi.value, config.strategy)
    if (!params) return ui
    const result = replaceParams(ui, params)
    return result
  })
  return { config, ui }
}

export default useUi
