<template>
  <v-popper
    :model-value="modelValue ?? isShowPopper"
    :reference="reference"
    :trigger="trigger"
    :strategy="strategy"
    :placement="['bottom', 'top']"
    v-bind="popper"
    :disabled="disabled"
    @update:model-value="updateHandle"
  >
    <template v-if="$slots.default" #default>
      <slot
        :is-show-popper="isShowPopper"
        :show-popper="showPopper"
        :hide-popper="hidePopper"
      />
    </template>
    <template #content>
      <v-dropdown-popper>
        <template v-if="$slots.header" #header>
          <slot
            name="header"
            :show-popper="showPopper"
            :hide-popper="hidePopper"
          />
        </template>
        <template #default>
          <slot name="content" />
        </template>
        <template v-if="$slots.footer" #footer>
          <slot
            name="footer"
            :show-popper="showPopper"
            :hide-popper="hidePopper"
          />
        </template>
      </v-dropdown-popper>
    </template>
  </v-popper>
</template>

<script setup lang="ts">
import { DROPDOWN_INJECTION } from "../../utils/injection-keys"
import { ref, provide, toRef } from "vue"

import type {
  ReferenceAbleComponent,
  ComponentSlot,
  PopperProps,
  PopperTrigger
} from "../../types"

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** 是否显示 非undefined则视为手动 */
    modelValue?: boolean
    /** 参照元素 */
    reference?: HTMLElement | ReferenceAbleComponent
    /** 禁用 */
    disabled?: boolean
    /** 触发方式 */
    trigger?: PopperTrigger
    /** 定位策略 */
    strategy?: "absolute" | "fixed"
    /** 弹窗的配置 */
    popper?: PopperProps
    /** 是否点击关闭 */
    clickClose?: boolean
  }>(),
  {
    modelValue: undefined,
    reference: undefined,
    disabled: undefined,
    trigger: () => ["click"],
    strategy: "fixed",
    popper: undefined,
    clickClose: true
  }
)

const emits = defineEmits<{
  "update:model-value": [value: boolean]
}>()

defineSlots<{
  default:(scoped: {
    isShowPopper: boolean
    showPopper: () => void
    hidePopper: () => void
  }) => ComponentSlot
  header: (scoped: {
    showPopper: () => void
    hidePopper: () => void
  }) => ComponentSlot
  content: () => ComponentSlot
  footer: (scoped: {
    showPopper: () => void
    hidePopper: () => void
  }) => ComponentSlot
}>()

const isShowPopper = ref(false)
const showPopper = () => {
  isShowPopper.value = true
  emits("update:model-value", true)
}
const hidePopper = () => {
  isShowPopper.value = false
  emits("update:model-value", false)
}

const updateHandle = (val: boolean) => {
  isShowPopper.value = val
  emits("update:model-value", val)
}

provide(DROPDOWN_INJECTION, {
  isShowPopper,
  clickClose: toRef(props, "clickClose"),
  hidePopper
})

defineExpose({ isShowPopper, showPopper, hidePopper })
</script>
