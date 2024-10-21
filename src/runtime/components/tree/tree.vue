<template>
  <div
    ref="containerRef"
    :class="['group/container', containerClass]"
    :style="treeStyle"
  >
    <div ref="scrollerRef" :class="ui.scroller">
      <div ref="viewRef" :class="ui.view">
        <template v-for="object in objectList" :key="object.key">
          <template v-if="object.type === 'default'">
            <v-tree-item
              v-for="item in object.list"
              ref="treeItemRef"
              :key="item[keyName]"
              :item="item"
              @dragstart="dragstartHandle"
              @dragover="dragoverHandle"
              @dragend="dragendHandle"
            >
              <template v-if="$slots.prepend" #prepend="{ object: itemObject }">
                <slot
                  name="prepend"
                  :object="itemObject as TreeGenericObject<GenericItem>"
                />
              </template>
              <template v-if="$slots.default" #default="{ object: itemObject }">
                <slot :object="itemObject as TreeGenericObject<GenericItem>" />
              </template>
              <template v-if="$slots.append" #append="{ object: itemObject }">
                <slot
                  name="append"
                  :object="itemObject as TreeGenericObject<GenericItem>"
                />
              </template>
            </v-tree-item>
          </template>
          <v-collapse
            v-else
            :show="object.type === 'expand'"
            appear
            @after-enter="animationend"
            @after-leave="animationend"
          >
            <v-tree-item
              v-for="item in object.list"
              ref="treeItemRef"
              :key="item[keyName]"
              :item="item"
              animating
            >
              <template v-if="$slots.prepend" #prepend="{ object: itemObject }">
                <slot
                  name="prepend"
                  :object="itemObject as TreeGenericObject<GenericItem>"
                />
              </template>
              <template v-if="$slots.default" #content="{ object: itemObject }">
                <slot :object="itemObject as TreeGenericObject<GenericItem>" />
              </template>
              <template v-if="$slots.append" #append="{ object: itemObject }">
                <slot
                  name="append"
                  :object="itemObject as TreeGenericObject<GenericItem>"
                />
              </template>
            </v-tree-item>
          </v-collapse>
        </template>
      </div>
    </div>
    <div v-if="!data.length" :class="ui.empty">
      <v-empty :text="emptyText" />
    </div>
    <v-scrollbar-bar
      ref="verticalRef"
      :class="ui.verticalScrollbar"
      type="vertical"
      @scroll-to="scrollTo"
    />
    <v-scrollbar-bar
      ref="horizontalRef"
      :class="ui.horizontalScrollbar"
      type="horizontal"
      @scroll-to="scrollTo"
    />
  </div>
</template>

<script setup lang="ts" generic="GenericItem extends TreeItem">
import VScrollbarBar from "../scrollbar/scrollbar-bar.vue"
import VTreeItem from "./tree-item.vue"
import VCollapse from "../collapse/collapse.vue"
import VEmpty from "../empty/empty.vue"

import useScrollbar from "../../composables/use-scrollbar"
import useCascaderMultipleSelect from "../../composables/use-cascader-multiple-select"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { TREE_INJECTION } from "../../utils/injection-keys"
import { ref, computed, watch, toRef, nextTick, provide } from "vue"

import type {
  ComponentSlot,
  ClassNameValue,
  DeepPartial,
  TreeItem,
  TreeObject,
  TreeGenericObject,
  CascaderValue,
  CascaderOption,
  CascaderItem,
  TreeDragObject,
  DragPosition,
  UI
} from "../../types"
import type { CSSProperties } from "vue"

const containerRef = ref<HTMLDivElement>()
const scrollerRef = ref<HTMLElement>()
const viewRef = ref<HTMLElement>()
const verticalRef = ref<InstanceType<typeof VScrollbarBar>>()
const horizontalRef = ref<InstanceType<typeof VScrollbarBar>>()

const treeItemRef = ref<InstanceType<typeof VTreeItem>[]>()

const props = withDefaults(
  defineProps<{
    /** 选择列表 */
    selectedList?: GenericItem[]
    /** 数据 */
    data?: GenericItem[]
    /** 展开的列表 */
    expandedKeys?: unknown[]
    /** 判断值的key name */
    keyName: string
    /** 显示名的key name */
    labelName?: string
    /** 子选项的key name */
    childrenName?: string
    /** 最高级数 */
    maxlevel?: number
    /** 勾选策略 */
    checkStrategy?: "all" | "parent" | "child"
    /** 空列表提示 */
    emptyText?: string
    /** 拖拽排序 */
    draggable?: boolean
    /** 是否可放置 */
    droppable?:(
      dragging: TreeDragObject<GenericItem>,
      target: TreeDragObject<GenericItem>,
      position: DragPosition
    ) => boolean
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["tree"]>
  }>(),
  {
    selectedList: undefined,
    data: () => [],
    expandedKeys: () => [],
    labelName: "label",
    childrenName: "children",
    maxlevel: 0,
    checkStrategy: "parent",
    emptyText: "暂无数据",
    draggable: false,
    droppable: () => true,
    class: undefined,
    ui: undefined
  }
)

const emits = defineEmits<{
  "update:selected-list": [list: GenericItem[]]
  "update:expanded-keys": [keys: unknown[]]
  dragstart: [dragging: TreeDragObject<GenericItem>]
  dragover: [
    dragging: TreeDragObject<GenericItem>,
    target: TreeDragObject<GenericItem>
  ]
  dragend: []
  drop: [
    dragging: TreeDragObject<GenericItem>,
    target: TreeDragObject<GenericItem>,
    position: DragPosition
  ]
}>()

defineSlots<{
  prepend:(props: { object: TreeGenericObject<GenericItem> }) => ComponentSlot
  default: (props: { object: TreeGenericObject<GenericItem> }) => ComponentSlot
  append: (props: { object: TreeGenericObject<GenericItem> }) => ComponentSlot
}>()

const { ui } = useUi("tree", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})

const treeStyle = computed(() => {
  const style: CSSProperties = {}
  return style
})

const { scrollTo, startObserver, stopObserver } = useScrollbar(
  scrollerRef,
  viewRef,
  { verticalRef, horizontalRef }
)

const _expandedKeys = ref<unknown[]>([])
const expandingKey = ref<unknown>()
const collapsingKey = ref<unknown>()
watch(
  () => props.expandedKeys,
  (val) => {
    let match = true
    if (val.length !== _expandedKeys.value.length) {
      match = false
    } else {
      match = val.every((key) => _expandedKeys.value.includes(key))
    }
    if (match) return
    _expandedKeys.value = val
    expandingKey.value = undefined
    collapsingKey.value = undefined
  },
  { immediate: true }
)

const toggleExpand = (key: unknown) => {
  if (expandingKey.value || collapsingKey.value) return
  const index = _expandedKeys.value.indexOf(key)
  if (objectList.value.length > 100) {
    if (index === -1) {
      _expandedKeys.value.push(key)
    } else {
      _expandedKeys.value.splice(index, 1)
    }
  } else {
    if (index === -1) {
      expandingKey.value = key
    } else {
      collapsingKey.value = key
    }
  }
  stopObserver()
}
const animationend = () => {
  if (expandingKey.value) {
    _expandedKeys.value.push(expandingKey.value)
    expandingKey.value = undefined
  } else if (collapsingKey.value) {
    const index = _expandedKeys.value.indexOf(collapsingKey.value)
    if (index !== -1) {
      _expandedKeys.value.splice(index, 1)
    }
    collapsingKey.value = undefined
  }
  emits("update:expanded-keys", _expandedKeys.value)
  nextTick(startObserver)
}

const getObjectList = (
  type: "default" | "expand" | "collapse",
  list: GenericItem[],
  path: GenericItem[]
) => {
  if (!!props.maxlevel && path.length > props.maxlevel - 1) return []
  const results: {
    type: "default" | "expand" | "collapse"
    key: unknown
    list: GenericItem[]
  }[] = []
  const animatingList: GenericItem[] = []
  for (let i = 0; i < list.length; i += 1) {
    const item = list[i]
    if (type === "default") {
      const key = item[props.keyName]
      results.push({ type, key, list: [item] })
    } else {
      animatingList.push(item)
    }
    const children = item[props.childrenName]
    if (!Array.isArray(children) || children.length === 0) continue
    const key = item[props.keyName]
    if (!key) continue
    let itemType: "default" | "expand" | "collapse" | undefined
    const expanded = _expandedKeys.value.includes(key)
    if (expandingKey.value === key || (type === "expand" && expanded)) {
      itemType = "expand"
    } else if (
      collapsingKey.value === key ||
      (type === "collapse" && expanded)
    ) {
      itemType = "collapse"
    } else if (expanded) {
      itemType = "default"
    }
    if (!itemType) continue
    const childList = getObjectList(itemType, children, [...path, item])
    if (itemType === "default") {
      results.push(...childList)
    } else if (type === "default") {
      const flatList = childList?.[0]?.list ?? []
      const key = item[props.keyName].toString() + "__children"
      results.push({ type: itemType, key, list: flatList })
    } else {
      const flatList = childList?.[0]?.list ?? []
      animatingList.push(...flatList)
    }
  }
  if (animatingList.length) {
    // 这里不是父级，所以不需要key
    const key = ""
    results.push({ type, key, list: animatingList })
  }
  return results
}
const objectList = computed(() => {
  const list = getObjectList("default", props.data, [])
  return list
})

const getFlatOpjectList = (
  list: GenericItem[],
  indexList: number[],
  path: GenericItem[]
): TreeObject[] => {
  const results: TreeObject[] = []
  for (let i = 0; i < list.length; i += 1) {
    const item = list[i]
    const itemIndexList = [...indexList, i]
    const itemPath = [...path, item]
    results.push({ item, path: itemPath })
    const children = item[props.childrenName]
    if (!Array.isArray(children) || children.length === 0) continue
    const childList = getFlatOpjectList(children, itemIndexList, itemPath)
    results.push(...childList)
  }
  return results
}
const flatObjectList = computed(() => {
  const list = getFlatOpjectList(props.data, [], [])
  return list
})

const selectedObject = computed(() => {
  if (props.selectedList === undefined) return []
  const values = props.selectedList.map((item: unknown) => {
    const obj = item as Record<string, unknown>
    return obj[props.keyName] as CascaderValue
  })
  if (!values) return []
  const results: CascaderOption[] = []
  for (let i = 0; i < values.length; i += 1) {
    const item = flatObjectList.value.find(
      (option) => option.item[props.keyName] === values[i]
    )
    if (item) {
      results.push(item)
    } else {
      console.warn("[v-tree]: 找不到节点", values[i])
    }
  }
  return results
})

const {
  allSelect,
  allUnselect,
  parentSelect,
  parentUnselect,
  childSelect,
  childUnselect,
  isSelected,
  getChildrenSelectedCount
} = useCascaderMultipleSelect(
  props,
  toRef(props, "data"),
  flatObjectList,
  selectedObject
)

const selectHandle = (option: TreeObject) => {
  let newList: TreeObject[] = []
  if (props.checkStrategy === "all") {
    newList = allSelect(selectedObject.value, option)
  } else if (props.checkStrategy === "parent") {
    newList = parentSelect(selectedObject.value, option)
  } else if (props.checkStrategy === "child") {
    const addList = childSelect(selectedObject.value, option)
    newList = [...selectedObject.value, ...addList]
  }
  emits(
    "update:selected-list",
    newList.map((option) => option.item as GenericItem)
  )
}
const unselectHandle = (option: TreeObject) => {
  let newList: TreeObject[] = []
  if (props.checkStrategy === "all") {
    newList = allUnselect(selectedObject.value, option)
  } else if (props.checkStrategy === "parent") {
    newList = parentUnselect(selectedObject.value, option)
  } else if (props.checkStrategy === "child") {
    newList = childUnselect(selectedObject.value, option)
  }
  emits(
    "update:selected-list",
    newList.map((option) => option.item as GenericItem)
  )
}

const draggingObject = ref<TreeDragObject<GenericItem>>()
const dragoverObject = ref<TreeDragObject<GenericItem>>()
const dragoverPosition = ref<DragPosition>()
const dragstartHandle = (object: TreeObject) => {
  if (!props.draggable) return
  const draggingItem = object.item as GenericItem
  const draggingPath = object.path as GenericItem[]
  const draggingParent = object.path[object.path.length - 2] as GenericItem
  const draggingSiblings =
    (draggingParent?.[props.childrenName] as GenericItem[]) ?? props.data
  const draggingIndex = draggingSiblings?.findIndex(
    (item) => item === draggingItem
  )
  draggingObject.value = {
    parent: draggingParent,
    siblings: draggingSiblings,
    item: draggingItem,
    path: draggingPath,
    index: draggingIndex
  }
  emits("dragstart", draggingObject.value)
}
const isMatchList = (a: CascaderItem[], b: CascaderItem[], key: string) => {
  if (a.length !== b.length) return false
  return a.every((item, index) => item[key] === b[index][key])
}
const dragoverHandle = (
  event: DragEvent,
  object: TreeObject,
  position: DragPosition
) => {
  const dragging = draggingObject.value
  if (!props.draggable || !dragging) return
  const draggingPath = dragging.path
  const dragoverPath = object.path
  if (
    !isMatchList(draggingPath, dragoverPath, props.keyName) ||
    dragoverPosition.value !== position
  ) {
    const dragoverItem = object.item as GenericItem
    const dragoverPath = object.path as GenericItem[]
    const dragoverParent = object.path[object.path.length - 2] as GenericItem
    const dragoverSiblings =
      (dragoverParent?.[props.childrenName] as GenericItem[]) ?? props.data
    const dragoverIndex = dragoverSiblings?.findIndex(
      (item) => item === dragoverItem
    )
    const newDragover = {
      parent: dragoverParent,
      siblings: dragoverSiblings,
      item: dragoverItem,
      path: dragoverPath,
      index: dragoverIndex
    }
    const able = props.droppable(dragging, newDragover, position)
    if (!able) return
    dragoverObject.value = newDragover
    dragoverPosition.value = position
  }
  event.preventDefault()
  if (dragoverObject.value) emits("dragover", dragging, dragoverObject.value)
}
const dragendHandle = () => {
  if (draggingObject.value && dragoverObject.value && dragoverPosition.value) {
    emits(
      "drop",
      draggingObject.value,
      dragoverObject.value,
      dragoverPosition.value
    )
  }
  treeItemRef.value?.forEach((item) => {
    item.clearDragoverTimer()
  })
  draggingObject.value = undefined
  dragoverObject.value = undefined
  dragoverPosition.value = undefined
  emits("dragend")
}

provide(TREE_INJECTION, {
  classes: computed(() => {
    return ui.value
  }),
  keyName: toRef(props, "keyName"),
  labelName: toRef(props, "labelName"),
  childrenName: toRef(props, "childrenName"),
  maxlevel: toRef(props, "maxlevel"),
  expandedKeys: _expandedKeys,
  expandingKey,
  collapsingKey,
  toggleExpand,
  flatObjectList,
  selectable: computed(() => props.selectedList !== undefined),
  isSelected,
  getChildrenSelectedCount,
  selectHandle,
  unselectHandle,
  draggable: toRef(props, "draggable"),
  draggingObject,
  dragoverObject,
  dragoverPosition
})
</script>
