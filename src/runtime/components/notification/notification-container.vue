<template>
  <transition-group
    tag="div"
    name="v-notification"
    :class="['v-notification-container', containerClass]"
    @after-leave="unmountedHandle"
  >
    <v-notification
      v-for="notification in notifications"
      :key="notification.id"
      :class="notification.config.class"
      :icon="notification.config.icon"
      :title="notification.config.title"
      :message="
        typeof notification.config.message === 'string'
          ? notification.config.message
          : undefined
      "
      :progress-color="notification.config.progressColor"
      :duration="notification.config.duration"
      :show-close="notification.config.showClose"
      @close="closeHandle(notification)"
    >
      <template
        v-if="typeof notification.config.message === 'function'"
        #default="{ hide }"
      >
        <component :is="notification.config.message" :hide="hide" />
      </template>
      <template v-if="notification.config.footer" #footer="{ hide }">
        <component :is="notification.config.footer" :hide="hide" />
      </template>
    </v-notification>
  </transition-group>
</template>

<script setup lang="ts">
import VNotification from "./notification.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import guid from "../../utils/guid"
import { ref, computed } from "vue"

import type {
  DeepPartial,
  ClassNameValue,
  NotificationConfig,
  UI
} from "../../types"

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["notificationContainer"]>
  }>(),
  {
    class: undefined,
    ui: undefined
  }
)

const emits = defineEmits<{
  unmount: []
}>()

const { ui } = useUi("notificationContainer", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})

const notifications = ref<{ id: string; config: NotificationConfig }[]>([])
const addNotification = (config: Partial<NotificationConfig>) => {
  const id = guid()
  notifications.value.push({ id, config })
}
const closeHandle = (notification: {
  id: string
  config: NotificationConfig
}) => {
  const index = notifications.value.findIndex(
    (item) => item.id === notification.id
  )
  if (index === -1) return
  const item = notifications.value[index]
  item.config.onClose?.()
  notifications.value.splice(index, 1)
}
const closeNotification = (id: string) => {
  const index = notifications.value.findIndex((item) => item.id === id)
  if (index === -1) return
  const item = notifications.value[index]
  item.config.onClose?.()
  notifications.value.splice(index, 1)
}
const unmountedHandle = () => {
  if (notifications.value.length) return
  emits("unmount")
}

defineExpose({ addNotification, closeNotification })
</script>

<style scoped>
.v-notification-move,
.v-notification-enter-active,
.v-notification-leave-active {
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-notification-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.v-notification-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.v-notification-leave-active {
  position: absolute;
}
</style>
