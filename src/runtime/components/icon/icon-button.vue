<template>
  <button
    ref="buttonRef"
    :class="buttonClass"
    :disabled="disabled"
    :tabindex="tabindex"
    :type="buttonType"
    v-bind="$attrs"
    @click="clickHandle"
    @mousedown="mousedownHandle"
  >
    <div :class="ui.content">
      <v-icon :icon="icon" />
    </div>
  </button>
</template>

<script setup lang="ts">
import VIcon from "./icon.vue"

import useUi from "../../composables/use-ui"
import useInheritedSize from "../../composables/use-inherited-size"
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useClickRipple from "../../composables/use-click-ripple"

import classMerge from "../../utils/class-merge"
import { ref, toRef, computed } from "vue"

import type {
  DeepPartial,
  Color,
  ClassNameValue,
  Size,
  UI,
  IconComponent
} from "../../types"
const buttonRef = ref<HTMLButtonElement>()

interface ButtonProps {
  /** 容器类名 */
  class?: ClassNameValue
  /** 组件样式配置 */
  ui?: DeepPartial<UI["iconButton"]>
  /** 原生tabindex */
  tabindex?: string | number
  /** 原生type */
  buttonType?: "reset" | "submit" | "button"
  /** 点击获得焦点 */
  clickFocus?: boolean
  /** 类型 */
  type?: keyof UI["iconButton"]["type"]
  /** 大小 */
  size?: Size
  /** 图标按钮 */
  icon: IconComponent
  /** 颜色 */
  color?: Color
  /** 阴影 */
  shadow?: boolean
  /** 边框 */
  border?: boolean
  /** 圆形 */
  rounded?: boolean
  /** 禁用 */
  disabled?: boolean
}
const props = withDefaults(defineProps<ButtonProps>(), {
  class: undefined,
  ui: undefined,
  tabindex: 0,
  buttonType: "button",
  clickFocus: true,
  type: "text",
  size: undefined,
  color: "natural",
  shadow: false,
  border: false,
  rounded: true,
  icon: undefined,
  disabled: undefined
})

const emits = defineEmits<{
  click: [event: MouseEvent]
  mousedown: [event: MouseEvent]
}>()

const { ui } = useUi("iconButton", props, { color: toRef(props, "color") })
const { size } = useInheritedSize(props)
const { disabled } = useInheritedDisabled(props)
useClickRipple(buttonRef, {
  disabled: computed(() => disabled.value)
})

const buttonClass = computed(() => {
  const isEnable = !disabled.value
  return classMerge(
    ui.value.base,
    ui.value.size[size.value],
    ui.value.type[props.type],
    props.shadow && ui.value.shadow,
    props.border && ui.value.border,
    props.rounded && ui.value.rounded,
    isEnable ? ui.value.enabled[props.type] : ui.value.disabled,
    props.class
  )
})

const clickHandle = (event: MouseEvent) => {
  if (!props.clickFocus) event.preventDefault()
  emits("click", event)
}
const mousedownHandle = (event: MouseEvent) => {
  if (!props.clickFocus) event.preventDefault()
  emits("mousedown", event)
}

defineExpose({ reference: buttonRef })
</script>
