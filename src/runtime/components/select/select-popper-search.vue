<template>
  <div :class="containerClass">
    <span :class="ui.icon">
      <v-icon icon="mdi:magnify" />
    </span>
    <input
      ref="inputRef"
      :class="ui.input"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :value="inputValue"
      autocomplete="off"
      @input="inputHandle"
      @keydown.enter="searchHandle"
    >
  </div>
</template>

<script setup lang="ts">
import VIcon from "../icon/icon.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, watch, onMounted, computed } from "vue"

import type { DeepPartial, ClassNameValue, UI } from "../../types"

const inputRef = ref<HTMLInputElement>()

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["selectPopperSearch"]>
    /** 输入框值 */
    modelValue?: string
    /** 输入框占位符 */
    placeholder?: string
    /** 输入框最大长度 */
    maxlength?: number
    /** 输入搜索延迟 */
    delay?: number
  }>(),
  {
    class: undefined,
    ui: undefined,
    modelValue: "",
    placeholder: undefined,
    maxlength: undefined,
    delay: 300
  }
)

const emits = defineEmits<{
  "update:model-value": [val: string]
  search: [keywords: string]
}>()

const { ui } = useUi("selectPopperSearch", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})

const inputValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    if (val !== inputValue.value) {
      inputValue.value = val
    }
  }
)

let timer: number | undefined
const inputHandle = () => {
  if (!inputRef.value) return
  const value = inputRef.value.value
  inputValue.value = value
  clearTimeout(timer)
  if (props.delay === 0) {
    searchHandle()
  } else {
    timer = window.setTimeout(searchHandle, props.delay)
  }
}
const searchHandle = () => {
  clearTimeout(timer)
  emits("update:model-value", inputValue.value)
  emits("search", inputValue.value)
}

onMounted(() => {
  requestAnimationFrame(() => {
    inputRef.value?.focus()
  })
})
</script>
