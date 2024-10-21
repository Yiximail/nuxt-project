import { render, createVNode } from "vue"
import { useState, useNuxtApp } from "#imports"
import VMessageContainer from "../components/message/message-container.vue"

import type { MessageConfig } from "../types"
import type { VNode } from "vue"

interface MessageContainer {
  element: HTMLDivElement
  component: VNode
}

const getContainer = () => {
  const messageContainer = useState<MessageContainer | undefined>(
    "v-message-container"
  )
  if (messageContainer.value) return messageContainer.value
  const onUnmount = () => {
    messageContainer.value = undefined
    render(null, element)
    document.body.removeChild(element)
  }
  const element = document.createElement("div")
  element.className = "v-message-overlay"
  const nuxtApp = useNuxtApp()
  const component = createVNode(VMessageContainer, { onUnmount })
  component.appContext = nuxtApp.vueApp._context
  render(component, element)
  document.body.appendChild(element)
  messageContainer.value = { element, component }
  return messageContainer.value
}

const message = (config: Partial<MessageConfig> | string) => {
  const _config: Partial<MessageConfig> = { color: "primary" }
  if (typeof config === "string") {
    Object.assign(_config, { message: config })
  } else {
    Object.assign(_config, config)
  }
  const container = getContainer()
  const messageListRef = container?.component?.component
    ?.exposed as InstanceType<typeof VMessageContainer>
  messageListRef.addMessage(_config)
}

message.success = (config: Partial<MessageConfig> | string) => {
  const _config: Partial<MessageConfig> = {
    color: "success",
    icon: "mdi:check-circle-outline"
  }
  if (typeof config === "string") {
    Object.assign(_config, { message: config })
  } else {
    Object.assign(_config, config)
  }
  message(_config)
}

message.error = (config: Partial<MessageConfig> | string) => {
  const _config: Partial<MessageConfig> = {
    color: "danger",
    icon: "mdi:close-circle-outline"
  }
  if (typeof config === "string") {
    Object.assign(_config, { message: config })
  } else {
    Object.assign(_config, config)
  }
  message(_config)
}

message.warning = (config: Partial<MessageConfig> | string) => {
  const _config: Partial<MessageConfig> = {
    color: "warning",
    icon: "mdi:alert-circle-outline"
  }
  if (typeof config === "string") {
    Object.assign(_config, { message: config })
  } else {
    Object.assign(_config, config)
  }
  message(_config)
}

export default message
