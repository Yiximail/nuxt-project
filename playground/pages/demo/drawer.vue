<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded p-5 flex gap-1"
    >
      <v-button @click="showDrawer('left')">
        左边
      </v-button>
      <v-button @click="showDrawer('top')">
        上面
      </v-button>
      <v-button @click="showDrawer('bottom')">
        下面
      </v-button>
      <v-button @click="showDrawer('right')">
        右边
      </v-button>
      <v-drawer
        v-model="isShow"
        :placement="placement"
        :title="title"
        :icon="{ svg: buttonIcon }"
        :show-close="showClose"
        :close-on-click="closeOnClick"
      >
        {{ content }}
      </v-drawer>
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
      <v-form-item label="显示关闭按钮">
        <v-checkbox v-model="showClose" />
      </v-form-item>
      <v-form-item label="点击蒙版关闭">
        <v-checkbox v-model="closeOnClick" />
      </v-form-item>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const buttonIcon = ref(
  "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M13 13h-2V7h2m0 10h-2v-2h2M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2\"/></svg>"
)
const isShow = ref(false)
const showClose = ref(true)
const closeOnClick = ref(true)

const title = ref("标题")
const content = ref("内容")

const placement = ref<"top" | "left" | "right" | "bottom">("top")
const showDrawer = (val: "top" | "left" | "right" | "bottom") => {
  isShow.value = true
  placement.value = val
}
</script>
