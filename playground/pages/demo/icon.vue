<template>
  <div>
    <div class="border-2 border-natural-300 dark:border-natural-700 rounded p-5 mb-5">
      <div :style="{ display: 'inline-flex', alignItems: 'center' }">
        文本A
        <v-icon
          :icon="{
            class: iconClass,
            src: type === 'link' ? iconSrc : undefined,
            svg: type === 'svg' ? iconSvg : undefined
          }"
          :block="block"
        />
        文本B
      </div>
      <div :style="{ display: 'inline-flex', alignItems: 'center' }">
        文本A
        文本B
      </div>
    </div>
    <v-form>
      <v-form-item label="类型">
        <v-radio-button v-model="type" value="class">
          类名
        </v-radio-button>
        <v-radio-button v-model="type" value="link">
          链接
        </v-radio-button>
        <v-radio-button v-model="type" value="svg">
          SVG
        </v-radio-button>
      </v-form-item>
      <v-form-item label="类名" fieldset="outline">
        <v-input v-model="iconClass" />
      </v-form-item>
      <v-form-item label="链接" fieldset="outline">
        <v-input v-model="iconSrc" />
      </v-form-item>
      <v-form-item label="SVG" fieldset="outline">
        <v-input v-model="iconSvg" />
      </v-form-item>
      <v-form-item label="块级元素">
        <v-checkbox v-model="block" />
      </v-form-item>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const iconClass = ref<string>("mdi:image")
const iconSrc = ref<string>(
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAM1BMVEVHcEwlQ1YlQ1YlQ1YlQ1YlQ1YlQ1YlQ1YlQ1YlQ1YlQ1YlQ1YlQ1YlQ1YlQ1YlQ1YlQ1ZYFkBnAAAAEXRSTlMAHGCXvGzj/1H0yoSscwvRMfX64QMAAAEcSURBVHgBhZONroYgCIYRzBeFrPu/2vMlq9k8W8/Yyn94AZpILPmHcKL/2AoeyrYsawXQjFXVGoCq9MKBuvd71PcKOE0cgNALAY7Xui5vTjscOGnhfF7R6XzfLf7n+Tq93+vknKCO+OMT9KMYPVRcehTs4UmTn0mO0RBzRyFKQMRf0IZ5eMjXfUAiRrsOpCRuw7aeOlkE1sAksKFEyzW36kf1AqMM+M7dIJTB4/7jQCvIw4QMF67IlKF0sriE+WWmjot0b8hYQZNE9wbHQgTDyMNJw8oQwiAjzBMLIVcDh1AFbyI7IdSQWtf1R+pI1oaJoq9kRbrP9oTHc7qnwkhsZtvZaSmYj5L7Ltrvsv9unKn1VJWX1vto3q/2/wPTBxAwOTKhCgAAAABJRU5ErkJggg=="
)
const iconSvg = ref<string>(
  "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M7 12c2.2 0 4-1.8 4-4S9.2 4 7 4S3 5.8 3 8s1.8 4 4 4m4 8v-5.3c-1.1-.4-2.5-.7-4-.7c-3.9 0-7 1.8-7 4v2zm4-16c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z\"/></svg>"
)

const type = ref<"class" | "link" | "svg">("class")

const block = ref(false)
</script>
