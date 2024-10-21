<template>
  <div ref="containerRef" :class="containerClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed, onMounted } from "vue"

import type { DeepPartial, ClassNameValue, UI } from "../../types"

const containerRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["sticky"]>
  }>(),
  {
    class: undefined,
    ui: undefined
  }
)

const { ui } = useUi("sticky", props)

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    !noSticky.value && ui.value.sticky,
    props.class
  )
})

const noSticky = ref(false)
const checkStrictlyOverflow = (element: HTMLElement | null | undefined) => {
  const parent = element?.parentElement
  if (!parent) return
  const style = window.getComputedStyle(parent)
  switch (true) {
    case style.overflow.includes("auto"):
    case style.overflow.includes("scroll"):
      return
    case style.overflow !== "visible":
      noSticky.value = true
      return
  }
  checkStrictlyOverflow(parent)
}
onMounted(() => {
  checkStrictlyOverflow(containerRef.value)
})
</script>
