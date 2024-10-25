import { computed } from "vue"
import type { Ref } from "vue"

import type { CascaderItem, CascaderOption, CascaderValue } from "../types"

/** a 与 b 相等 */
const isMatchList = (a: CascaderItem[], b: CascaderItem[], key: string) => {
  if (a.length !== b.length) return false
  for (let i = a.length - 1; i >= 0; i -= 1) {
    if (a[i][key] !== b[i][key]) return false
  }
  return true
}
/** a 是 b 的父集或者相等 */
const isMatchOrParentList = (
  a: CascaderItem[],
  b: CascaderItem[],
  key: string
) => {
  if (a.length > b.length) return false
  for (let i = a.length - 1; i >= 0; i -= 1) {
    if (a[i][key] !== b[i][key]) return false
  }
  return true
}
/** a 是 b 的子集 */
const isChildList = (a: CascaderItem[], b: CascaderItem[], key: string) => {
  if (a.length <= b.length) return false
  for (let i = b.length - 1; i >= 0; i -= 1) {
    if (a[i][key] !== b[i][key]) return false
  }
  return true
}
/** a 是 b 的子集或者相等 */
const isMatchOrChildList = (
  a: CascaderItem[],
  b: CascaderItem[],
  key: string
) => {
  if (a.length < b.length) return false
  for (let i = b.length - 1; i >= 0; i -= 1) {
    if (a[i][key] !== b[i][key]) return false
  }
  return true
}

export default (
  props: {
    /** 判断值的key name */
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    keyName: any
    /** 子选项的key name */
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    childrenName: any
    /** 最高级数 */
    maxlevel: number
    /** 勾选策略 */
    checkStrategy: "all" | "parent" | "child"
  },
  itemList: Ref<CascaderItem[]>,
  flatList: Ref<CascaderOption[]>,
  selectedList: Ref<CascaderOption[]>
) => {
  const selectedMap = computed(() => {
    const map = new Map<CascaderValue, CascaderOption>()
    for (let i = 0; i < selectedList.value.length; i += 1) {
      const item = selectedList.value[i]
      map.set(item.item[props.keyName], item)
    }
    return map
  })

  const allSelect = (
    list: CascaderOption[],
    option: CascaderOption
  ): CascaderOption[] => {
    const newList = list.slice()
    const parentPath = option.path.slice(0, -1)
    const parent = parentPath[parentPath.length - 1]
    let siblings: CascaderItem[] = []
    if (parent) {
      siblings = parent[props.childrenName]
    } else {
      siblings = itemList.value
    }
    if (!siblings?.length) return newList
    const optionKey = option.item[props.keyName]
    for (let i = 0; i < siblings.length; i += 1) {
      const sibling = siblings[i]
      const siblingPath = parentPath.concat(sibling)
      // 目标项
      if (sibling[props.keyName] === optionKey) continue
      // 已选
      const selectedIndex = newList.findIndex((selectedItem) =>
        isMatchList(selectedItem.path, siblingPath, props.keyName)
      )
      if (selectedIndex !== -1) continue
      // 存在兄弟级未选，加到其所有子项到末尾后抛出
      return newList.concat(childSelect(newList, option, true))
    }
    // 没有父级或者顶级，加到其所有子项到末尾后抛出
    if (!parentPath.length || !parent) {
      return newList.concat(childSelect(newList, option, true))
    }
    // 递归，选择父级
    return allSelect(newList, { item: parent, path: parentPath })
  }
  const allUnselect = (
    list: CascaderOption[],
    option: CascaderOption
  ): CascaderOption[] => {
    let newList = list.slice()
    const key = props.keyName
    const optionPath = option.path
    newList = newList.filter(({ path }) => {
      // 目标项或者其子项
      if (isMatchOrChildList(path, optionPath, key)) return false
      // 其父级
      if (isChildList(optionPath, path, key)) return false
      return true
    })
    return newList
  }
  const parentSelect = (
    list: CascaderOption[],
    option: CascaderOption
  ): CascaderOption[] => {
    const newList = list.slice()
    const parentPath = option.path.slice(0, -1)
    const parent = parentPath[parentPath.length - 1]
    let siblings: CascaderItem[] = []
    if (parent) {
      siblings = parent?.[props.childrenName] as CascaderItem[]
    } else {
      siblings = itemList.value
    }
    if (!siblings?.length) return newList
    // 已选的索引列表，用于全选时删除子选项
    let selectedIndexList: number[] = []
    const optionKey = option.item[props.keyName]
    for (let i = 0; i < siblings.length; i += 1) {
      const sibling = siblings[i]
      const siblingPath = parentPath.concat(sibling)
      // 目标项
      if (sibling[props.keyName] === optionKey) continue
      // 已选，记录，用于全选时删除
      const selectedIndex = newList.findIndex((selectedItem) =>
        isMatchList(selectedItem.path, siblingPath, props.keyName)
      )
      if (selectedIndex !== -1) {
        selectedIndexList.push(selectedIndex)
        continue
      }
      // 存在兄弟项未选，删除它的所有子选项，加到末尾后抛出
      for (let j = newList.length - 1; j >= 0; j -= 1) {
        if (!isChildList(newList[j].path, option.path, props.keyName)) continue
        newList.splice(j, 1)
      }
      return newList.concat(option)
    }
    // 没有父级或者顶级，删除其子选项，加到末尾后抛出
    if (!parentPath.length || !parent) {
      for (let j = newList.length - 1; j >= 0; j -= 1) {
        if (!isChildList(newList[j].path, option.path, props.keyName)) continue
        newList.splice(j, 1)
      }
      return newList.concat(option)
    }
    // 排序，先删除后面的
    selectedIndexList = selectedIndexList.sort((a, b) => a - b)
    for (let i = selectedIndexList.length - 1; i >= 0; i -= 1) {
      newList.splice(selectedIndexList[i], 1)
    }
    // 递归，选择父级
    return parentSelect(newList, { item: parent, path: parentPath })
  }
  const parentUnselect = (
    list: CascaderOption[],
    option: CascaderOption
  ): CascaderOption[] => {
    let newList = list.slice()
    // 找option是否自己被选
    const index = newList.findIndex((item) =>
      isMatchList(item.path, option.path, props.keyName)
    )
    // 自己被选则只剔除自己
    if (index !== -1) {
      newList.splice(index, 1)
      return newList
    }
    // 自己没被选则剔除其父级
    const parentPath = option.path.slice(0, -1)
    const parent = parentPath[parentPath.length - 1]
    if (!parent) return newList
    // 向上递归
    newList = parentUnselect(newList, { item: parent, path: parentPath })
    // 勾选兄弟级
    const siblings = parent[props.childrenName] as CascaderItem[]
    if (!siblings?.length) return newList
    const optionKey = option.item[props.keyName]
    for (let i = 0; i < siblings.length; i += 1) {
      const sibling = siblings[i]
      // 目标项
      if (sibling[props.keyName] === optionKey) continue
      newList.push({ path: parentPath.concat(sibling), item: sibling })
    }
    return newList
  }
  const childSelect = (
    /** 已选列表 */
    list: CascaderOption[],
    /** 目标项 */
    option: CascaderOption,
    /** 是否包含中途路径 */
    includePath = false
  ): CascaderOption[] => {
    const selectedSet = new Set(list.map((item) => item.item[props.keyName]))
    const addList: CascaderOption[] = []
    const stack: CascaderOption[] = [option]
    while (stack.length) {
      const current = stack.pop()!
      const exist = selectedSet.has(current.item[props.keyName])
      if (exist) continue

      const path = current.path
      const children = current.item[props.childrenName] as CascaderItem[]
      const reachedMaxLevel =
        !!props.maxlevel && current.path.length > props.maxlevel - 1
      if (!children?.length || reachedMaxLevel) {
        addList.push(current)
        selectedSet.add(current.item[props.keyName])
        continue
      }
      if (includePath) {
        addList.push(current)
        selectedSet.add(current.item[props.keyName])
      }
      for (let i = 0; i < children.length; i += 1) {
        const item = children[i]
        stack.push({ item, path: path.concat(item) })
      }
    }
    return addList
  }
  const childUnselect = (
    list: CascaderOption[],
    option: CascaderOption
  ): CascaderOption[] => {
    let newList = list.slice()
    const key = props.keyName
    const optionPath = option.path
    newList = newList.filter(({ path }) => {
      // 目标项
      if (isMatchList(path, optionPath, key)) return false
      // 其父级
      if (isChildList(optionPath, path, key)) return false
      // 其子项
      if (isChildList(path, optionPath, key)) return false
      return true
    })
    return newList
  }

  const selectedChildCountMap = computed(() => {
    const key = props.keyName
    const map = new Map<CascaderValue, number>()
    for (let i = 0; i < flatList.value.length; i += 1) {
      const option = flatList.value[i]
      const path = option.path
      const count = selectedList.value.reduce(
        (count, item) =>
          isChildList(item.path, path, key) ? count + 1 : count,
        0
      )
      map.set(option.item[key], count)
    }
    return map
  })

  const isSelected = (option: CascaderOption) => {
    if (props.checkStrategy === "all" || props.checkStrategy === "parent") {
      return selectedList.value.some((item) =>
        isMatchOrParentList(item.path, option.path, props.keyName)
      )
    } else {
      const children = option.item?.[props.childrenName] as CascaderItem[]
      if (!children?.length) {
        return selectedMap.value.has(option.item[props.keyName])
      }
      for (let i = 0; i < children.length; i += 1) {
        const child = children[i]
        const childOption = {
          item: child,
          path: [...option.path, child]
        }
        if (!isSelected(childOption)) return false
      }
      return true
    }
  }
  const getChildrenSelectedCount = (option: CascaderOption) => {
    const item = selectedChildCountMap.value.get(option.item[props.keyName])
    return item ?? 0
  }

  return {
    allSelect,
    allUnselect,
    parentSelect,
    parentUnselect,
    childSelect,
    childUnselect,
    isSelected,
    getChildrenSelectedCount
  }
}
