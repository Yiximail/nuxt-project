<template>
  <div :class="containerClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { computed } from "vue"

import type { DeepPartial, ClassNameValue, UI } from "../../types"

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["formInfo"]>
  }>(),
  {
    class: undefined,
    ui: undefined
  }
)

const { ui } = useUi("formInfo", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})
</script>
