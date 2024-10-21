<template>
  <transition-group
    tag="div"
    name="v-message"
    :class="containerClass"
    @after-leave="unmountedHandle"
  >
    <v-message
      v-for="message in messages"
      :key="message.id"
      :class="message.config.class"
      :icon="message.config.icon"
      :title="message.config.title"
      :message="
        typeof message.config.message === 'string'
          ? message.config.message
          : undefined
      "
      :color="message.config.color"
      :duration="message.config.duration"
      :show-close="message.config.showClose"
      @close="closeHandle(message)"
    >
      <template
        v-if="typeof message.config.message === 'function'"
        #default="{ hide }"
      >
        <component :is="message.config.message" :hide="hide" />
      </template>
      <template v-if="message.config.footer" #footer="{ hide }">
        <component :is="message.config.footer" :hide="hide" />
      </template>
    </v-message>
  </transition-group>
</template>

<script setup lang="ts">
import VMessage from "./message.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import guid from "../../utils/guid"
import { ref, computed } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  MessageConfig,
  UI
} from "../../types"

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["messageContainer"]>
  }>(),
  {
    class: undefined,
    ui: undefined
  }
)

const emits = defineEmits<{
  unmount: []
}>()

const { ui } = useUi("messageContainer", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})

const messages = ref<{ id: string; config: MessageConfig }[]>([])
const addMessage = (config: Partial<MessageConfig>) => {
  const id = guid()
  messages.value.push({ id, config })
}
const closeHandle = (message: { id: string; config: MessageConfig }) => {
  const index = messages.value.findIndex((item) => item.id === message.id)
  if (index === -1) return
  const item = messages.value[index]
  item.config.onClose?.()
  messages.value.splice(index, 1)
}
const closeMessage = (id: string) => {
  const index = messages.value.findIndex((item) => item.id === id)
  if (index === -1) return
  const item = messages.value[index]
  item.config.onClose?.()
  messages.value.splice(index, 1)
}
const unmountedHandle = () => {
  if (messages.value.length) return
  emits("unmount")
}

defineExpose({ addMessage, closeMessage })
</script>

<style scoped>
.v-message-move,
.v-message-enter-active,
.v-message-leave-active {
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-message-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.v-message-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.v-message-leave-active {
  position: absolute;
}
</style>
