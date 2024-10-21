<template>
  <div
    :class="containerClass"
    @mouseenter="mouseenterHandle"
    @mouseleave="mouseleaveHandle"
  >
    <div v-if="$slots.header || title" :class="ui.header">
      <slot name="header" :hide="hideHandle">
        <v-icon v-if="icon" :class="ui.icon" :icon="icon" />
        <div :class="ui.title">
          {{ title }}
        </div>
      </slot>
    </div>
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
    <div v-if="$slots.footer" :class="ui.footer">
      <slot name="footer" :hide="hideHandle" />
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
    <v-icon-button
      v-if="showClose"
      :class="ui.close"
      icon="mdi:close"
      @click="hideHandle"
    />
  </div>
</template>

<script setup lang="ts">
import VIconButton from "../icon/icon-button.vue"
import VProgress from "../progress/progress.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed, toRef, onBeforeUnmount } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  ComponentSlot,
  IconComponent,
  Color,
  UI
} from "../../types"

const progressRef = ref<InstanceType<typeof VProgress>>()

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["notification"]>
    /** 图标 */
    icon?: IconComponent
    /** 标题 */
    title?: string
    /** 内容  */
    message?: string
    /** 进度条颜色 */
    progressColor?: Color
    /** 关闭时长 */
    duration?: number
    /** 是否显示关闭按钮 */
    showClose?: boolean
  }>(),
  {
    class: undefined,
    ui: undefined,
    icon: undefined,
    title: undefined,
    message: undefined,
    progressColor: "primary",
    duration: 3000,
    showClose: true
  }
)

defineSlots<{
  header:(props: { hide: () => void }) => ComponentSlot
  default: (props: { hide: () => void }) => ComponentSlot
  footer: (props: { hide: () => void }) => ComponentSlot
}>()

const emits = defineEmits<{
  close: []
  unmount: []
}>()

const { ui } = useUi("notification", props, {
  color: toRef(props, "progressColor")
})

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
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
