import { render, createVNode } from "vue"
import { useNuxtApp } from "#imports"
import VDialog from "../components/dialog/dialog.vue"

import type { DialogConfig, DialogResult } from "../types"

const dialog = (config: Partial<DialogConfig> | string) => {
  const _config: Partial<DialogConfig> = {
    icon: { name: "mdi:help-circle", class: "text-primary-500" },
    showCancel: true,
    confirmColor: "primary"
  }
  if (typeof config === "string") {
    Object.assign(_config, { message: config })
  } else {
    Object.assign(_config, config)
  }
  const element = document.createElement("div")
  element.className = "v-dialog-overlay"
  return new Promise<DialogResult>((resolve) => {
    const onMount = () => {
      const dialogRef = component?.component?.exposed as InstanceType<
        typeof VDialog
      >
      dialogRef?.show()
    }
    const onClose = () => {
      render(null, element)
      document.body.removeChild(element)
      resolve("close")
    }
    const onConfirm = () => {
      _config.onConfirm?.()
      resolve("confirm")
    }
    const onCancel = () => {
      _config.onCancel?.()
      resolve("cancel")
    }
    const nuxtApp = useNuxtApp()
    const component = createVNode(VDialog, {
      ..._config,
      appear: true,
      onClose,
      onConfirm,
      onCancel,
      onMount
    })
    component.appContext = nuxtApp.vueApp._context
    render(component, element)
    document.body.appendChild(element)
  })
}

dialog.success = (config: Partial<DialogConfig> | string) => {
  const _config: Partial<DialogConfig> = {
    icon: { name: "mdi:check-circle", class: "text-success-500" },
    showCancel: false,
    confirmColor: "success"
  }
  if (typeof config === "string") {
    Object.assign(_config, { message: config })
  } else {
    Object.assign(_config, config)
  }
  return dialog(_config)
}

dialog.error = (config: Partial<DialogConfig> | string) => {
  const _config: Partial<DialogConfig> = {
    icon: { name: "mdi:close-circle", class: "text-danger-500" },
    showCancel: false,
    confirmColor: "danger"
  }
  if (typeof config === "string") {
    Object.assign(_config, { message: config })
  } else {
    Object.assign(_config, config)
  }
  return dialog(_config)
}

dialog.warning = (config: Partial<DialogConfig> | string) => {
  const _config: Partial<DialogConfig> = {
    icon: { name: "mdi:alert-circle", class: "text-warning-500" },
    showCancel: false,
    confirmColor: "warning"
  }
  if (typeof config === "string") {
    Object.assign(_config, { message: config })
  } else {
    Object.assign(_config, config)
  }
  return dialog(_config)
}

export default dialog
