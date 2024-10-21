<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1 mb-5"
    >
      <v-uploader
        v-model="uploadList"
        :upload="upload"
        :size="size"
        :maxlength="maxlength"
      />
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
      <v-form-item label="上传数量" fieldset="outline">
        <v-input-number
          v-model="maxlength"
          :min="1"
          :max="10"
          :precision="0"
        />
      </v-form-item>
      <v-form-item label="模拟上传是否成功">
        <v-checkbox v-model="willScusscess" />
      </v-form-item>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const uploadList = ref<UploaderItem[]>([
  {
    id: "2",
    status: "success",
    src: "/image.png",
    data: "3bcdbf63bb54363b7c3d8d833d5cdf28"
  }
])
const upload: UploadFunction = async (file, cb) => {
  let percentage = 0
  for (let i = 0; i < 50; i++) {
    await new Promise((resolve) => window.setTimeout(resolve, 50))
    percentage += 2
    cb(percentage)
    if (!willScusscess.value && i === 25) return
  }
  return { status: "success", data: guid() }
}

const size = ref<"xl" | "lg" | "md" | "sm" | "xs">("md")
const maxlength = ref(5)
const willScusscess = ref(false)
</script>
