<template>
  <div :class="containerClass">
    <slot />
    <div
      v-if="show ?? (!emptyHide || displayContent || $slots.content)"
      :class="_badgeClass"
      v-bind="$attrs"
    >
      <slot name="content">
        {{ displayContent }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { toRef, computed } from "vue"

import type {
  ClassNameValue,
  DeepPartial,
  Color,
  ComponentSlot,
  UI
} from "../../types"

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 徽章类名 */
    badgeClass?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["badge"]>
    /** 受控是否显示 */
    show?: boolean
    /** 内容 */
    content?: string | number
    /** 最大值 只有内容为数字的时候有效 */
    max?: number
    /** 数字为零 字符串为空 的时候隐藏 */
    emptyHide?: boolean
    /** 颜色 */
    color?: Color
    /** 块级元素 */
    block?: boolean
    /** 阴影 */
    shadow?: boolean
  }>(),
  {
    show: undefined,
    content: undefined,
    max: 99,
    emptyHide: true,
    color: "danger",
    block: false,
    shadow: true,
    class: undefined,
    badgeClass: undefined,
    ui: undefined
  }
)

defineSlots<{
  default:() => ComponentSlot
  content: () => ComponentSlot
}>()

const { ui } = useUi("badge", props, { color: toRef(props, "color") })

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    props.block ? ui.value.block : ui.value.inline,
    props.class
  )
})
const _badgeClass = computed(() => {
  return classMerge(
    ui.value.badge,
    props.shadow && ui.value.shadow,
    props.badgeClass
  )
})

const displayContent = computed(() => {
  const content = props.content
  if (content === undefined) return undefined
  if (typeof content === "number") {
    return content > props.max ? `${props.max}+` : content
  } else if (typeof content === "string" && /^\d+$/.test(content)) {
    return parseInt(content) > props.max ? `${props.max}+` : content
  } else {
    return content
  }
})
</script>
