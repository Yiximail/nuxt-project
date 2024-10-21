import { computed } from "vue"
import type { Ref } from "vue"

import type { CascaderItem, CascaderOption } from "../types"

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
  const allSelect = (
    list: CascaderOption[],
    option: CascaderOption
  ): CascaderOption[] => {
    const newList = [...list]
    const parentPath = option.path.slice(0, -1)
    const parent = parentPath[parentPath.length - 1]
    let siblings: CascaderItem[] = []
    if (parent) {
      siblings = parent?.[props.childrenName] as CascaderItem[]
    } else {
      siblings = itemList.value
    }
    if (!siblings?.length) return newList
    const optionKey = option.item[props.keyName]
    for (let i = 0; i < siblings.length; i += 1) {
      const sibling = siblings[i]
      const siblingPath = [...parentPath, sibling]
      // 目标项
      if (sibling[props.keyName] === optionKey) continue
      // 已选
      const selectedIndex = newList.findIndex((selectedItem) =>
        isMatchList(selectedItem.path, siblingPath, props.keyName)
      )
      if (selectedIndex !== -1) continue
      // 存在兄弟级未选，加到其所有子项到末尾后抛出
      return [...newList, ...childSelect(newList, option, true)]
    }
    // 没有父级或者顶级，加到其所有子项到末尾后抛出
    if (!parentPath.length || !parent) {
      return [...newList, ...childSelect(newList, option, true)]
    }
    // 递归，选择父级
    return allSelect(newList, {
      item: parent,
      path: parentPath
    })
  }
  const allUnselect = (
    list: CascaderOption[],
    option: CascaderOption
  ): CascaderOption[] => {
    let newList = [...list]
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
    const newList = [...list]
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
      const siblingPath = [...parentPath, sibling]
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
      return [...newList, option]
    }
    // 没有父级或者顶级，删除其子选项，加到末尾后抛出
    if (!parentPath.length || !parent) {
      for (let j = newList.length - 1; j >= 0; j -= 1) {
        if (!isChildList(newList[j].path, option.path, props.keyName)) continue
        newList.splice(j, 1)
      }
      return [...newList, option]
    }
    // 排序，先删除后面的
    selectedIndexList = selectedIndexList.sort((a, b) => a - b)
    for (let i = selectedIndexList.length - 1; i >= 0; i -= 1) {
      newList.splice(selectedIndexList[i], 1)
    }
    // 递归，选择父级
    return parentSelect(newList, {
      item: parent,
      path: parentPath
    })
  }
  const parentUnselect = (
    list: CascaderOption[],
    option: CascaderOption
  ): CascaderOption[] => {
    let newList = [...list]
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
    newList = parentUnselect(newList, {
      item: parent,
      path: parentPath
    })
    // 勾选兄弟级
    const siblings = parent[props.childrenName] as CascaderItem[]
    if (!siblings?.length) return newList
    const optionKey = option.item[props.keyName]
    for (let i = 0; i < siblings.length; i += 1) {
      const sibling = siblings[i]
      // 目标项
      if (sibling[props.keyName] === optionKey) continue
      newList.push({
        path: [...parentPath, sibling],
        item: sibling
      })
    }
    return newList
  }
  const childSelect = (
    list: CascaderOption[],
    option: CascaderOption,
    includePath = false
  ): CascaderOption[] => {
    const addList: CascaderOption[] = []
    const exist = list.some(
      (selectedItem) =>
        selectedItem.item[props.keyName] === option.item[props.keyName]
    )
    if (exist) return addList
    if (includePath) addList.push(option)
    const path = option.path
    const children = option.item[props.childrenName] as CascaderItem[]
    const reachedMaxLevel =
      !!props.maxlevel && option.path.length > props.maxlevel - 1
    if (!children?.length || reachedMaxLevel) {
      if (!includePath) addList.push(option)
      return addList
    }
    for (let i = 0; i < children.length; i += 1) {
      const item = children[i]
      const childOption = { item, path: [...path, item] }
      const childResults = childSelect(list, childOption, includePath)
      addList.push(...childResults)
    }
    return addList
  }
  const childUnselect = (
    list: CascaderOption[],
    option: CascaderOption
  ): CascaderOption[] => {
    let newList = [...list]
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

  const selectedOptions = computed(() => {
    if (props.checkStrategy === "all") {
      return selectedList.value.map((item) => item.path)
    } else if (props.checkStrategy === "parent") {
      const temPathList: CascaderItem[][] = []
      const results: CascaderItem[][] = []
      for (let i = 0; i < flatList.value.length; i += 1) {
        const item = flatList.value[i]
        const path = item.path
        const last = temPathList[path.length - 1]
        if (last && isChildList(path, last, props.keyName)) {
          // 如果是上一个已选的子项，则认为是已选
          results.push(path)
          continue
        }
        // 否则则认为是兄弟分支
        // 找到同级的，删除其，以及后面的所有
        const index = temPathList.findLastIndex(
          (item) => item.length === path.length
        )
        if (index !== -1) temPathList.splice(index)
        const isSelected = selectedList.value.some((option) =>
          isMatchList(option.path, path, props.keyName)
        )
        if (isSelected) {
          results.push(path)
          temPathList.push(path)
        }
      }
      return results
    } else {
      // 这里不用
      return []
    }
  })

  const selectedChildCountList = computed(() => {
    const key = props.keyName
    if (props.checkStrategy === "all" || props.checkStrategy === "parent") {
      return flatList.value.map((option) => {
        const path = option.path
        const count = selectedOptions.value.reduce(
          (count, item) => (isChildList(item, path, key) ? count + 1 : count),
          0
        )
        return { path, count }
      })
    } else {
      const temList: { path: CascaderItem[]; count: number }[] = []
      const results: { path: CascaderItem[]; count: number }[] = []
      for (let i = flatList.value.length - 1; i >= 0; i -= 1) {
        const item = flatList.value[i]
        const path = item.path
        const temItem = temList[path.length - 1]
        if (temItem && isMatchList(temItem.path, path, key)) {
          results.push({ path, count: temItem.count })
          temList.splice(path.length - 1)
          continue
        }
        const children = item.item[props.childrenName] as CascaderItem[]
        const reachedMaxLevel =
          !!props.maxlevel && item.path.length > props.maxlevel - 1
        if (children?.length && !reachedMaxLevel) {
          continue
        }
        const isSelected = selectedList.value.some((option) =>
          isMatchList(option.path, path, key)
        )
        if (!isSelected) continue
        for (let j = 0; j < path.length; j += 1) {
          const subList = path.slice(0, j + 1)
          const temItem = temList[j]
          if (temItem && isMatchList(temItem.path, subList, key)) {
            temItem.count += 1
          } else {
            temList.splice(j, temList.length, { path: subList, count: 1 })
          }
        }
      }
      return results
    }
  })

  const isSelected = (option: CascaderOption) => {
    if (props.checkStrategy === "all" || props.checkStrategy === "parent") {
      return selectedOptions.value.some((item) =>
        isMatchOrParentList(item, option.path, props.keyName)
      )
    } else {
      const children = option.item?.[props.childrenName] as CascaderItem[]
      if (!children?.length) {
        return selectedList.value.some((item) =>
          isMatchList(item.path, option.path, props.keyName)
        )
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
    const item = selectedChildCountList.value.find((item) =>
      isMatchList(item.path, option.path, props.keyName)
    )
    return item?.count ?? 0
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
