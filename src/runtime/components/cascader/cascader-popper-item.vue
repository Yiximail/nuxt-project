<template>
  <div ref="containerRef" :class="containerClass" @click="clickHandle">
    <component :is="slots.option" v-if="slots.option" :option="option" />
    <template v-else>
      <div :class="prependClass">
        <component :is="slots.prepend" v-if="slots.prepend" :option="option" />
        <template v-else>
          <v-icon v-if="isSelectedStatus" icon="mdi:check" />
        </template>
      </div>
      <div :class="labelClass">
        <component :is="slots.label" v-if="slots.label" :option="option" />
        <template v-else>
          <span
            v-for="(text, textIndex) in matchText"
            :key="textIndex"
            :class="text.highlight ? ui.highlight : ''"
          >
            {{ text.str }}
          </span>
        </template>
      </div>
      <div v-if="slots.append || hasChildren" :class="appendClass">
        <component :is="slots.append" v-if="slots.append" :option="option" />
        <template v-else>
          <div
            :class="ui.childrenButton"
            @click.stop.prevent="clickChild"
            @mousedown.stop
            @mouseenter="mouseenterHandle"
            @mouseleave="mouseleaveHandle"
          >
            <template v-if="selectedChildCount">
              <span v-if="multiple" :class="ui.childrenCount">
                {{ selectedChildCount }}
              </span>
              <div v-else :class="ui.childrenIconClass" />
            </template>
            <v-icon icon="mdi:chevron-right" />
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import VIcon from "../icon/icon.vue"
import useClickRipple from "../../composables/use-click-ripple"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import {
  CASCADER_OPTIONS_INJECTION,
  CASCADER_SELECT_INJECTION,
  SCROLLBAR_INJECTION
} from "../../utils/injection-keys"
import { ref, computed, inject } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  CascaderItem,
  CascaderOption,
  UI
} from "../../types"

const containerRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["cascaderPopperItem"]>
    /** 高亮关键字 */
    keyword?: string
    /** 对象 */
    item: CascaderItem
    /** 是否为筛选 */
    isFiltered?: boolean
  }>(),
  {
    class: undefined,
    ui: undefined,
    keyword: "",
    isFiltered: false
  }
)

const { ui } = useUi("cascaderPopperItem", props)

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    isSelectabled.value && ui.value.selectabled,
    !isDisabled.value ? ui.value.enabled : ui.value.disabled,
    showingChildren.value && ui.value.activeChildren.container,
    isSelectedStatus.value && ui.value.selected.container,
    props.class
  )
})
const prependClass = computed(() => {
  return classMerge(
    ui.value.prepend,
    showingChildren.value && ui.value.activeChildren.prepend,
    isSelectedStatus.value && ui.value.selected.prepend
  )
})
const labelClass = computed(() => {
  return classMerge(
    ui.value.label,
    showingChildren.value && ui.value.activeChildren.label,
    isSelectedStatus.value && ui.value.selected.label
  )
})
const appendClass = computed(() => {
  return classMerge(
    ui.value.append,
    showingChildren.value && ui.value.activeChildren.append,
    isSelectedStatus.value && ui.value.selected.append
  )
})

const {
  multiple,
  activedList,
  updateActivedList,
  flatOptions,
  labelName,
  keyName,
  childrenName,
  checkStrictly,
  maxlevel,
  slots
} = inject(CASCADER_OPTIONS_INJECTION)!
const {
  isSelected,
  getChildrenSelectedCount,
  disabledOption,
  selectHandle,
  unselectHandle
} = inject(CASCADER_SELECT_INJECTION)!

const itemKey = computed(() => props.item[keyName.value])
const option = computed<CascaderOption>(() => {
  const option = flatOptions.value.find(
    (item: CascaderOption) => item.item[keyName.value] === itemKey.value
  )
  if (option) return option
  return { item: props.item, path: [] } as CascaderOption
})
const level = computed(() => option.value?.path?.length ?? 1)

const labelText = computed(() => {
  const key = labelName.value ?? "label"
  if (props.isFiltered) {
    const labels = option.value?.path?.map((item) => item?.[key]) ?? []
    const label = labels.join("/")
    return label
  } else {
    return props.item[key] as string
  }
})

const matchText = computed(() => {
  const label = labelText.value
  if (!label) return [{ str: "", highlight: false }]
  if (!props.keyword) return [{ str: label, highlight: false }]
  const escapedSearch = props.keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(escapedSearch, "gi")
  const list = label.split(regex)
  const match = label.match(regex)
  const items: { str: string; highlight: boolean }[] = []
  for (let i = 0; i < list.length; i++) {
    items.push({ str: list[i], highlight: false })
    items.push({ str: match?.[i] as string, highlight: true })
  }
  return items.slice(0, -1)
})

const isDisabled = computed(() => {
  return disabledOption.value(option.value)
})

useClickRipple(containerRef, {
  disabled: computed(() => isDisabled.value || !isSelectabled.value)
})

const isSelectabled = computed(() => {
  if (isDisabled.value) return false
  if (!checkStrictly.value && hasChildren.value) return false
  return true
})

const isSelectedStatus = computed(() => {
  return isSelected(option.value)
})

const hasChildren = computed(() => {
  if (props.isFiltered) return false
  if (!!maxlevel.value && level.value >= maxlevel.value) return false
  const children = props.item?.[childrenName.value]
  if (!Array.isArray(children)) return false
  return children.length > 0
})

const showingChildren = computed(() => {
  if (!hasChildren.value) return false
  const activedKey = activedList.value[level.value - 1]?.[keyName.value]
  if (!activedKey) return false
  return activedKey === itemKey.value
})

const selectedChildCount = computed(() => {
  if (!hasChildren.value) return 0
  if (isSelectedStatus.value) return 0
  return getChildrenSelectedCount(option.value)
})

const clickHandle = () => {
  if (!isSelectabled.value) {
    if (!checkStrictly.value && hasChildren.value) {
      updateActivedList(level.value, props.item)
    }
    return
  }
  if (isSelectedStatus.value) {
    unselectHandle(option.value)
  } else {
    selectHandle(option.value)
  }
}

let hoverTimer: number | undefined
const mouseenterHandle = () => {
  if (isDisabled.value) return
  if (!hasChildren.value) return
  if (showingChildren.value) return
  if (hoverTimer) clearTimeout(hoverTimer)
  hoverTimer = window.setTimeout(() => {
    updateActivedList(level.value, props.item)
    hoverTimer = undefined
  }, 300)
}
const mouseleaveHandle = () => {
  if (hoverTimer) clearTimeout(hoverTimer)
}

const clickChild = () => {
  if (hoverTimer) clearTimeout(hoverTimer)
  updateActivedList(level.value, props.item)
}

const scrollbarInjection = inject(SCROLLBAR_INJECTION, undefined)
const scrollTo = () => {
  if (!containerRef.value) return
  if (scrollbarInjection?.scrollbar.value) {
    const scrollbarHeight = scrollbarInjection.scrollbar.value.clientHeight
    const height = containerRef.value.clientHeight
    scrollbarInjection.scrollbar.value.scrollTo({
      top: containerRef.value.offsetTop - scrollbarHeight / 2 + height / 2
    })
  } else {
    containerRef.value.scrollIntoView({ block: "nearest" })
  }
}
defineExpose({ scrollTo })
</script>
