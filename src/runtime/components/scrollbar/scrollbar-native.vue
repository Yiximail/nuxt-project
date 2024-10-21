<template>
  <div ref="containerRef" :class="containerClass" @scroll="scrollHandle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { SCROLLBAR_INJECTION } from "../../utils/injection-keys"
import { ref, computed, provide } from "vue"

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
    ui?: DeepPartial<UI["scrollbarNative"]>
    /** 沿 x 轴滚动 */
    scrollX?: boolean
    /** 沿 y 轴滚动 */
    scrollY?: boolean
    /** 判断阈值 */
    threshold?: number
  }>(),
  {
    class: undefined,
    ui: undefined,
    scrollX: false,
    scrollY: true,
    threshold: 20
  }
)

const emits = defineEmits<{
  scroll: [ev: Event]
  "scroll-to-top": []
  "scroll-to-bottom": []
}>()

defineSlots<{
  default:() => ComponentSlot
}>()

const { ui } = useUi("scrollbarNative", props)

const property = computed(() => {
  if (props.scrollX && props.scrollY) return "scrollBoth"
  if (props.scrollY) return "scrollYOnly"
  if (props.scrollX) return "scrollXOnly"
  return "scrollYOnly"
})

const containerClass = computed(() => {
  return classMerge(ui.value[property.value], ui.value.container, props.class)
})

const checkTopAndBottom = (target: HTMLElement) => {
  const top = target.scrollTop
  const bottom = target.scrollTop + target.clientHeight
  if (top <= props.threshold) {
    emits("scroll-to-top")
  } else if (bottom >= target.scrollHeight - props.threshold) {
    emits("scroll-to-bottom")
  }
}

const scrollHandle = (ev: Event) => {
  const target = ev.target as HTMLDivElement | null
  if (!target) return
  emits("scroll", ev)
  checkTopAndBottom(target)
}

provide(SCROLLBAR_INJECTION, {
  scrollbar: containerRef
})
</script>
