<template>
  <div v-bind="$attrs" :class="containerClass">
    <slot />
    <v-icon
      v-if="closeable"
      :class="ui.closeButton"
      icon="mdi:close"
      @click="$emit('close')"
      @mousedown.stop.capture
    />
  </div>
</template>

<script setup lang="ts">
import VIcon from "../icon/icon.vue"

import { computed, toRef } from "vue"
import useUi from "../../composables/use-ui"
import useInheritedSize from "../../composables/use-inherited-size"
import classMerge from "../../utils/class-merge"

import type {
  DeepPartial,
  ClassNameValue,
  Color,
  ComponentSlot,
  Size,
  UI
} from "../../types"

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["tag"]>
    /** 类型 */
    type?: keyof UI["tag"]["type"]
    /** 大小 */
    size?: Size
    /** 颜色 */
    color?: Color
    /** 阴影 */
    shadow?: boolean
    /** 边框 */
    border?: boolean
    /** 圆形 */
    rounded?: boolean
    /** 可关闭的 */
    closeable?: boolean
    /** 关闭按钮颜色 */
    closeColor?: Color
  }>(),
  {
    class: undefined,
    ui: undefined,
    type: "base",
    size: undefined,
    color: "primary",
    shadow: false,
    border: false,
    rounded: false,
    closeable: false,
    closeColor: "danger"
  }
)

defineEmits<{
  close: []
}>()

defineSlots<{
  default:() => ComponentSlot
}>()

const { ui } = useUi("tag", props, { color: toRef(props, "color") })
const { size } = useInheritedSize(props)

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    ui.value.type[props.type],
    ui.value.size[size.value],
    props.shadow && ui.value.shadow,
    props.border && ui.value.border,
    props.rounded && ui.value.rounded,
    props.class
  )
})
</script>
