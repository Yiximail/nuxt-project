<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded p-5 flex gap-1"
    >
      <v-button color="primary" @click="showDialog('primary')">
        primary
      </v-button>
      <v-button color="success" @click="showDialog('success')">
        success
      </v-button>
      <v-button color="warning" @click="showDialog('warning')">
        warning
      </v-button>
      <v-button color="danger" @click="showDialog('error')">
        error
      </v-button>
      <v-button color="natural" @click="showDialog()">
        自定义对话框
      </v-button>
    </div>
    <v-form>
      <v-form-item label="图标 svg" fieldset="outline">
        <template #info>
          https://icon-sets.iconify.design/mdi/
        </template>
        <v-input v-model="buttonIcon" />
      </v-form-item>
      <v-form-item label="标题" fieldset="outline">
        <v-input v-model="title" />
      </v-form-item>
      <v-form-item label="内容" fieldset="outline">
        <v-input v-model="message" />
      </v-form-item>
      <div class="flex gap-10">
        <v-form-item label="显示关闭按钮">
          <v-checkbox v-model="showClose" />
        </v-form-item>
        <v-form-item label="点击蒙版关闭">
          <v-checkbox v-model="closeOnClick" />
        </v-form-item>
      </div>
      <div class="py-3 font-bold">
        以下是自定义对话框的配置项
      </div>
      <v-form-item label="显示确定按钮">
        <v-checkbox v-model="showConfirm" />
      </v-form-item>
      <v-form-item label="确定按钮文字" fieldset="outline">
        <v-input v-model="confirmText" />
      </v-form-item>
      <v-form-item label="确定按钮颜色">
        <v-radio-button
          v-for="value in [
            'natural',
            'primary',
            'success',
            'warning',
            'danger'
          ]"
          :key="value"
          v-model="confirmColor"
          :value="value"
        >
          {{ value }}
        </v-radio-button>
        <v-radio-button v-model="confirmColor">
          默认
        </v-radio-button>
      </v-form-item>
      <v-form-item label="显示取消按钮">
        <v-checkbox v-model="showCancel" />
      </v-form-item>
      <v-form-item label="取消按钮文字" fieldset="outline">
        <v-input v-model="cancelText" />
      </v-form-item>
      <v-form-item label="取消按钮颜色">
        <v-radio-button
          v-for="value in [
            'natural',
            'primary',
            'success',
            'warning',
            'danger'
          ]"
          :key="value"
          v-model="cancelColor"
          :value="value"
        >
          {{ value }}
        </v-radio-button>
        <v-radio-button v-model="cancelColor">
          默认
        </v-radio-button>
      </v-form-item>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type { Color } from "#ui"

definePageMeta({ layout: "demo" })

const buttonIcon = ref(
  "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M13 13h-2V7h2m0 10h-2v-2h2M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2\"/></svg>"
)
const showClose = ref(true)
const closeOnClick = ref(false)
const showConfirm = ref(true)
const showCancel = ref(true)
const confirmText = ref("确定")
const cancelText = ref("取消")
const confirmColor = ref<Color>()
const cancelColor = ref<Color>()

const title = ref("标题")
const message = ref("内容")

const showDialog = (
  type?: "primary" | "success" | "warning" | "error"
) => {
  if (type) {
    if (type === "primary") {
      $dialog({
        title: title.value,
        message: message.value
      })
    } else {
      $dialog[type]({
        title: title.value,
        message: message.value
      })
    }
  } else {
    $dialog({
      title: title.value,
      message: message.value,
      icon: { svg: buttonIcon.value },
      showClose: showClose.value,
      closeOnClick: closeOnClick.value,
      showConfirm: showConfirm.value,
      showCancel: showCancel.value,
      confirmText: confirmText.value,
      cancelText: cancelText.value,
      confirmColor: confirmColor.value,
      cancelColor: cancelColor.value
    })
  }
}
</script>
