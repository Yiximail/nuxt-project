<template>
  <div
    class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
  >
    <div>
      <span>不可预览 文字A</span>
      <v-image
        src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
        width="300px"
        :block="block"
      />
      <span>文字B</span>
    </div>

    <div>
      <span>可预览  文字A</span>
      <v-image-preview>
        <v-image
          src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
          width="300px"
          :block="block"
        />
      </v-image-preview>
      <span>文字B</span>
    </div>

    <div>
      <span>图片错误 文字A</span>
      <v-image
        src="ht"
        height="207px"
        width="300px"
        :block="block"
      />
      <span>文字B</span>
    </div>

    <div>
      <span>图片缺省 文字A</span>
      <v-image height="207px" width="300px" :block="block" />
      <span>文字B</span>
    </div>
    <v-form>
      <v-form-item label="块级元素">
        <v-checkbox v-model="block" />
      </v-form-item>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const block = ref(false)
</script>
