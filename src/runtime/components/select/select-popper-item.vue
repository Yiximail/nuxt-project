<template>
  <div ref="containerRef" :class="containerClass" @click="clickHandle">
    <component :is="slots.option" v-if="slots.option" :option="option" />
    <template v-else>
      <div :class="prependClass">
        <component :is="slots.prepend" v-if="slots.prepend" :option="option" />
        <template v-else>
          <v-icon v-if="isSelected" icon="mdi:check" />
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
      <div v-if="slots.append" :class="appendClass">
        <component :is="slots.append" :option="option" />
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
  SELECT_OPTIONS_INJECTION,
  SELECT_SELECT_INJECTION,
  SCROLLBAR_INJECTION
} from "../../utils/injection-keys"
import { ref, computed, inject } from "vue"

import type { DeepPartial, ClassNameValue, SelectOption, UI } from "../../types"

const containerRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["selectPopperItem"]>
    /** 高亮关键字 */
    keyword?: string
    /** 对象 */
    option: SelectOption
  }>(),
  {
    class: undefined,
    ui: undefined,
    keyword: ""
  }
)

const { ui } = useUi("selectPopperItem", props)

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    isSelectabled.value && ui.value.selectabled,
    !isDisabled.value ? ui.value.enabled : ui.value.disabled,
    isSelected.value && ui.value.selected.container,
    props.class
  )
})
const prependClass = computed(() => {
  return classMerge(
    ui.value.prepend,
    isSelected.value && ui.value.selected.prepend
  )
})
const labelClass = computed(() => {
  return classMerge(ui.value.label, isSelected.value && ui.value.selected.label)
})
const appendClass = computed(() => {
  return classMerge(
    ui.value.append,
    isSelected.value && ui.value.selected.append
  )
})

const { labelName, keyName, slots } = inject(SELECT_OPTIONS_INJECTION)!
const { selected, selectedMap, disabledOption, selectHandle, unselectHandle } = inject(
  SELECT_SELECT_INJECTION
)!

const matchText = computed(() => {
  const key = labelName.value ?? "label"
  const label = props.option[key] as string
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
  return disabledOption.value(props.option)
})

useClickRipple(containerRef, {
  disabled: computed(() => isDisabled.value || !isSelectabled.value)
})

const isSelectabled = computed(() => {
  return !isDisabled.value
})

const isSelected = computed(() => {
  if (!keyName.value) return false
  // 多选才有
  if (selectedMap) return selectedMap.value.has(props.option[keyName.value])
  // 单选判断
  const value = props.option[keyName.value]
  return selected.value.some((item) => item[keyName.value] === value) ?? false
})

const clickHandle = () => {
  if (isDisabled.value) return
  if (isSelected.value) {
    unselectHandle(props.option)
  } else {
    selectHandle(props.option)
  }
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
