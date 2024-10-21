<template>
  <div
    class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
  >
    {{ isRunning ? "倒计时中" : "倒计时停止" }}

    <v-countdown
      v-if="countdownTimeStamp"
      :key="useMillisecond.toString()"
      v-model="isRunning"
      :now="nowTimeStamp"
      :end="countdownTimeStamp"
      :use-millisecond="useMillisecond"
    />
    <v-form>
      <v-form-item label="自定义当前时间" fieldset="outline">
        <template #info>
          如果不填写则使用当前时间
        </template>
        <v-input-datetime v-model="nowValue" />
      </v-form-item>
      <v-form-item label="结束时间" fieldset="outline">
        <v-input-datetime v-model="countdownValue" />
      </v-form-item>
      <v-form-item label="操控">
        <v-button @click="isRunning = !isRunning">
          {{ isRunning ? "停止" : "开始" }}
        </v-button>
      </v-form-item>
      <v-form-item label="使用毫秒">
        <template #info>
          默认情况下只有小于1小时时会显示毫秒
        </template>
        <v-checkbox v-model="useMillisecond" />
      </v-form-item>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const isRunning = ref(true)
const useMillisecond = ref(false)

const nowValue = ref<string>()
const nowTimeStamp = computed(() => {
  if (!nowValue.value) return undefined
  return new Date(nowValue.value).getTime()
})
const now = new Date()
now.setHours(now.getHours() + 1)
const countdownValue = ref<string | undefined>(
  formateDate(now, "YYYY-MM-dd hh:mm:ss")
)
const countdownTimeStamp = computed(() => {
  if (!countdownValue.value) return undefined
  return new Date(countdownValue.value).getTime()
})
</script>
