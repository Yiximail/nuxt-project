<template>
  <div :class="containerClass">
    <template v-if="$slots.header">
      <slot name="header" />
      <v-divider />
    </template>
    <v-scrollbar-native :class="ui.content">
      <slot />
    </v-scrollbar-native>
    <template v-if="$slots.footer">
      <v-divider />
      <slot name="footer" />
    </template>
  </div>
</template>

<script setup lang="ts">
import VScrollbarNative from "../scrollbar/scrollbar-native.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { computed } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ComponentSlot,
  UI
} from "../../types"

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["dropdownPopper"]>
  }>(),
  {
    class: undefined,
    ui: undefined
  }
)

defineSlots<{
  header:() => ComponentSlot
  default: () => ComponentSlot
  footer: () => ComponentSlot
}>()

const { ui } = useUi("dropdownPopper", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})
</script>
