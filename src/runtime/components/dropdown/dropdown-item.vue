<template>
  <div ref="containerRef" :class="containerClass" @click="clickHandle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useClickRipple from "../../composables/use-click-ripple"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import {
  DROPDOWN_INJECTION,
  SCROLLBAR_INJECTION
} from "../../utils/injection-keys"
import { ref, computed, watch, onMounted, inject } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ComponentSlot,
  UI
} from "../../types"

const containerRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["dropdownItem"]>
    /** 禁用 */
    disabled?: boolean
    /** 选中状态 */
    selected?: boolean
  }>(),
  {
    class: undefined,
    ui: undefined,
    disabled: undefined,
    selected: false
  }
)

const emits = defineEmits<{
  click: [event: MouseEvent]
}>()

defineSlots<{
  default:() => ComponentSlot
}>()

const { ui } = useUi("dropdownItem", props)
const { disabled } = useInheritedDisabled(props)
useClickRipple(containerRef, { disabled })

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    props.selected && ui.value.selected,
    !disabled.value ? ui.value.selectabled : ui.value.disabled,
    props.class
  )
})

const { clickClose, hidePopper } = inject(DROPDOWN_INJECTION)!

const clickHandle = (event: MouseEvent) => {
  if (disabled.value) return
  emits("click", event)
  if (clickClose.value) hidePopper()
}

const scrollbarInjection = inject(SCROLLBAR_INJECTION, undefined)
const scrollTo = (center: boolean) => {
  if (!containerRef.value) return
  if (scrollbarInjection?.scrollbar.value && center) {
    const scrollbarHeight = scrollbarInjection.scrollbar.value.clientHeight
    const height = containerRef.value.clientHeight
    scrollbarInjection.scrollbar.value.scrollTo({
      top: containerRef.value.offsetTop - scrollbarHeight / 2 + height / 2
    })
  } else if (scrollbarInjection?.scrollbar.value) {
    const scrollbarHeight = scrollbarInjection.scrollbar.value.clientHeight
    const height = containerRef.value.clientHeight
    const offsetTop = containerRef.value.offsetTop
    const scrollTop = scrollbarInjection.scrollbar.value.scrollTop
    const maxScrollTop = offsetTop - height
    const minScrollTop = offsetTop - scrollbarHeight + height
    if (scrollTop > maxScrollTop || scrollTop < minScrollTop) {
      scrollbarInjection.scrollbar.value.scrollTo({
        top: containerRef.value.offsetTop - scrollbarHeight / 2 + height / 2,
        behavior: "smooth"
      })
    }
  } else {
    containerRef.value.scrollIntoView({ block: "nearest" })
  }
}
onMounted(() => {
  if (props.selected) scrollTo(true)
  watch(
    () => props.selected,
    (value) => {
      if (value) scrollTo(false)
    }
  )
})
defineExpose({ scrollTo })
</script>
