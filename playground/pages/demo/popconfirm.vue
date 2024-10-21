<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded p-5 flex gap-1"
    >
      <v-popconfirm :title="title" :content="content">
        <v-button color="primary">
          primary
        </v-button>
      </v-popconfirm>
      <v-popconfirm :title="title" :content="content" confirm-color="success">
        <v-button color="success">
          success
        </v-button>
      </v-popconfirm>
      <v-popconfirm :title="title" :content="content" confirm-color="warning">
        <v-button color="warning">
          warning
        </v-button>
      </v-popconfirm>
      <v-popconfirm :title="title" :content="content" confirm-color="danger">
        <v-button color="danger">
          error
        </v-button>
      </v-popconfirm>
      <v-popconfirm :title="title" :content="content" confirm-color="info">
        <v-button color="info">
          info
        </v-button>
      </v-popconfirm>
      <v-popconfirm
        :title="title"
        :icon="{ svg: buttonIcon }"
        :content="content"
        :show-confirm="showConfirm"
        :show-cancel="showCancel"
        :confirm-text="confirmText"
        :cancel-text="cancelText"
        :confirm-color="confirmColor"
        :cancel-color="cancelColor"
      >
        <v-button color="natural">
          自定义对话框
        </v-button>
      </v-popconfirm>
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
        <v-input v-model="content" />
      </v-form-item>
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
            'danger',
            'info'
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
            'danger',
            'info'
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
definePageMeta({ layout: "demo" })

const buttonIcon = ref(
  "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M13 13h-2V7h2m0 10h-2v-2h2M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2\"/></svg>"
)
const showConfirm = ref(true)
const showCancel = ref(true)
const confirmText = ref("确定")
const cancelText = ref("取消")
const confirmColor = ref<Colors>()
const cancelColor = ref<Colors>()

const title = ref("标题")
const content = ref("内容")
</script>
