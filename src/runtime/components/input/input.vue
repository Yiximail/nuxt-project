<template>
  <div
    ref="containerRef"
    :class="containerClass"
    v-bind="fieldsetAttrs"
    @click="clickHandle"
  >
    <input
      ref="inputRef"
      :class="ui.input"
      :disabled="disabled"
      :placeholder="placeholder"
      :value="inputValue"
      :type="inputType"
      :maxlength="maxlength"
      autocomplete="off"
      v-bind="$attrs"
      @input="inputHandle"
      @focus="focusHandle"
      @blur="blurHandle"
    >
    <span v-if="isShowLimit && !disabled && countText" :class="ui.count">
      {{ countText }}
    </span>
    <v-icon-button
      v-show="isShowClearButton"
      :class="ui.clearButton"
      :size="size"
      icon="mdi:close"
      @click="clearHandle"
    />
    <v-icon-button
      v-if="type === 'password'"
      v-show="isShowPasswordButton"
      :class="ui.password"
      :size="size"
      :icon="isShowPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'"
      @click="isShowPassword = !isShowPassword"
    />
  </div>
</template>

<script setup lang="ts">
import VIconButton from "../icon/icon-button.vue"
import useInheritedSize from "../../composables/use-inherited-size"
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useFieldset from "../../composables/use-fieldset"
import useFormItem from "../../composables/use-form-item"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, toRef, computed, watch, nextTick, onMounted } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ValidateOptions,
  Size,
  UI
} from "../../types"

const containerRef = ref<HTMLDivElement>()
const inputRef = ref<HTMLInputElement>()

const props = withDefaults(
  defineProps<{
    modelValue?: string
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["input"]>
    /** 禁用 */
    disabled?: boolean
    /** 占位符 */
    placeholder?: string
    /** 最大长度 */
    maxlength?: number
    /** 是否显示限制长度 */
    isShowLimit?: boolean
    /** input的类型 */
    type?: "text" | "password"
    /** 大小 */
    size?: Size
    /** 格式化 */
    formatter?: {
      /** 从input中获取时转换 */
      get:(val: string | undefined) => string
      /** 设置到input中时转换 */
      set: (val: string | undefined) => string
    }
    /** 是否可以清除 */
    clearable?: boolean
    /** 输入时更新 */
    updateAtInput?: boolean
    /** 自动获得焦点 */
    autoFocus?: boolean
    /** 获得焦点时是否忽略外部变化 */
    focusIgnoreChange?: boolean
  }>(),
  {
    modelValue: undefined,
    class: undefined,
    ui: undefined,
    disabled: undefined,
    placeholder: undefined,
    maxlength: undefined,
    isShowLimit: true,
    type: "text",
    size: undefined,
    formatter: () => ({
      get: (val) => val ?? "",
      set: (val) => val ?? ""
    }),
    clearable: true,
    updateAtInput: true,
    autoFocus: false,
    focusIgnoreChange: true
  }
)

const emits = defineEmits<{
  "update:model-value": [val: string | undefined]
  input: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const { ui } = useUi("input", props)
const { size } = useInheritedSize(props)
const { disabled } = useInheritedDisabled(props)
const { fieldsetContentClass, fieldsetAttrs } = useFieldset({
  value: toRef(props, "modelValue"),
  disabled
})

const containerClass = computed(() => {
  return classMerge(
    fieldsetContentClass?.value,
    ui.value.container,
    ui.value.size[size.value],
    props.class
  )
})

const isShowClearButton = computed(() => {
  if (!props.clearable) return false
  if (disabled.value) return false
  if (!props.modelValue) return false
  return true
})

const countText = computed(() => {
  if (props.maxlength === undefined) return
  if (typeof props.modelValue !== "string") return
  const length = props.modelValue.length ?? 0
  return `${length}/${props.maxlength}`
})

const isShowPassword = ref(false)
const isShowPasswordButton = computed(() => {
  if (disabled.value) return false
  if (!props.modelValue) return false
  return true
})
const inputType = computed(() => {
  switch (props.type) {
    case "password":
      return isShowPassword.value ? "text" : "password"
    case "text":
    default:
      return "text"
  }
})

const activeInput = () => {
  if (disabled.value) return
  inputRef.value?.focus()
}
const clickHandle = (event: MouseEvent) => {
  if (disabled.value) return
  if (!inputRef.value || !containerRef.value) return
  const path = event.composedPath()
  for (const el of path) {
    if (el === inputRef.value) return
    if (el instanceof HTMLButtonElement) return
    if (el === containerRef.value) {
      activeInput()
      return
    }
  }
}

const inputValue = ref("")
const getInputValue = () => {
  return props.formatter.get(inputValue.value)
}
const setInputValue = (val: string) => {
  inputValue.value = props.formatter.set(val)
}
const updateModelValue = (val: string | undefined) => {
  const value = props.formatter.set(val)
  emits("update:model-value", value)
}

onMounted(() => {
  setInputValue(props.modelValue ?? "")
  watch(
    () => props.modelValue,
    (val) => {
      if (props.focusIgnoreChange && isFocusing) return
      const formatedVal = props.formatter.get(val ?? "")
      if (getInputValue() === formatedVal) return
      setInputValue(formatedVal)
      updateModelValue(formatedVal)
    },
    { immediate: true }
  )
  // 这里等watch执行完
  nextTick(() => {
    if (props.autoFocus) activeInput()
  })
})

const inputHandle = (event: Event) => {
  if (!inputRef.value) return
  const newValue = props.formatter.get(inputRef.value.value)
  inputValue.value = newValue
  setInputValue(newValue)
  if (props.updateAtInput) updateModelValue(newValue)
  emits("input", event)
  formEmits?.("input")
}

let isFocusing = false
const focusHandle = (event: FocusEvent) => {
  isFocusing = true
  emits("focus", event)
  formEmits?.("focus")
}
const blurHandle = (event: FocusEvent) => {
  isFocusing = false
  emits("blur", event)
  formEmits?.("blur")
}

const clearHandle = () => {
  setInputValue("")
  updateModelValue(undefined)
  inputRef.value?.focus()
}

const validate = async (options: ValidateOptions) => {
  const value = props.modelValue
  if (options.required) {
    if (!value) {
      if (options.requiredError) return options.requiredError
      if (options.label) return `请输入${options.label}`
      return "请输入"
    }
  }
  if (options.regexp) {
    if (!options.regexp.test(value ?? "")) {
      if (options.regexpError) return options.regexpError
      if (options.label) return `${options.label}格式不正确`
      return "格式不正确"
    }
  }
}
const { formEmits } = useFormItem(validate, activeInput)

defineExpose({ reference: containerRef })
</script>
