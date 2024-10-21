<template>
  <div ref="footerRef" :class="containerClass">
    <slot :validate="validate" :clear-validate="clearValidate" />
  </div>
</template>

<script setup lang="ts">
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { FORM_INJECTION } from "../../utils/injection-keys"
import { ref, computed, inject } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ComponentSlot,
  UI
} from "../../types"

const footerRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["formFooter"]>
  }>(),
  {
    class: undefined,
    ui: undefined
  }
)
defineSlots<{
  default:(props: {
    validate: () => Promise<boolean>
    clearValidate: () => void
  }) => ComponentSlot
}>()

const { ui } = useUi("formFooter", props)

const { validate, clearValidate } = inject(FORM_INJECTION)!

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})
</script>
