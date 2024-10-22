<template>
  <v-popper
    :model-value="modelValue"
    :class="popperClass"
    :reference="reference ?? containerRef"
    :trigger="trigger"
    :arrow="arrow"
    strategy="fixed"
    :placement="placement"
    v-bind="popper"
    :disabled="disabled"
    @update:model-value="$emit('update:model-value', $event)"
    @before-show="$emit('before-show')"
    @show="$emit('show')"
    @showed="$emit('showed')"
    @before-hide="$emit('before-hide')"
    @hide="$emit('hide')"
    @hid="$emit('hid')"
    @click-outside="$emit('click-outside')"
  >
    <template #default="{ update }">
      <slot :update="update" />
    </template>
    <template #content="{ update }">
      <v-scrollbar-native :class="ui.content">
        <slot name="content" :update="update">
          {{ content }}
        </slot>
      </v-scrollbar-native>
    </template>
  </v-popper>
</template>

<script setup lang="ts">
import VPopper from "../popper/popper.vue"
import VScrollbarNative from "../scrollbar/scrollbar-native.vue"
import useInheritedDisabled from "../../composables/use-inherited-disabled"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed } from "vue"

import type {
  Placement,
  DeepPartial,
  ClassNameValue,
  ComponentSlot,
  ReferenceAbleComponent,
  PopperTrigger,
  PopperProps,
  UI
} from "../../types"

const containerRef = ref<HTMLSpanElement>()

const props = withDefaults(
  defineProps<{
    /** 是否显示 非undefined则视为手动 */
    modelValue?: boolean
    /** 弹出层内容 */
    content?: string
    /** 弹出层类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["tooltip"]>
    /** 参照元素 */
    reference?: HTMLElement | ReferenceAbleComponent
    /** 触发方式 */
    trigger?: PopperTrigger
    /** 是否显示箭头 */
    arrow?: boolean
    /** 禁用 */
    disabled?: boolean
    /** 位置 */
    placement?: Placement | Placement[]
    /** 弹出层配置 */
    popper?: PopperProps
  }>(),
  {
    modelValue: undefined,
    content: undefined,
    class: undefined,
    ui: undefined,
    reference: undefined,
    trigger: "hover",
    arrow: true,
    disabled: false,
    placement: () => ["top", "bottom"],
    popper: undefined
  }
)

defineEmits<{
  "update:model-value": [val: boolean]
  "before-show": []
  show: []
  showed: []
  "before-hide": []
  hide: []
  hid: []
  "click-outside": []
}>()

defineSlots<{
  default:(props: { update: () => void }) => ComponentSlot
  content: (props: { update: () => void }) => ComponentSlot
}>()

const { ui } = useUi("tooltip", props)

const { disabled } = useInheritedDisabled(props)

const popperClass = computed(() => {
  return classMerge(ui.value.popper, props.class)
})
</script>
