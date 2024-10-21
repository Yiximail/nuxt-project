<template>
  <span class="hidden" />
</template>

<script setup lang="ts">
import { TABLE_INJECTION } from "../../utils/injection-keys"
import { inject, watch, watchEffect, onBeforeUnmount } from "vue"

import type { ComponentSlot, ClassNameValue, TableItem } from "../../types"

const props = withDefaults(
  defineProps<{
    /** 表头，唯一标识，默认为head显示内容 */
    label: string
    /** 列宽度 */
    width?: string
    /** 默认是否显示 */
    show?: boolean
    /** 固定位置 */
    fixed?: "left" | "right"
    /** 显示字段 */
    prop?: string
    /** 排序的字段 */
    sortKey?: string
    /** 头部样式 */
    headClass?: ClassNameValue
    /** 头部容器类 */
    headContentClass?: ClassNameValue
    /** 单元格样式 */
    class?: ClassNameValue
  }>(),
  {
    width: undefined,
    show: true,
    fixed: undefined,
    prop: undefined,
    sortKey: undefined,
    headClass: undefined,
    headContentClass: undefined,
    class: undefined
  }
)

const slots = defineSlots<{
  head:() => ComponentSlot
  default: (props: { row: TableItem }) => ComponentSlot
}>()
const { setColumn, removeColumn } = inject(TABLE_INJECTION)!
const update = () => {
  setColumn({
    label: props.label,
    type: "default",
    width: props.width,
    show: props.show,
    fixed: props.fixed,
    prop: props.prop,
    sortKey: props.sortKey,
    headCellClass: props.headClass,
    headContentClass: props.headContentClass,
    bodyCellClass: props.class,
    slots: {
      head: slots.head,
      default: slots.default
    }
  })
}
watch(
  () => props.label,
  (newVal, oldVal) => {
    if (!oldVal || newVal === oldVal) return
    removeColumn(oldVal)
  }
)

watchEffect(update)
update()

onBeforeUnmount(() => {
  removeColumn(props.label)
})
</script>
