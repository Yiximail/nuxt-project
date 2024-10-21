<template>
  <div ref="containerRef" :class="containerClass" v-bind="fieldsetAttrs">
    <label
      v-if="$slots.default"
      :class="labelClass"
      @click="toggleHandle"
      @mousedown="mousedownHandle"
    >
      <slot />
    </label>
    <div ref="contentRef" :class="checkboxClass" @click="toggleHandle">
      <input
        :class="inputClass"
        type="checkbox"
        :checked="inputValue"
        :disabled="disabled"
        :tabindex="tabindex"
      >
      <transition name="v-fade">
        <v-icon v-show="inputValue" :icon="ui.checkIcon" />
      </transition>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="GenericValue extends boolean | number | string"
>
import VIcon from "../icon/icon.vue"
import useInheritedSize from "../../composables/use-inherited-size"
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useFieldset from "../../composables/use-fieldset"
import useClickRipple from "../../composables/use-click-ripple"
import useFormItem from "../../composables/use-form-item"

import { ref, computed } from "vue"
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"

import type {
  DeepPartial,
  ClassNameValue,
  ValidateOptions,
  Size,
  UI
} from "../../types"

const containerRef = ref<HTMLDivElement>()
const contentRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    modelValue?: GenericValue[]
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["checkboxGroup"]>
    /** 大小 */
    size?: Size
    /** 禁用 */
    disabled?: boolean
    /** 判断的值 */
    value?: GenericValue
    /** 原生tabindex */
    tabindex?: string | number
    /** 涟漪效果 */
    ripple?: boolean
  }>(),
  {
    modelValue: undefined,
    class: undefined,
    ui: undefined,
    size: undefined,
    disabled: undefined,
    // eslint-disable-next-line
    // @ts-ignore-next-line
    value: true,
    tabindex: 0,
    ripple: true
  }
)

const emits = defineEmits<{
  "update:model-value": [val: GenericValue[]]
  change: []
}>()

const { ui } = useUi("checkboxGroup", props)
const { size } = useInheritedSize(props)
const { disabled } = useInheritedDisabled(props)
const { fieldsetAttrs } = useFieldset({ value: ref(true), disabled })
const { mousedownHandle } = useClickRipple(contentRef, {
  type: "center",
  size: "1.6em",
  disabled: computed(() => disabled.value || !props.ripple)
})

const inputValue = computed(() => {
  const value = props.value as GenericValue
  return props.modelValue?.includes(value)
})
const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    props.ripple && ui.value.ripple.container,
    ui.value.size[size.value],
    inputValue.value
      ? ui.value.actived.container
      : ui.value.inactived.container,
    !disabled.value ? ui.value.enabled.container : ui.value.disabled.container,
    props.class
  )
})
const checkboxClass = computed(() => {
  return classMerge(
    ui.value.checkbox,
    props.ripple && ui.value.ripple.checkbox,
    inputValue.value ? ui.value.actived.checkbox : ui.value.inactived.checkbox,
    !disabled.value ? ui.value.enabled.checkbox : ui.value.disabled.checkbox
  )
})
const inputClass = computed(() => {
  return classMerge(
    ui.value.input,
    inputValue.value ? ui.value.actived.input : ui.value.inactived.input,
    !disabled.value ? ui.value.enabled.input : ui.value.disabled.input
  )
})
const labelClass = computed(() => {
  return classMerge(
    ui.value.label,
    inputValue.value ? ui.value.actived.label : ui.value.inactived.label,
    !disabled.value ? ui.value.enabled.label : ui.value.disabled.label
  )
})

const toggleHandle = () => {
  if (disabled.value) return
  const value = props.value as GenericValue
  if (!props.modelValue) {
    emits("update:model-value", [value])
  } else {
    const index = props.modelValue.indexOf(value)
    if (index === -1) {
      emits("update:model-value", [...props.modelValue, value])
    } else {
      const newGroup = props.modelValue.slice()
      newGroup.splice(index, 1)
      emits("update:model-value", newGroup)
    }
  }
  emits("change")
  formEmits?.("change")
}

const validate = async (options: ValidateOptions) => {
  const value = props.modelValue
  if (options.required) {
    if (!value?.length) {
      if (options.requiredError) return options.requiredError
      if (options.label) return `请选择${options.label}`
      return "请选择"
    }
  }
  return undefined
}
const { formEmits } = useFormItem(validate)

defineExpose({ reference: containerRef })
</script>
