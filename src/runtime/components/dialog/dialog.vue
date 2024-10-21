<template>
  <v-mask
    :model-value="modelValue ?? isShowDialog"
    :appear="appear"
    :class="ui.mask"
    :before-show="beforeShow"
    :before-hide="beforeHide"
    :close-on-click="closeOnClick"
    :close-on-esc="closeOnEsc"
    @update:model-value="updateShowDialog"
    @before-show="$emit('before-show')"
    @show="$emit('show')"
    @showed="$emit('showed')"
    @before-hide="$emit('before-hide')"
    @hide="$emit('hide')"
    @hid="hidHandle"
  >
    <div :class="containerClass">
      <template v-if="$slots.header || title">
        <div :class="ui.header">
          <slot name="header" :hide="hideHandle">
            <v-icon v-if="icon" :class="ui.icon" :icon="icon" />
            <div :class="ui.title">
              {{ title }}
            </div>
          </slot>
        </div>
        <v-divider v-if="showDivider" :class="ui.divider" />
      </template>
      <div :class="ui.wrapper">
        <v-icon
          v-if="!$slots.header && !title && icon"
          :class="ui.icon"
          :icon="icon"
        />
        <div :class="ui.message">
          <slot :hide="hideHandle">
            {{ message }}
          </slot>
        </div>
      </div>
      <v-divider v-if="showDivider" :class="ui.divider" />
      <div :class="ui.footer">
        <slot name="footer" :hide="hideHandle">
          <v-button
            v-if="showCancel"
            :color="cancelColor"
            type="plain"
            border
            @click="cancelHandle"
          >
            {{ cancelText }}
          </v-button>
          <v-button
            v-if="showConfirm"
            :color="confirmColor"
            @click="confirmHandle"
          >
            {{ confirmText }}
          </v-button>
        </slot>
      </div>
      <v-icon-button
        v-if="showClose"
        :class="ui.close"
        icon="mdi:close"
        @click="hideHandle"
      />
    </div>
  </v-mask>
</template>

<script setup lang="ts">
import VMask from "../mask/mask.vue"
import VButton from "../button/button.vue"
import VIcon from "../icon/icon.vue"
import VIconButton from "../icon/icon-button.vue"
import VDivider from "../divider/divider.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import {
  FIELDSET_INJECTION,
  FORM_ITEM_INJECTION
} from "../../utils/injection-keys"
import { ref, computed, onMounted, onBeforeUnmount, provide } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  IconComponent,
  Color,
  ComponentSlot,
  UI
} from "../../types"

const props = withDefaults(
  defineProps<{
    /** 是否显示 非undefined则视为手动 */
    modelValue?: boolean
    /** 立即执行动画 */
    appear?: boolean
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["dialog"]>
    /** 图标 */
    icon?: IconComponent
    /** 标题 */
    title?: string
    /** 内容 */
    message?: string
    /** 是否显示关闭按钮 */
    showClose?: boolean
    /** 出现之前 */
    beforeShow?:() => void | boolean | Promise<void> | Promise<boolean>
    /** 消失之前 */
    beforeHide?: () => void | boolean | Promise<void> | Promise<boolean>
    /** 点击遮罩层关闭 */
    closeOnClick?: boolean
    /** 点击esc关闭 */
    closeOnEsc?: boolean
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
    /** 是否显示分割线 */
    showDivider?: boolean
    /** 拦截form校验，非响应 */
    interceptForm?: boolean
  }>(),
  {
    modelValue: undefined,
    appear: undefined,
    class: undefined,
    ui: undefined,
    icon: undefined,
    title: undefined,
    message: undefined,
    showClose: false,
    beforeShow: undefined,
    beforeHide: undefined,
    closeOnClick: false,
    closeOnEsc: false,
    showConfirm: true,
    showCancel: true,
    confirmText: "确定",
    cancelText: "取消",
    confirmColor: "primary",
    cancelColor: "natural",
    showDivider: false,
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
  mount: []
  unmount: []
  close: []
  confirm: []
  cancel: []
}>()

defineSlots<{
  header:(props: { hide: () => void }) => ComponentSlot
  default: (props: { hide: () => void }) => ComponentSlot
  footer: (props: { hide: () => void }) => ComponentSlot
}>()

const { ui } = useUi("dialog", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})

const isShowDialog = ref(false)
const updateShowDialog = (value: boolean) => {
  if (value) {
    showHandle()
  } else {
    hideHandle()
  }
}

const showHandle = () => {
  isShowDialog.value = true
  emits("update:model-value", true)
}
const hideHandle = () => {
  isShowDialog.value = false
  emits("update:model-value", false)
}
const cancelHandle = () => {
  emits("cancel")
  hideHandle()
}
const confirmHandle = () => {
  emits("confirm")
  hideHandle()
}
const hidHandle = () => {
  emits("hid")
  emits("close")
}

onMounted(() => {
  emits("mount")
})
onBeforeUnmount(() => {
  emits("unmount")
})

defineExpose({
  show: showHandle,
  hide: hideHandle,
  cancel: cancelHandle,
  confirm: confirmHandle
})

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
