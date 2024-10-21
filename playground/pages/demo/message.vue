<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded p-5 flex gap-1"
    >
      <span class="i-[mdi--check]" />
      <v-button color="primary" @click="showMessage('primary')">
        primary
      </v-button>
      <v-button color="success" @click="showMessage('success')">
        success
      </v-button>
      <v-button color="warning" @click="showMessage('warning')">
        warning
      </v-button>
      <v-button color="danger" @click="showMessage('error')">
        error
      </v-button>
      <v-button color="info" @click="showMessage('info')">
        info
      </v-button>
      <v-button color="natural" @click="showMessage()">
        自定义消息
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
      <v-form-item label="自动关闭" fieldset="outline">
        <template #info>
          为 0 时不会自动关闭
        </template>
        <v-input-number
          v-model="duration"
          :min="0"
          :max="10"
          :precision="0"
        />
        秒
      </v-form-item>
      <div class="flex gap-10">
        <v-form-item label="显示关闭按钮">
          <v-checkbox v-model="showClose" />
        </v-form-item>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const buttonIcon = ref(
  "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M13 13h-2V7h2m0 10h-2v-2h2M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2\"/></svg>"
)
const showClose = ref(true)

const title = ref("标题")
const message = ref("内容")
const duration = ref(3)

const showMessage = (
  type?: "primary" | "success" | "warning" | "error" | "info"
) => {
  if (type) {
    if (type === "primary") {
      $message({
        title: title.value,
        message: message.value,
        duration: duration.value * 1000
      })
    } else {
      $message[type]({
        title: title.value,
        message: message.value,
        duration: duration.value * 1000
      })
    }
  } else {
    $message({
      title: title.value,
      message: message.value,
      icon: { svg: buttonIcon.value },
      showClose: showClose.value,
      duration: duration.value * 1000
    })
  }
}
</script>
