<template>
  <div :class="containerClass" @click="$emit('select-file')">
    <v-icon icon="mdi:plus" :class="ui.icon" />
    <div v-if="label" :class="ui.label">
      {{ label }}
    </div>
    <div :class="ui.count">
      {{ count }}/{{ maxlength }}
    </div>
  </div>
</template>

<script setup lang="ts">
import VIcon from "../icon/icon.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { computed } from "vue"

import type { DeepPartial, ClassNameValue, UI } from "../../types"

const props = defineProps<{
  /** 容器类名 */
  class?: ClassNameValue
  /** 组件样式配置 */
  ui?: DeepPartial<UI["uploaderImageInsert"]>
  /** 当前数量 */
  count: number
  /** 最大数量 */
  maxlength: number
  /** 文字标签 */
  label?: string
}>()

defineEmits<{
  "select-file": []
}>()

const { ui } = useUi("uploaderImageInsert", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})
</script>

<style scoped>
.v-uploader-item-progress-enter-active,
.v-uploader-item-progress-leave-active {
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-uploader-item-progress-enter-from,
.v-uploader-item-progress-leave-to {
  opacity: 0;
  transform: translateY(1px);
}
</style>
