import { render, createVNode } from "vue"
import { useState, useNuxtApp } from "#imports"
import VNotificationContainer from "../components/notification/notification-container.vue"

import type { NotificationConfig } from "../types"
import type { VNode } from "vue"

interface NotificationContainer {
  element: HTMLDivElement
  component: VNode
}

const getContainer = () => {
  const notificationContainer = useState<NotificationContainer | undefined>(
    "v-notification-container"
  )
  if (notificationContainer.value) return notificationContainer.value
  const onUnmount = () => {
    notificationContainer.value = undefined
    render(null, element)
    document.body.removeChild(element)
  }
  const element = document.createElement("div")
  element.className = "v-notification-overlay"
  const nuxtApp = useNuxtApp()
  const component = createVNode(VNotificationContainer, { onUnmount })
  component.appContext = nuxtApp.vueApp._context
  render(component, element)
  document.body.appendChild(element)
  notificationContainer.value = { element, component }
  return notificationContainer.value
}

const notification = (config: Partial<NotificationConfig> | string) => {
  const _config: Partial<NotificationConfig> = {}
  if (typeof config === "string") {
    Object.assign(_config, { message: config })
  } else {
    Object.assign(_config, config)
  }
  const container = getContainer()
  const notificationListRef = container?.component?.component
    ?.exposed as InstanceType<typeof VNotificationContainer>
  notificationListRef.addNotification(_config)
}

notification.success = (config: Partial<NotificationConfig> | string) => {
  const _config: Partial<NotificationConfig> = {
    icon: { name: "mdi:check-circle", class: "text-success-500" },
    progressColor: "success"
  }
  if (typeof config === "string") {
    Object.assign(_config, { message: config })
  } else {
    Object.assign(_config, config)
  }
  notification(_config)
}

notification.error = (config: Partial<NotificationConfig> | string) => {
  const _config: Partial<NotificationConfig> = {
    icon: { name: "mdi:close-circle", class: "text-danger-500" },
    progressColor: "danger"
  }
  if (typeof config === "string") {
    Object.assign(_config, { message: config })
  } else {
    Object.assign(_config, config)
  }
  notification(_config)
}

notification.warning = (config: Partial<NotificationConfig> | string) => {
  const _config: Partial<NotificationConfig> = {
    icon: { name: "mdi:alert-circle", class: "text-warning-500" },
    progressColor: "warning"
  }
  if (typeof config === "string") {
    Object.assign(_config, { message: config })
  } else {
    Object.assign(_config, config)
  }
  notification(_config)
}

export default notification
