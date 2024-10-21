<template>
  <v-button
    ref="buttonRef"
    :class="buttonClass"
    :disabled="disabled"
    :tabindex="tabindex"
    v-bind="fieldsetAttrs"
    :color="color"
    :type="inputValue ? 'base' : 'text'"
    :size="size"
    :shadow="false"
    border
    @click="clickHandle"
    @mousedown="mousedownHandle"
  >
    <slot>
      {{ label }}
    </slot>
  </v-button>
</template>

<script
  setup
  lang="ts"
  generic="GenericValue extends boolean | number | string"
>
import VButton from "../button/button.vue"
import useInheritedSize from "../../composables/use-inherited-size"
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useFieldset from "../../composables/use-fieldset"
import useFormItem from "../../composables/use-form-item"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed } from "vue"

import type {
  DeepPartial,
  Color,
  ClassNameValue,
  ValidateOptions,
  Size,
  UI,
  IconComponent
} from "../../types"

const buttonRef = ref<HTMLButtonElement>()

const props = withDefaults(
  defineProps<{
    modelValue?: GenericValue
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["radioButton"]>
    /** 原生tabindex */
    tabindex?: string | number
    /** 点击获得焦点 */
    clickFocus?: boolean
    /** 大小 */
    size?: Size
    /** 颜色 */
    color?: Color
    /** 边框 */
    border?: boolean
    /** 圆形 */
    rounded?: boolean
    /** 图标按钮 */
    icon?: IconComponent
    /** 禁用 */
    disabled?: boolean
    /** 判断的值 */
    value?: GenericValue
    /** 标签 */
    label?: string
  }>(),
  {
    modelValue: undefined,
    class: undefined,
    ui: undefined,
    tabindex: 0,
    clickFocus: false,
    size: undefined,
    color: "primary",
    rounded: false,
    icon: undefined,
    disabled: undefined,
    value: undefined,
    label: ""
  }
)

const emits = defineEmits<{
  "update:model-value": [val: GenericValue]
  click: [event: MouseEvent]
  mousedown: [event: MouseEvent]
  change: []
}>()

const { ui } = useUi("radioButton", props)
const { size } = useInheritedSize(props)
const { disabled } = useInheritedDisabled(props)
const { fieldsetAttrs } = useFieldset({ value: ref(true), disabled })

const inputValue = computed(() => props.modelValue === props.value)

const buttonClass = computed(() => {
  return classMerge(
    ui.value.base,
    ui.value.size[size.value],
    props.rounded && ui.value.rounded,
    props.class
  )
})

const clickHandle = (event: MouseEvent) => {
  if (disabled.value) return
  if (!props.clickFocus) event.preventDefault()
  const value = props.value as GenericValue
  emits("update:model-value", value)
  emits("click", event)
  emits("change")
  formEmits?.("change")
}
const mousedownHandle = (event: MouseEvent) => {
  if (!props.clickFocus) event.preventDefault()
  emits("mousedown", event)
}

const validate = async (options: ValidateOptions) => {
  const value = props.modelValue
  if (options.required) {
    if (value === undefined) {
      if (options.requiredError) return options.requiredError
      if (options.label) return `请选择${options.label}`
      return "请选择"
    }
  }
  return undefined
}
const { formEmits } = useFormItem(validate)

defineExpose({ reference: buttonRef })
</script>
