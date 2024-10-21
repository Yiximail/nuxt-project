<template>
  <v-mask
    :model-value="modelValue ?? isShowModal"
    :appear="appear"
    :class="ui.mask"
    :before-show="beforeShow"
    :before-hide="beforeHide"
    :close-on-click="closeOnClick"
    :close-on-esc="closeOnEsc"
    @update:model-value="updateShowModal"
    @before-show="$emit('before-show')"
    @show="$emit('show')"
    @showed="$emit('showed')"
    @before-hide="$emit('before-hide')"
    @hide="$emit('hide')"
    @hid="$emit('hid')"
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
        <div :class="ui.content">
          <slot :hide="hideHandle" />
        </div>
      </div>
      <template v-if="$slots.footer">
        <v-divider v-if="showDivider" :class="ui.divider" />
        <div :class="ui.footer">
          <slot name="footer" :hide="hideHandle" />
        </div>
      </template>
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
import VIcon from "../icon/icon.vue"
import VIconButton from "../icon/icon-button.vue"
import VDivider from "../divider/divider.vue"

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
  IconComponent,
  ComponentSlot,
  UI
} from "../../types"

const props = withDefaults(
  defineProps<{
    /** 是否显示 */
    modelValue?: boolean
    /** 立即执行动画 */
    appear?: boolean
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["modal"]>
    /** 图标 */
    icon?: IconComponent
    /** 标题 */
    title?: string
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
    showClose: true,
    beforeShow: undefined,
    beforeHide: undefined,
    closeOnClick: true,
    closeOnEsc: true,
    showDivider: true,
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
}>()

defineSlots<{
  header:(props: { hide: () => void }) => ComponentSlot
  default: (props: { hide: () => void }) => ComponentSlot
  footer: (props: { hide: () => void }) => ComponentSlot
}>()

const { ui } = useUi("modal", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})

const isShowModal = ref(false)
const updateShowModal = (value: boolean) => {
  if (value) {
    showHandle()
  } else {
    hideHandle()
  }
}

const showHandle = () => {
  isShowModal.value = true
  emits("update:model-value", true)
}
const hideHandle = () => {
  isShowModal.value = false
  emits("update:model-value", false)
}

defineExpose({ show: showHandle, hide: hideHandle })

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
