<template>
  <tr :class="classes.headRow">
    <template v-for="(column, i) in displayColumns" :key="column.label">
      <th
        v-if="column.fixed === 'left'"
        :class="[leftShadowClass, leftShadowIndex === i ? 'show' : '']"
        :style="column.shadowStyle"
      />
      <th
        v-else-if="column.fixed === 'right'"
        :class="[rightShadowClass, rightShadowIndex === i ? 'show' : '']"
        :style="column.shadowStyle"
      />
      <v-table-head-cell
        :column="column"
        :index="i"
        @observe="thMountedHandle"
        @unobserve="thUnmountedHandle"
      />
    </template>
  </tr>
</template>

<script setup lang="ts">
import classMerge from "../../utils/class-merge"
import { TABLE_INJECTION } from "../../utils/injection-keys"
import { computed, inject, onBeforeUnmount } from "vue"

const emits = defineEmits<{
  resize: []
}>()

const { classes, leftShadowIndex, rightShadowIndex, displayColumns, columns } =
  inject(TABLE_INJECTION)!

const leftShadowClass = computed(() => {
  return classMerge(classes.value.shadowContainer, classes.value.leftShadow)
})
const rightShadowClass = computed(() => {
  return classMerge(classes.value.shadowContainer, classes.value.rightShadow)
})

let observerInstance: ResizeObserver | undefined
const resizeCallback = (entries: ResizeObserverEntry[]) => {
  for (const entry of entries) {
    const label = entry.target.getAttribute("data-column-label")
    const column = columns.value.find((column) => column.label === label)
    // if (column) column.realWidth = entry.target.getBoundingClientRect().width
    const val = entry.borderBoxSize[0]
    if (column) column.realWidth = val.inlineSize
  }
  emits("resize")
}
const thMountedHandle = (el: HTMLElement) => {
  if (!observerInstance) {
    observerInstance = new ResizeObserver(resizeCallback)
  }
  observerInstance.observe(el)
}
const thUnmountedHandle = (el: HTMLElement) => {
  observerInstance?.unobserve(el)
}
onBeforeUnmount(() => {
  observerInstance?.disconnect()
})
</script>
