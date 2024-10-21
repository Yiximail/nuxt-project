<template>
  <v-button
    :class="buttonClass"
    type="plain"
    :shadow="false"
    size="sm"
    :color="key === sortKey ? 'primary' : 'natural'"
    @click="handleSort"
  >
    <v-icon v-if="key !== sortKey" icon="mdi:arrow-up-down" class="h-4 w-4" />
    <v-icon
      v-else
      icon="mdi:arrow-down"
      class="h-4 w-4 transition-transform"
      :class="order === 'asc' ? 'rotate-180' : ''"
    />
  </v-button>
</template>

<script setup lang="ts">
import VIcon from "../icon/icon.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { TABLE_INJECTION } from "../../utils/injection-keys"
import { computed, inject } from "vue"

import type { ClassNameValue, DeepPartial, UI } from "../../types"

const props = withDefaults(
  defineProps<{
    /** 排序字段 */
    sortKey: string
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["tableSort"]>
  }>(),
  {
    class: undefined,
    ui: undefined
  }
)

const { ui } = useUi("tableSort", props)

const buttonClass = computed(() => {
  return classMerge(ui.value.button, props.class)
})

const {
  sortKey: key,
  sortOrder: order,
  updateSortKey,
  updateSortOrder,
  refresh
} = inject(TABLE_INJECTION)!

const handleSort = () => {
  if (key.value !== props.sortKey) {
    updateSortKey(props.sortKey)
    updateSortOrder("desc")
  } else {
    updateSortOrder(order.value === "asc" ? "desc" : "asc")
  }
  refresh()
}
</script>
