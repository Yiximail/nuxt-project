<template>
  <v-button
    ref="buttonRef"
    :class="buttonClass"
    type="plain"
    :shadow="false"
    size="sm"
    :color="active ? 'primary' : 'natural'"
  >
    <v-icon icon="mdi:filter-variant" class="h-4 w-4" />
  </v-button>
  <v-popper
    :reference="buttonRef"
    trigger="click"
    strategy="fixed"
    to-body
  >
    <template #content>
      <v-scrollbar-native :class="ui.popper">
        <slot />
      </v-scrollbar-native>
    </template>
  </v-popper>
</template>

<script setup lang="ts">
import VButton from "../button/button.vue"
import VIcon from "../icon/icon.vue"
import VPopper from "../popper/popper.vue"
import VScrollbarNative from "../scrollbar/scrollbar-native.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import {
  TABLE_INJECTION,
  FORM_ITEM_INJECTION
} from "../../utils/injection-keys"
import { computed, ref, provide, inject } from "vue"

import type {
  ClassNameValue,
  DeepPartial,
  ComponentSlot,
  FormTrigger,
  UI
} from "../../types"

const buttonRef = ref<InstanceType<typeof VButton>>()

const props = withDefaults(
  defineProps<{
    /** 搜索中高亮 */
    active?: boolean
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["tableFilter"]>
  }>(),
  {
    active: false,
    class: undefined,
    ui: undefined
  }
)

defineSlots<{
  default:() => ComponentSlot
}>()

const { ui } = useUi("tableFilter", props)

const buttonClass = computed(() => {
  return classMerge(ui.value.button, props.class)
})

const { refresh } = inject(TABLE_INJECTION)!

const setItem = () => {}
const removeItem = () => {}
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
