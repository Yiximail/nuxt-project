import { CASCADER_OPTIONS_INJECTION } from "../utils/injection-keys"
import { ref, computed, toRef, provide } from "vue"

import type {
  ComponentSlot,
  CascaderItem,
  CascaderOption,
  CascaderValue
} from "../types"

export default (
  /** 是否为多选 */
  multiple: boolean,
  props: {
    /** 选项 */
    options: CascaderItem[]
    /** 判断值的key name */
    keyName: string
    /** 显示名的key name */
    labelName: string
    /** 子选项的key name */
    childrenName: string
    /** 是否能选择非最末级 */
    checkStrictly: boolean
    /** 显示最高级数 */
    maxlevel: number
    /** 筛选时显示最多数量 */
    maxFilterCount: number
  },
  slots: {
    option?: (props: { option: CascaderOption }) => ComponentSlot
    prepend?: (props: { option: CascaderOption }) => ComponentSlot
    label?: (props: { option: CascaderOption }) => ComponentSlot
    append?: (props: { option: CascaderOption }) => ComponentSlot
  }
) => {
  const activedList = ref<CascaderItem[]>([])
  const updateActivedList = (level: number, item: CascaderItem) => {
    const activedKey = activedList.value[level - 1]?.[props.keyName]
    const itemKey = item[props.keyName]
    if (activedKey === itemKey) return
    activedList.value.splice(level - 1, activedList.value.length, item)
  }

  const optionsList = computed(() => {
    const result: { key: CascaderValue; list: CascaderItem[] }[] = []
    // 第一级
    result.push({ key: "", list: props.options })
    // 选定级
    for (let i = 0; i < activedList.value.length; i++) {
      const activedOption = activedList.value[i]
      const activedKey = activedOption?.[props.keyName]
      if (!activedOption || !activedKey) break

      const list = activedOption?.[props.childrenName] as CascaderItem[]
      if (!list || !Array.isArray(list)) break

      result.push({ key: activedKey, list })
    }
    return result
  })

  const getFlatOptions = (
    list: CascaderItem[],
    path: CascaderItem[]
  ): CascaderOption[] => {
    const results: CascaderOption[] = []
    const stack: {
      list: CascaderItem[]
      path: CascaderItem[]
    }[] = [{ list, path }]
    while (stack.length) {
      const { list, path } = stack.pop()!
      for (let i = 0; i < list.length; i += 1) {
        const item = list[i]
        const itemPath = path.concat(item)
        if (!!props.maxlevel && itemPath.length > props.maxlevel) continue
        results.push({ item, path: itemPath })
        const children = item[props.childrenName]
        if (Array.isArray(children) && children.length > 0) {
          stack.push({ list: children, path: itemPath })
        }
      }
    }
    return results
  }

  const flatOptions = computed(() => {
    return getFlatOptions(props.options, [])
  })

  const flatOptionsMap = computed(() => {
    const map = new Map<CascaderValue, CascaderOption>()
    flatOptions.value.forEach((option) => {
      map.set(option.item[props.keyName], option)
    })
    return map
  })

  provide(CASCADER_OPTIONS_INJECTION, {
    multiple,
    activedList,
    updateActivedList,
    optionsList,
    flatOptions,
    flatOptionsMap,
    keyName: toRef(props, "keyName"),
    labelName: toRef(props, "labelName"),
    childrenName: toRef(props, "childrenName"),
    checkStrictly: toRef(props, "checkStrictly"),
    maxlevel: toRef(props, "maxlevel"),
    maxFilterCount: toRef(props, "maxFilterCount"),
    slots
  })

  return { optionsList, flatOptions, flatOptionsMap }
}
