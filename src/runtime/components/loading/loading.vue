<template>
  <div ref="containerRef" :class="containerClass">
    <div :class="ui.content">
      <slot name="icon">
        <v-icon :class="ui.icon" :icon="icon" />
      </slot>
      <slot name="text">
        <span v-if="text" :class="ui.text">
          {{ text }}
        </span>
      </slot>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import VIcon from "../icon/icon.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  IconComponent,
  ComponentSlot,
  UI
} from "../../types"

const containerRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["loading"]>
    /** 图标 */
    icon?: IconComponent
    /** 提示文字 */
    text?: string
  }>(),
  {
    icon: () => ({
      name: "mingcute:loading-fill",
      class: "animate-spin h-5 w-5"
    }),
    text: "加载中",
    class: undefined,
    ui: undefined
  }
)

defineSlots<{
  icon:() => ComponentSlot
  text: () => ComponentSlot
  default: () => ComponentSlot
}>()

const { ui } = useUi("loading", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})

defineExpose({ reference: containerRef })
</script>
