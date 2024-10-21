<template>
  <v-mask
    v-if="mask"
    :model-value="modelValue ?? isShowDrawer"
    :appear="appear"
    :class="ui.mask"
    :before-show="beforeShow"
    :before-hide="beforeHide"
    :close-on-click="closeOnClick"
    :close-on-esc="closeOnEsc"
    @before-show="$emit('before-show')"
    @show="$emit('show')"
    @showed="$emit('showed')"
    @before-hide="$emit('before-hide')"
    @hide="$emit('hide')"
    @hid="$emit('hid')"
  />
  <transition appear :name="`v-drawer-${placement}`">
    <div v-if="show" ref="containerRef" :class="containerClass">
      <template v-if="$slots.header || title">
        <div :class="ui.header">
          <slot name="header" :hide="hideHandle">
            <v-icon v-if="icon" :class="ui.icon" :icon="icon" />
            <div :class="ui.title">
              {{ title }}
            </div>
          </slot>
        </div>
        <v-divider
          v-if="showDivider && ($slots.header || title)"
          :class="ui.divider"
        />
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
  </transition>
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
import { ref, computed, watch, provide, onUnmounted } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  IconComponent,
  ComponentSlot,
  UI
} from "../../types"

const containerRef = ref<HTMLDivElement>()

const props = withDefaults(
  defineProps<{
    /** 是否显示 */
    modelValue?: boolean
    /** 抽屉的位置 */
    placement?: "top" | "right" | "bottom" | "left"
    /** 立即执行动画 */
    appear?: boolean
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["drawer"]>
    /** 图标 */
    icon?: IconComponent
    /** 标题 */
    title?: string
    /** 是否显示关闭按钮 */
    showClose?: boolean
    /** 是否显示蒙版 */
    mask?: boolean
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
    placement: "right",
    appear: undefined,
    class: undefined,
    ui: undefined,
    icon: undefined,
    title: undefined,
    showClose: true,
    mask: true,
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

const { ui } = useUi("drawer", props)

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    ui.value.placement[props.placement],
    props.class
  )
})

// const maskUpdate = (val: boolean) => {
//   emits("update:model-value", val)
// }
const isShowDrawer = ref(false)
const show = computed(() => props.modelValue ?? isShowDrawer.value)
const clickDocument = (event: MouseEvent) => {
  const path = event.composedPath()
  if (!containerRef.value) return
  if (!path.includes(containerRef.value)) {
    hideHandle()
  }
}
watch(show, (val) => {
  if (val) {
    document.addEventListener("click", clickDocument)
  } else {
    document.removeEventListener("click", clickDocument)
  }
})
onUnmounted(() => {
  document.removeEventListener("click", clickDocument)
})
const showHandle = () => {
  isShowDrawer.value = true
  emits("update:model-value", true)
}
const hideHandle = () => {
  isShowDrawer.value = false
  emits("update:model-value", false)
}

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

defineExpose({ show: showHandle, hide: hideHandle })
</script>

<style scoped>
.v-drawer-top-enter-active,
.v-drawer-right-enter-active,
.v-drawer-bottom-enter-active,
.v-drawer-left-enter-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-drawer-top-leave-active,
.v-drawer-right-leave-active,
.v-drawer-bottom-leave-active,
.v-drawer-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-drawer-top-enter-from,
.v-drawer-top-leave-to {
  transform: translateY(-100%);
}

.v-drawer-right-enter-from,
.v-drawer-right-leave-to {
  transform: translateX(100%);
}

.v-drawer-bottom-enter-from,
.v-drawer-bottom-leave-to {
  transform: translateY(100%);
}

.v-drawer-left-enter-from,
.v-drawer-left-leave-to {
  transform: translateX(-100%);
}
</style>
