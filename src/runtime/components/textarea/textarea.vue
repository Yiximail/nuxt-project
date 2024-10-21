<template>
  <div
    ref="containerRef"
    :class="containerClass"
    v-bind="fieldsetAttrs"
    @click="clickHandle"
  >
    <div ref="referenceRef" :class="referenceClass" :style="referenceStyle">
      {{ `${textareaValue}\n` }}
    </div>
    <textarea
      ref="textareaRef"
      :disabled="disabled"
      :class="textareaClass"
      :style="textareaStyle"
      :placeholder="placeholder"
      :value="textareaValue"
      :maxlength="maxlength"
      :rows="minRows"
      v-bind="$attrs"
      @input="inputHandle"
      @focus="focusHandle"
      @blur="blurHandle"
    />
    <div v-if="isShowLimit && !disabled && countText" :class="ui.count">
      {{ countText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import useInheritedSize from "../../composables/use-inherited-size"
import useInheritedDisabled from "../../composables/use-inherited-disabled"
import useFieldset from "../../composables/use-fieldset"
import useResizeObserver from "../../composables/use-resize-observer"
import useFormItem from "../../composables/use-form-item"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed, watch, toRef, nextTick, onMounted } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ValidateOptions,
  Size,
  UI
} from "../../types"
import type { CSSProperties } from "vue"

const containerRef = ref<HTMLDivElement>()
const referenceRef = ref<HTMLDivElement>()
const textareaRef = ref<HTMLTextAreaElement>()

const props = withDefaults(
  defineProps<{
    modelValue?: string
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["textarea"]>
    /** 禁用 */
    disabled?: boolean
    /** 占位符 */
    placeholder?: string
    /** 最大长度 */
    maxlength?: number
    /** 是否显示限制长度 */
    isShowLimit?: boolean
    /** 大小 */
    size?: Size
    /** 格式化 */
    formatter?: {
      /** 从input中获取时转换 */
      get:(val: string) => string
      /** 设置到input中时转换 */
      set: (val: string) => string
    }
    /** 最小行数 */
    minRows?: number
    /** 最大行数 */
    maxRows?: number
    /** 自动调整 */
    autoSize?: boolean
    /** 可手动调整大小 */
    resizeable?: boolean
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
    size: undefined,
    formatter: () => ({
      get: (val) => val,
      set: (val) => val
    }),
    minRows: 2,
    maxRows: 6,
    autoSize: true,
    resizeable: false,
    autoFocus: false,
    focusIgnoreChange: true
  }
)

const emits = defineEmits<{
  "update:model-value": [val: string]
  input: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const { ui } = useUi("textarea", props)
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
const referenceClass = computed(() => {
  return classMerge(ui.value.reference, ui.value.textarea)
})
const textareaClass = computed(() => {
  return classMerge(
    ui.value.textarea,
    !props.resizeable && ui.value.unresizeable
  )
})

const countText = computed(() => {
  if (props.maxlength === undefined) return
  const length = props.modelValue?.length ?? 0
  return `${length}/${props.maxlength}`
})

const activeTextarea = () => {
  if (disabled.value) return
  textareaRef.value?.focus()
}
const clickHandle = (event: MouseEvent) => {
  if (!textareaRef.value || !containerRef.value) return
  const path = event.composedPath()
  for (const el of path) {
    if (el === textareaRef.value) return
    if (el instanceof HTMLButtonElement) return
    if (el === containerRef.value) {
      textareaRef.value.focus()
      return
    }
  }
}

const textareaValue = ref("")
const getTextareaValue = () => {
  return props.formatter.get(textareaValue.value)
}
const setTextareaValue = (val: string) => {
  updateHeight()
  textareaValue.value = props.formatter.set(val)
}
const updateModelValue = (val: string) => {
  emits("update:model-value", val)
}

const textareaWidth = ref(0)
const referenceHeight = ref(0)
const minHeight = ref<number>()
const maxHeight = ref<number>()
const textareaStyle = computed(() => {
  const style: CSSProperties = {}
  if (props.autoSize && referenceHeight.value) {
    style.height = `${referenceHeight.value}px`
  }
  if (minHeight.value) style.minHeight = `${minHeight.value}px`
  if (maxHeight.value && !props.resizeable) {
    style.maxHeight = `${maxHeight.value}px`
  }
  return style
})
const referenceStyle = computed(() => {
  const style: CSSProperties = {}
  style.width = `${textareaWidth.value}px`
  if (maxHeight.value && !props.resizeable) {
    style.maxHeight = `${maxHeight.value}px`
  }
  return style
})

const updateHeight = async () => {
  const reference = referenceRef.value
  const textarea = textareaRef.value
  if (!reference || !textarea) return
  requestAnimationFrame(() => {
    referenceHeight.value = reference.getBoundingClientRect().height
    const styles = window.getComputedStyle(textarea)
    const border =
      parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth)
    const padding =
      parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom)
    const lineHeight = parseFloat(styles.lineHeight)
    minHeight.value = props.minRows
      ? border + padding + lineHeight * props.minRows
      : undefined
    maxHeight.value = props.maxRows
      ? border + padding + lineHeight * props.maxRows
      : undefined
  })
}

const resizeCallback = () => {
  if (!textareaRef.value) return
  const textareaRect = textareaRef.value.getBoundingClientRect()
  textareaWidth.value = textareaRect.width
  updateHeight()
}
useResizeObserver(textareaRef, resizeCallback)
onMounted(() => {
  watch(
    () => props.modelValue,
    (val) => {
      if (props.focusIgnoreChange && isFocusing) return
      const formatedVal = props.formatter.get(val ?? "")
      if (getTextareaValue() === formatedVal) return
      setTextareaValue(formatedVal)
      updateModelValue(formatedVal)
    },
    { immediate: true }
  )
  watch(() => [props.minRows, props.maxRows], updateHeight)
  // 这里等watch执行完
  nextTick(() => {
    if (props.autoFocus) activeTextarea()
  })
})

const inputHandle = (event: Event) => {
  if (!textareaRef.value) return
  const newValue = props.formatter.get(textareaRef.value.value)
  textareaValue.value = newValue
  setTextareaValue(newValue)
  updateModelValue(newValue)
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
const { formEmits } = useFormItem(validate, activeTextarea)

defineExpose({ reference: referenceRef, textarea: textareaRef })
</script>
