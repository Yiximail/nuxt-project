<template>
  <div
    :class="containerClass"
    @mouseenter="mouseenterHandle"
    @mouseleave="mouseleaveHandle"
  >
    <slot :hide="hideHandle">
      <v-icon v-if="loading" :icon="ui.loading" />
      <v-icon v-else-if="icon" :class="ui.icon" :icon="icon" />
      <div :class="ui.wrapper">
        <div v-if="title" :class="ui.title">
          {{ title }}
        </div>
        <div v-if="message" :class="ui.message">
          {{ message }}
        </div>
      </div>
    </slot>
    <slot name="footer" :hide="hideHandle" />
    <div
      v-if="showClose"
      ref="closeButtonRef"
      :class="ui.close"
      @click="hideHandle"
    >
      <div class="relative z-[1]">
        <v-icon name="mdi:close" />
      </div>
    </div>
    <v-progress
      v-if="duration"
      ref="progressRef"
      :class="ui.progress"
      :bar-class="ui.progressBar"
      fixed="end"
      :from="100"
      :to="0"
      :duration="duration"
      @end="hideHandle"
    />
  </div>
</template>

<script setup lang="ts">
import VProgress from "../progress/progress.vue"
import useClickRipple from "../../composables/use-click-ripple"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed, onBeforeUnmount, toRef } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ComponentSlot,
  IconComponent,
  Color,
  UI
} from "../../types"

const closeButtonRef = ref<HTMLDivElement>()
const progressRef = ref<InstanceType<typeof VProgress>>()

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["message"]>
    /** 图标 */
    icon?: IconComponent
    /** 标题 */
    title?: string
    /** 内容  */
    message?: string
    /** 颜色 */
    color?: Color
    /** 关闭时长 */
    duration?: number
    /** 是否显示关闭按钮 */
    showClose?: boolean
    /** 加载中 */
    loading?: boolean
  }>(),
  {
    class: undefined,
    ui: undefined,
    icon: undefined,
    title: undefined,
    message: undefined,
    color: "primary",
    duration: 3000,
    showClose: true,
    loading: false
  }
)

defineSlots<{
  default:(props: { hide: () => void }) => ComponentSlot
  footer: (props: { hide: () => void }) => ComponentSlot
}>()

const emits = defineEmits<{
  close: []
  unmount: []
}>()

const { ui } = useUi("message", props, { color: toRef(props, "color") })

useClickRipple(closeButtonRef, {
  type: "center",
  size: "20px"
})

const containerClass = computed(() => {
  return classMerge(
    ui.value.container,
    props.class
  )
})

const mouseenterHandle = () => {
  progressRef.value?.pause()
}
const mouseleaveHandle = () => {
  progressRef.value?.start()
}

const hideHandle = () => {
  // 这里进度条最后一点需要等待渲染完才触发关闭，否则还会留下一点
  requestAnimationFrame(() => {
    emits("close")
  })
}

onBeforeUnmount(() => {
  emits("unmount")
})
</script>
