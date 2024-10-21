<template>
  <div
    ref="itemRef"
    :class="containerClass"
    v-bind="$attrs"
    @click="clickHandle"
  >
    <span :class="ui.label">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
import useClickRipple from "../../composables/use-click-ripple"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed } from "vue"

import type { DeepPartial, ClassNameValue, UI } from "../../types"

const itemRef = ref<HTMLDivElement>()

const props = defineProps<{
  /** 容器类名 */
  class?: ClassNameValue
  /** 组件样式配置 */
  ui?: DeepPartial<UI["inputTimePickerItem"]>
  /** 选中 */
  selected?: boolean
  /** 禁用 */
  disabled?: boolean
}>()

const emits = defineEmits<{
  click: []
}>()

const { ui } = useUi("inputTimePickerItem", props)

const isDisabled = computed(() => {
  return props.disabled || false
})

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    !isDisabled.value ? ui.value.clickable : ui.value.clickable,
    props.selected && ui.value.selected,
    props.class
  )
})

useClickRipple(itemRef, {
  type: "click-position",
  disabled: isDisabled
})

const clickHandle = () => {
  if (isDisabled.value) return
  emits("click")
}
</script>
