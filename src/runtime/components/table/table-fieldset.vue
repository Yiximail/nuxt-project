<template>
  <v-fieldset
    :class="fieldsetClass"
    :label="label ?? column.label"
    type="none"
    :offset-x="offsetX"
    :offset-y="offsetY"
    :active-offset-x="activeOffsetX"
    :active-offset-y="activeOffsetY"
  >
    <slot />
  </v-fieldset>
</template>

<script setup lang="ts">
import VFieldset from "../fieldset/fieldset.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import {
  TABLE_INJECTION,
  TABLE_HEAD_INJECTION,
  FORM_ITEM_INJECTION
} from "../../utils/injection-keys"
import { inject, computed, provide } from "vue"

import type { DeepPartial, ClassNameValue, FormTrigger, UI } from "../../types"

const props = withDefaults(
  defineProps<{
    /** 标签 */
    label?: string
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["tableFieldset"]>
    /** Label初始偏移量 */
    offsetX?: string | number
    offsetY?: string | number
    activeOffsetX?: string | number
    activeOffsetY?: string | number
  }>(),
  {
    label: undefined,
    class: undefined,
    ui: undefined,
    offsetX: undefined,
    offsetY: undefined,
    activeOffsetX: undefined,
    activeOffsetY: undefined
  }
)

const { ui } = useUi("tableFieldset", props)

const fieldsetClass = computed(() => {
  return classMerge(ui.value.base, props.class)
})

const { refresh } = inject(TABLE_INJECTION)!
const { column } = inject(TABLE_HEAD_INJECTION)!

const setItem = () => undefined
const removeItem = () => undefined
const emits = (val: FormTrigger) => {
  switch (val) {
    case "input":
    case "focus":
      return
    case "blur":
    case "safe-blur":
    case "change":
    case "safe-change":
      refresh()
      break
  }
}
provide(FORM_ITEM_INJECTION, { setItem, removeItem, emits })
</script>
