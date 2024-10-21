<template>
  <div ref="itemRef" :class="containerClass" @click="clickHandle">
    <slot name="tab" :active="isActived">
      <div :class="labelClass">
        {{ labelValue }}
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import useClickRipple from "../../composables/use-click-ripple"
import useResizeObserver from "../../composables/use-resize-observer"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { getNodes } from "../../utils/vnode"
import { TABS_INJECTION } from "../../utils/injection-keys"
import {
  ref,
  computed,
  watch,
  toRef,
  onMounted,
  onBeforeUnmount,
  inject,
  h,
  Text
} from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ComponentSlot,
  UI
} from "../../types"

const itemRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    /** 值 */
    value: string | number
    /** 标签 */
    label?: string
    /** 显示边框 */
    outline?: boolean
    /** 是否禁用 */
    disabled?: boolean
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["tabsItem"]>
  }>(),
  {
    label: undefined,
    outline: false,
    disabled: undefined,
    class: undefined,
    ui: undefined
  }
)

const slots = defineSlots<{
  tab:(props: { active: boolean }) => ComponentSlot
  default: () => ComponentSlot
}>()

const { ui } = useUi("tabsItem", props)

useClickRipple(itemRef, { disabled: toRef(props, "disabled") })

const { actived, setActived, updateElement } = inject(TABS_INJECTION)!

const labelValue = computed(() => props.label ?? props.value.toString())

const isActived = computed(() => actived.value === props.value)

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    props.outline && ui.value.outline,
    props.disabled && ui.value.disabled.container,
    isActived.value && ui.value.actived.container,
    props.class
  )
})

const labelClass = computed(() => {
  return classMerge(
    ui.value.label,
    props.disabled && ui.value.disabled.label,
    isActived.value && ui.value.actived.label
  )
})

const clickHandle = () => {
  const vnodes = slots.default ? getNodes(slots.default()) : []
  if (vnodes.length === 0) {
    setActived(props.value)
  } else if (vnodes.length === 1) {
    const vnode =
      vnodes[0].type === Text
        ? h("div", { class: "w-full" }, [vnodes[0]])
        : vnodes[0]
    setActived(props.value, vnode)
  } else {
    setActived(props.value, h("div", { class: "w-full" }, vnodes))
  }
}

const resizeCallback = () => {
  if (!itemRef.value) return
  if (!isActived.value) return
  updateElement(itemRef.value)
}
useResizeObserver(itemRef, resizeCallback)
onMounted(() => {
  if (isActived.value) {
    clickHandle()
  }
  watch(isActived, (val) => {
    if (!val) return
    if (!itemRef.value) return
    updateElement(itemRef.value)
  })
})
onBeforeUnmount(() => {
  if (isActived.value) {
    updateElement(undefined)
    setActived(undefined)
  }
})
</script>
