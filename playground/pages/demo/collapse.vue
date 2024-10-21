<template>
  <div
    class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
  >
    <div>垂直折叠</div>
    <div>
      <v-button @click="isShow1 = !isShow1">
        {{ isShow1 ? "收起" : "展开" }}
      </v-button>
    </div>
    <v-collapse :show="isShow1">
      <div class="bg-red-200 w-[600px] h-[300px]">
        {{ longText }}
        <v-image
          src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
          height="207px"
          width="300px"
        />
      </div>
    </v-collapse>

    <div>水平折叠</div>
    <div>
      <v-button @click="isShow2 = !isShow2">
        {{ isShow2 ? "收起" : "展开" }}
      </v-button>
    </div>
    <v-collapse :show="isShow2" type="horizontal">
      <div class="bg-red-200 w-[600px] h-[300px]">
        {{ longText }}
        <v-image
          src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
          height="207px"
          width="300px"
        />
      </div>
    </v-collapse>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const isShow1 = ref(false)
const isShow2 = ref(false)

const longText = ref(
  "If you want to create modal using useModal, you need to wrap the component where you call related methods inside n-modal-provider and use useModal to get the API."
)
</script>
