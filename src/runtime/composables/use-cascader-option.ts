import { CASCADER_OPTIONS_INJECTION } from "../utils/injection-keys"
import { ref, computed, toRef, provide } from "vue"

import type { ComponentSlot, CascaderItem, CascaderOption, CascaderValue } from "../types"

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
    path: CascaderItem[],
    items: CascaderItem[]
  ): CascaderOption[] => {
    const result: {
      path: CascaderItem[]
      item: CascaderItem
    }[] = []
    const checkChildren = !props.maxlevel || path.length < props.maxlevel - 1
    let childList: {
      path: CascaderItem[]
      item: CascaderItem
    }[] = []
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const children = item[props.childrenName] as CascaderItem[]
      childList = []
      if (checkChildren && Array.isArray(children)) {
        const nextPath = [...path, item]
        childList = getFlatOptions(nextPath, children)
      }
      result.push({
        path: [...path, item],
        item
      })
      if (childList.length) result.push(...childList)
    }
    return result
  }

  const flatOptions = computed(() => {
    return getFlatOptions([], props.options)
  })

  provide(CASCADER_OPTIONS_INJECTION, {
    multiple,
    activedList,
    updateActivedList,
    optionsList,
    flatOptions,
    keyName: toRef(props, "keyName"),
    labelName: toRef(props, "labelName"),
    childrenName: toRef(props, "childrenName"),
    checkStrictly: toRef(props, "checkStrictly"),
    maxlevel: toRef(props, "maxlevel"),
    slots
  })

  return { optionsList, flatOptions }
}
