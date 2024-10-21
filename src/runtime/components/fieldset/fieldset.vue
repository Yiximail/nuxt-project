<template>
  <fieldset ref="containerRef" :class="containerClass">
    <slot :content-class="contentClass" />
    <template v-if="label || $slots.label">
      <legend :class="legendClass">
        <slot name="label">
          {{ label }}
        </slot>
      </legend>
      <label
        :class="labelClass"
        :style="{
          '--label-x': offsetX,
          '--label-y': offsetY,
          '--active-label-x': activeOffsetX,
          '--active-label-y': activeOffsetY
        }"
      >
        <div :class="labelTextClass">
          <slot name="label">
            {{ label }}
          </slot>
        </div>
      </label>
    </template>
    <input
      v-if="alwaysShow || (!label && !$slots.label)"
      type="hidden"
      :data-is-active="alwaysShow || (!label && !$slots.label)"
    >
  </fieldset>
</template>

<script setup lang="ts">
import useUi from "../../composables/use-ui"
import useInheritedSize from "../../composables/use-inherited-size"
import classMerge from "../../utils/class-merge"
import { FIELDSET_INJECTION } from "../../utils/injection-keys"
import { ref, computed, provide } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  FormValidateStatus,
  ComponentSlot,
  Size,
  UI
} from "../../types"

const containerRef = ref<HTMLFieldSetElement>()

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["fieldset"]>
    /** 变体 */
    type?: "outline" | "underline" | "none"
    /** 大小 */
    size?: Size
    /** 外置label */
    outset?: boolean
    /** 标签 */
    label?: string
    /** 一直显示 */
    alwaysShow?: boolean
    /** 表单状态 */
    status?: FormValidateStatus
    /** Label初始偏移量 */
    offsetX?: string | number
    offsetY?: string | number
    /** Label激活后偏移量 */
    activeOffsetX?: string | number
    activeOffsetY?: string | number
  }>(),
  {
    class: undefined,
    ui: undefined,
    type: "outline",
    size: undefined,
    outset: false,
    label: undefined,
    alwaysShow: false,
    status: undefined,
    offsetX: undefined,
    offsetY: undefined,
    activeOffsetX: undefined,
    activeOffsetY: undefined
  }
)

defineSlots<{
  default:() => ComponentSlot
  label: () => ComponentSlot
}>()

const { ui } = useUi("fieldset", props)
const { size } = useInheritedSize(props)

const formStatus = computed(() => {
  if (props.status === "success") return "success"
  if (props.status === "warning") return "warning"
  return props.status ? "error" : undefined
})
const containerClass = computed(() => {
  return classMerge(
    "v-fieldset",
    ui.value.container,
    ui.value[props.type].container,
    props.outset && ui.value[props.type].outset,
    ui.value.size[size.value],
    formStatus.value
      ? ui.value.status[formStatus.value]
      : ui.value.status.default,
    props.class
  )
})
const contentClass = computed(() => {
  return classMerge(
    "v-fieldset-content",
    ui.value[props.type].content,
    ui.value.content
  )
})
const labelClass = computed(() => {
  return classMerge(
    ui.value[props.type].label,
    ui.value.label
  )
})
const labelTextClass = computed(() => {
  return classMerge(ui.value[props.type].labelText, ui.value.labelText)
})
const legendClass = computed(() => {
  return classMerge(ui.value[props.type].legend, ui.value.legend)
})

provide(FIELDSET_INJECTION, {
  contentClass,
  container: containerRef
})
</script>
