<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1 mb-5"
    >
      <v-ellipsis>
        <div class="w-[200px] truncate">
          {{ shortText }}
        </div>
      </v-ellipsis>
    </div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
    >
      <v-ellipsis>
        <div class="w-[200px] whitespace-pre-wrap line-clamp-3">
          {{ longText }}
        </div>
      </v-ellipsis>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const shortText = ref(
  "If you want to create modal using useModal,\n\n you need to wrap the component where you call related methods inside n-modal-provider and use useModal to get the API.\n"
)
const longText = ref(
  "If you want to create modal using useModal,\n\n you need to wrap the component where you call related methods inside n-modal-provider and use useModal to get the API.\n".repeat(
    10
  )
)
</script>
