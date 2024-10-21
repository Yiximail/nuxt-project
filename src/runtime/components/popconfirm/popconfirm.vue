<template>
  <v-popper
    :model-value="modelValue ?? isShowPopper"
    :class="popperClass"
    :reference="reference ?? containerRef"
    :trigger="trigger"
    :arrow="arrow"
    strategy="fixed"
    :placement="placement"
    v-bind="{ ...popper, ...$attrs }"
    :disabled="disabled"
    @update:model-value="updateHandle"
    @before-show="$emit('before-show')"
    @show="$emit('show')"
    @showed="$emit('showed')"
    @before-hide="$emit('before-hide')"
    @hide="$emit('hide')"
    @hid="$emit('hid')"
    @click-outside="$emit('click-outside')"
  >
    <template #default>
      <slot :hide="hidePopper" />
    </template>
    <template #content>
      <template v-if="$slots.header || title">
        <div :class="ui.header">
          <slot name="header" :hide="hidePopper">
            <v-icon v-if="icon" :class="ui.icon" :icon="icon" />
            <div :class="ui.title">
              {{ title }}
            </div>
          </slot>
        </div>
      </template>
      <div :class="ui.wrapper">
        <v-icon
          v-if="!$slots.header && !title && icon"
          :class="ui.icon"
          :icon="icon"
        />
        <div :class="ui.content">
          <slot :hide="hidePopper" name="content">
            {{ content }}
          </slot>
        </div>
      </div>
      <div :class="ui.footer">
        <slot name="footer" :hide="hidePopper">
          <v-button
            v-if="showCancel"
            :color="cancelColor"
            type="plain"
            border
            size="sm"
            @click="cancelHandle"
          >
            {{ cancelText }}
          </v-button>
          <v-button
            v-if="showConfirm"
            :color="confirmColor"
            size="sm"
            @click="confirmHandle"
          >
            {{ confirmText }}
          </v-button>
        </slot>
      </div>
    </template>
  </v-popper>
</template>

<script setup lang="ts">
import VPopper from "../popper/popper.vue"
import VIcon from "../icon/icon.vue"
import VButton from "../button/button.vue"
import useInheritedDisabled from "../../composables/use-inherited-disabled"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import {
  FIELDSET_INJECTION,
  FORM_ITEM_INJECTION
} from "../../utils/injection-keys"
import { ref, computed, provide } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  PopperTrigger,
  IconComponent,
  Color,
  ReferenceAbleComponent,
  Placement,
  ComponentSlot,
  PopperProps,
  UI
} from "../../types"

const containerRef = ref<HTMLSpanElement>()

const props = withDefaults(
  defineProps<{
    /** 是否显示 非undefined则视为手动 */
    modelValue?: boolean
    /** 图标 */
    icon?: IconComponent
    /** 标题 */
    title?: string
    /** 内容 */
    content?: string
    /** 显示确定按钮 */
    showConfirm?: boolean
    /** 显示取消按钮 */
    showCancel?: boolean
    /** 确定按钮文本 */
    confirmText?: string
    /** 取消按钮文本 */
    cancelText?: string
    /** 确认按钮颜色 */
    confirmColor?: Color
    /** 取消按钮颜色 */
    cancelColor?: Color
    /** 弹出层类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["popconfirm"]>
    /** 参照元素 */
    reference?: HTMLElement | ReferenceAbleComponent
    /** 触发方式 */
    trigger?: PopperTrigger
    /** 是否显示箭头 */
    arrow?: boolean
    /** 禁用 */
    disabled?: boolean
    /** 位置 */
    placement?: Placement
    /** 弹出层配置 */
    popper?: PopperProps
    /** 拦截form校验，非响应 */
    interceptForm?: boolean
  }>(),
  {
    modelValue: undefined,
    class: undefined,
    ui: undefined,
    icon: undefined,
    title: undefined,
    content: undefined,
    showConfirm: true,
    showCancel: true,
    confirmText: "确定",
    cancelText: "取消",
    confirmColor: "primary",
    cancelColor: "natural",
    reference: undefined,
    trigger: "click",
    arrow: true,
    disabled: false,
    placement: "top",
    popper: undefined,
    interceptForm: true
  }
)

const emits = defineEmits<{
  "update:model-value": [val: boolean]
  "before-show": []
  show: []
  showed: []
  "before-hide": []
  hide: []
  hid: []
  "click-outside": []
  confirm: []
  cancel: []
}>()

defineSlots<{
  header:(props: { hide: () => void }) => ComponentSlot
  default: (props: { hide: () => void }) => ComponentSlot
  content: (props: { hide: () => void }) => ComponentSlot
  footer: (props: { hide: () => void }) => ComponentSlot
}>()

const { ui } = useUi("popconfirm", props)

const { disabled } = useInheritedDisabled(props)

const popperClass = computed(() => {
  return classMerge(ui.value.popper, props.class)
})

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

const cancelHandle = () => {
  emits("cancel")
  hidePopper()
}
const confirmHandle = () => {
  emits("confirm")
  hidePopper()
}

defineExpose({ isShowPopper, showPopper, hidePopper })

if (props.interceptForm) {
  provide(FORM_ITEM_INJECTION, {
    setItem: () => undefined,
    removeItem: () => undefined,
    emits: () => undefined
  })
}
provide(FIELDSET_INJECTION, {
  contentClass: ref(""),
  container: ref()
})
</script>
