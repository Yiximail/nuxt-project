<template>
  <span class="hidden" />
</template>

<script setup lang="ts">
import { DESCRIPTION_INJECTION } from "../../utils/injection-keys"
import guid from "../../utils/guid"
import { watchEffect, onBeforeUnmount, inject } from "vue"

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

const { setItem, removeItem } = inject(DESCRIPTION_INJECTION)!
const id = guid()
const update = () => {
  setItem({
    id,
    label: props.label,
    span: props.span,
    content: props.content,
    itemClass: props.itemClass,
    labelClass: props.labelClass,
    contentClass: props.class,
    slots: {
      label: slots.label,
      content: slots.default
    }
  })
}
watchEffect(update)
update()

onBeforeUnmount(() => {
  removeItem(id)
})
</script>
