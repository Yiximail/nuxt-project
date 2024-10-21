<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
    >
      <div class="flex items-center gap-10">
        <v-tooltip
          :content="content"
          :placement="placement"
          :trigger="trigger"
          :arrow="arrow"
        >
          <v-button>按钮</v-button>
        </v-tooltip>
        <v-tooltip
          :content="content"
          :placement="placement"
          :trigger="trigger"
          :arrow="arrow"
        >
          <span>文本</span>
        </v-tooltip>
        <v-tooltip
          :content="content"
          :placement="placement"
          :trigger="trigger"
          :arrow="arrow"
        >
          <v-image
            src="/image.png"
            height="50"
            width="50"
            class="inline-block"
          />
        </v-tooltip>

        <v-tooltip
          :content="content"
          :placement="placement"
          :trigger="trigger"
          :arrow="arrow"
        >
          <v-image
            src="/image.png"
            height="50"
            width="50"
            class="inline-block"
          />
        </v-tooltip>
      </div>
    </div>
    <v-form>
      <v-form-item label="内容" fieldset="outline">
        <v-input v-model="content" />
      </v-form-item>
      <v-form-item label="方向" fieldset="outline">
        <v-select v-model="placement" :options="placements" />
      </v-form-item>
      <v-form-item label="触发方式">
        <v-radio-button v-model="trigger" value="hover">
          鼠标悬浮
        </v-radio-button>
        <v-radio-button v-model="trigger" value="click">
          点击
        </v-radio-button>
        <v-radio-button v-model="trigger" value="focus">
          焦点
        </v-radio-button>
        <v-radio-button v-model="trigger">
          默认
        </v-radio-button>
      </v-form-item>
      <v-form-item label="显示箭头">
        <v-checkbox v-model="arrow" />
      </v-form-item>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const content = ref("提示内容 提示内容 提示内容 提示内容 提示内容")
const arrow = ref(true)

const trigger = ref<"hover" | "click" | "focus">()
const placement = ref<Placement>()
const placements = [
  { label: "上", value: "top" },
  { label: "下", value: "bottom" },
  { label: "左", value: "left" },
  { label: "右", value: "right" },
  { label: "上方开始", value: "top-start" },
  { label: "上方结束", value: "top-end" },
  { label: "下方开始", value: "bottom-start" },
  { label: "下方结束", value: "bottom-end" },
  { label: "左边开始", value: "left-start" },
  { label: "左边结束", value: "left-end" },
  { label: "右边开始", value: "right-start" },
  { label: "右边结束", value: "right-end" }
]
</script>
