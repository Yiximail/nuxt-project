import { SELECT_OPTIONS_INJECTION } from "../utils/injection-keys"
import { computed, provide, toRef, ref } from "vue"

import type { ComponentSlot, SelectOption } from "../types"

export default (
  props: {
    /** 选项 */
    options: SelectOption[]
    /** 额外的选项，仅用于匹配value值 */
    extraOptions: SelectOption[]
    /** 判断值 */
    keyName: string
    /** 显示名 */
    labelName: string
  },
  slots: {
    option?: (props: { option: SelectOption }) => ComponentSlot
    prepend?: (props: { option: SelectOption }) => ComponentSlot
    label?: (props: { option: SelectOption }) => ComponentSlot
    append?: (props: { option: SelectOption }) => ComponentSlot
  }
) => {
  const injectOptions = ref<SelectOption[]>([])
  const indexOfInjectOption = (option: SelectOption) => {
    const value = option.value
    if (value === null || typeof value !== "object") {
      return injectOptions.value.indexOf(option)
    } else {
      const obj = value as Record<string, unknown>
      const key = obj[props.keyName]
      return injectOptions.value.findIndex((item) => {
        if (item.value === null) return false
        if (typeof item.value !== "object") return false
        const itemObj = item.value as Record<string, unknown>
        return itemObj[props.keyName] === key
      })
    }
  }
  const addOption = (option: SelectOption) => {
    if (indexOfInjectOption(option) > -1) {
      console.warn("[v-select] 选项已存在:", option)
      return
    }
    injectOptions.value.push(option)
  }
  const removeOption = (option: SelectOption) => {
    const index = indexOfInjectOption(option)
    if (index > -1) injectOptions.value.splice(index, 1)
  }

  const optionList = computed(() => props.options.concat(injectOptions.value))
  const referenceList = computed(() =>
    props.options.concat(injectOptions.value).concat(props.extraOptions)
  )
  const referenceMap = computed(() => {
    const map = new Map()
    for (const option of referenceList.value) {
      map.set(option.value, option)
    }
    return map
  })

  provide(SELECT_OPTIONS_INJECTION, {
    options: optionList,
    keyName: toRef(props, "keyName"),
    labelName: toRef(props, "labelName"),
    addOption,
    removeOption,
    slots
  })

  return { optionList, referenceList, referenceMap }
}
