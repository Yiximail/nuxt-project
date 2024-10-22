<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
    >
      <div>
        {{ `输入内容: ${inputValue}` }}
      </div>
      <div class="">
        <v-fieldset :label="label" :type="type">
          <v-quill-viewer v-if="quillType === 'viewer'" :html="quillText" />
          <v-quill
            v-else
            :key="disabled?.toString()"
            v-model="quillText"
            :image-process="fakeUpload ? imageProcess : undefined"
            :maxlength="maxlength"
            :is-show-limit="isShowLimit"
            :disabled="disabled"
            :placeholder="placeholder"
          />
        </v-fieldset>
      </div>
    </div>
    <v-form>
      <v-form-item label="模式">
        <v-radio-button v-model="quillType" value="viewer">
          文本只读
        </v-radio-button>
        <v-radio-button v-model="quillType" value="editor">
          编辑器
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
        <v-form-item label="模拟上传">
          <v-checkbox v-model="fakeUpload" />
        </v-form-item>
        <v-form-item label="显示长度限制">
          <v-checkbox v-model="isShowLimit" />
        </v-form-item>
        <v-form-item label="禁用">
          <v-checkbox v-model="disabled" />
        </v-form-item>
        <v-form-item label="可清除">
          <v-checkbox v-model="clearable" />
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

const quillType = ref<"viewer" | "editor">("editor")
const quillText = ref("")

const type = ref<"outline" | "underline" | "none">("outline")

const fakeUpload = ref(true)
const imageProcess = async (file: File) => {
  console.log("upload", file)
  $message("模拟上传中...")
  await new Promise((resolve) => window.setTimeout(resolve, 1000))
  // const url = URL.createObjectURL(file)
  // return url
  return "https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
}

const disabled = ref(false)
const clearable = ref(true)
const isShowLimit = ref(true)
</script>
