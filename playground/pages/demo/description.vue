<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1 mb-5"
    >
      <v-description :layout="layout" :column="column" :border="border">
        <v-description-item
          v-for="(item, index) in content"
          :key="index"
          :label="`标签${index + 1}`"
          :span="item.span"
        >
          {{ item.content }}
        </v-description-item>
      </v-description>
    </div>
    <v-form>
      <v-form-item label="列数" fieldset="outline">
        <v-input-number
          v-model="column"
          :min="1"
          :max="5"
          :precision="0"
        />
      </v-form-item>
      <v-form-item label="布局">
        <v-radio-button v-model="layout" value="vertical">
          垂直布局
        </v-radio-button>
        <v-radio-button v-model="layout" value="horizontal">
          水平布局
        </v-radio-button>
        <v-radio-button v-model="layout" value="vertical-inline">
          垂直内联布局
        </v-radio-button>
        <v-radio-button v-model="layout" value="horizontal-inline">
          水平内联布局
        </v-radio-button>
      </v-form-item>
      <v-form-item label="是否显示边框">
        <v-checkbox v-model="border" />
      </v-form-item>
      <v-form-item
        v-for="(item, index) in content"
        :key="index"
        :label="`标签${index + 1}`"
      >
        <v-fieldset label="内容">
          <v-input v-model="item.content" />
          <v-divider type="vertical" />
          <v-select
            v-model="item.span"
            class="flex-none w-[200px]"
            :clearable="false"
            :show-search="false"
          >
            <v-option v-for="i in 3" :key="i" :value="i">
              {{ `占${i}位` }}
            </v-option>
          </v-select>
        </v-fieldset>
      </v-form-item>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const column = ref(3)
const border = ref(true)

const layout = ref<
"vertical" | "horizontal" | "vertical-inline" | "horizontal-inline"
>("horizontal")

const content = ref<{ content: string, span: number | undefined }[]>([
  { content: "内容1", span: undefined },
  { content: "内容2", span: 1 },
  { content: "内容3", span: 1 },
  { content: "内容4", span: 2 },
  { content: "内容5", span: 1 },
  { content: "内容6", span: 1 },
  { content: "内容7", span: 2 }
])
</script>
