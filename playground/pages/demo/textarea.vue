<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
    >
      <div>
        {{ `输入内容: ${inputValue}` }}
      </div>
      <div class="">
        <v-fieldset
          :label="label"
          :type="type"
          :size="size"
          :always-show="alwaysShow"
        >
          <v-textarea
            v-model="inputValue"
            :placeholder="placeholder"
            :maxlength="maxlength"
            :is-show-limit="isShowLimit"
            :disabled="disabled"
            :clearable="clearable"
            :min-rows="minRows"
            :max-rows="maxRows"
            :auto-size="autoSize"
          />
        </v-fieldset>
      </div>
    </div>
    <v-form>
      <v-form-item label="大小">
        <v-radio-button
          v-for="value in ['xl', 'lg', 'md', 'sm', 'xs']"
          :key="value"
          v-model="size"
          :value="value"
        >
          {{ value }}
        </v-radio-button>
      </v-form-item>
      <v-form-item label="输入框标签" fieldset="outline">
        <v-input v-model="label" />
      </v-form-item>
      <v-form-item label="占位" fieldset="outline">
        <v-input v-model="placeholder" />
      </v-form-item>
      <v-form-item label="最大长度" fieldset="outline">
        <v-input-number v-model="maxlength" :min="0" :precision="0" />
      </v-form-item>
      <v-form-item label="最小行数" fieldset="outline">
        <v-input-number v-model="minRows" :min="1" :precision="0" />
      </v-form-item>
      <v-form-item label="最大行数" fieldset="outline">
        <v-input-number v-model="maxRows" :min="1" :precision="0" />
      </v-form-item>
      <v-form-item label="输入框标签" fieldset="outline">
        <v-input v-model="label" />
      </v-form-item>
      <v-form-item label="输入框类型">
        <v-radio-button v-model="type" value="outline">
          外边框
        </v-radio-button>
        <v-radio-button v-model="type" value="underline">
          下划线
        </v-radio-button>
        <v-radio-button v-model="type" value="none">
          无
        </v-radio-button>
      </v-form-item>
      <div class="flex gap-10">
        <v-form-item label="显示长度限制">
          <v-checkbox v-model="isShowLimit" />
        </v-form-item>
        <v-form-item label="自适应高度">
          <v-checkbox v-model="autoSize" />
        </v-form-item>
        <v-form-item label="禁用">
          <v-checkbox v-model="disabled" />
        </v-form-item>
        <v-form-item label="可清除">
          <v-checkbox v-model="clearable" />
        </v-form-item>
        <v-form-item label="一直显示">
          <v-checkbox v-model="alwaysShow" />
        </v-form-item>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const inputValue = ref("预设文本")
const label = ref("多行输入框")
const placeholder = ref("请输入内容")
const maxlength = ref(200)
const autoSize = ref(true)
const minRows = ref(3)
const maxRows = ref(6)

const size = ref<"xl" | "lg" | "md" | "sm" | "xs">("md")
const type = ref<"outline" | "underline" | "none">("outline")

const disabled = ref(false)
const clearable = ref(true)
const isShowLimit = ref(true)
const alwaysShow = ref(false)
</script>
