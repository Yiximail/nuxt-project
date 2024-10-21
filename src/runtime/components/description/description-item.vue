<template>
  <span class="hidden" />
</template>

<script setup lang="ts">
import { DESCRIPTION_INJECTION } from "../../utils/injection-keys"
import guid from "../../utils/guid"
import { watch, onBeforeUnmount, inject, toRefs } from "vue"

import type { ClassNameValue, ComponentSlot } from "../../types"

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    itemClass?: ClassNameValue
    /** 标签类名 */
    labelClass?: ClassNameValue
    /** 内容类名 */
    class?: ClassNameValue
    /** 占据列数 */
    span?: number
    /** 标签 */
    label?: string
    /** 内容 */
    content?: string
  }>(),
  {
    itemClass: undefined,
    labelClass: undefined,
    class: undefined,
    span: 1,
    label: "",
    content: ""
  }
)

const slots = defineSlots<{
  label:() => ComponentSlot
  default: () => ComponentSlot
}>()

const {
  label,
  span,
  content,
  itemClass,
  labelClass,
  class: className
} = toRefs(props)

const { setItem, removeItem } = inject(DESCRIPTION_INJECTION)!
const id = guid()
const update = () => {
  setItem({
    id,
    label: label.value,
    span: span.value,
    content: content.value,
    itemClass: itemClass.value,
    labelClass: labelClass.value,
    contentClass: className.value,
    slots: {
      label: slots.label,
      content: slots.default
    }
  })
}
watch(
  () => [
    label.value,
    span.value,
    content.value,
    itemClass.value,
    labelClass.value,
    className.value
  ],
  update,
  {
    onTrigger (event) {
      console.log(event)
    }
  }
)
update()

onBeforeUnmount(() => {
  removeItem(id)
})
</script>
