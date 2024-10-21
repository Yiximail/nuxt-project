<template>
  <div :class="containerClass">
    <div :class="ui.content">
      <div :class="ui.header">
        时
      </div>
      <div :class="ui.listContainer">
        <div
          :class="ui.list"
          @wheel.stop.prevent="($event: WheelEvent) => wheelHandle($event, 0)"
        >
          <v-input-time-picker-item
            v-for="num in 3"
            :key="num"
            :selected="times[0] === num - 1"
            @click="setTimes(0, num - 1)"
          >
            {{ num - 1 }}
          </v-input-time-picker-item>
        </div>
        <div
          :class="ui.list"
          @wheel.stop.prevent="($event: WheelEvent) => wheelHandle($event, 1)"
        >
          <v-input-time-picker-item
            v-for="num in 10"
            :key="num"
            :selected="times[1] === num - 1"
            :disabled="times[0] >= 2 && num > 4"
            @click="setTimes(1, num - 1)"
          >
            {{ num - 1 }}
          </v-input-time-picker-item>
        </div>
      </div>
    </div>
    <v-divider type="vertical" class="my-3" />
    <div :class="ui.content">
      <div :class="ui.header">
        分
      </div>
      <div :class="ui.listContainer">
        <div
          :class="ui.list"
          @wheel.stop.prevent="($event: WheelEvent) => wheelHandle($event, 2)"
        >
          <v-input-time-picker-item
            v-for="num in 6"
            :key="num"
            :selected="times[2] === num - 1"
            @click="setTimes(2, num - 1)"
          >
            {{ num - 1 }}
          </v-input-time-picker-item>
        </div>
        <div
          :class="ui.list"
          @wheel.stop.prevent="($event: WheelEvent) => wheelHandle($event, 3)"
        >
          <v-input-time-picker-item
            v-for="num in 10"
            :key="num"
            :selected="times[3] === num - 1"
            @click="setTimes(3, num - 1)"
          >
            {{ num - 1 }}
          </v-input-time-picker-item>
        </div>
      </div>
    </div>
    <v-divider type="vertical" class="my-3" />
    <div :class="ui.content">
      <div :class="ui.header">
        秒
      </div>
      <div :class="ui.listContainer">
        <div
          :class="ui.list"
          @wheel.stop="($event: WheelEvent) => wheelHandle($event, 4)"
        >
          <v-input-time-picker-item
            v-for="num in 6"
            :key="num"
            :selected="times[4] === num - 1"
            @click="setTimes(4, num - 1)"
          >
            {{ num - 1 }}
          </v-input-time-picker-item>
        </div>
        <div
          :class="ui.list"
          @wheel.stop="($event: WheelEvent) => wheelHandle($event, 5)"
        >
          <v-input-time-picker-item
            v-for="num in 10"
            :key="num"
            :selected="times[5] === num - 1"
            @click="setTimes(5, num - 1)"
          >
            {{ num - 1 }}
          </v-input-time-picker-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VInputTimePickerItem from "./input-time-picker-item.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { computed } from "vue"

import type { DeepPartial, ClassNameValue, UI } from "../../types"

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["inputTimePicker"]>
    /** 时间值 */
    value?: string
  }>(),
  {
    class: undefined,
    ui: undefined,
    value: undefined
  }
)

const emits = defineEmits<{
  change: [val: string]
}>()

const { ui } = useUi("inputTimePicker", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})

const times = computed(() => {
  const list: number[] = []
  if (!props.value) return list
  const strs = props.value.match(/\d{1,2}/g)
  if (!strs) return list
  const nums = strs.map((str) => parseInt(str))
  if (typeof nums[0] === "number" && nums[0] < 24) {
    list[0] = (nums[0] / 10) | 0
    list[1] = nums[0] % 10
  }
  if (typeof nums[1] === "number" && nums[1] < 60) {
    list[2] = (nums[1] / 10) | 0
    list[3] = nums[1] % 10
  }
  if (typeof nums[2] === "number" && nums[2] < 60) {
    list[4] = (nums[2] / 10) | 0
    list[5] = nums[2] % 10
  }
  return list
})

const updateTimes = (list: number[]) => {
  const hour = list[0] * 10 + list[1]
  const minute = list[2] * 10 + list[3]
  const second = list[4] * 10 + list[5]
  const hourStr = hour.toString().padStart(2, "0")
  const minuteStr = minute.toString().padStart(2, "0")
  const secondStr = second.toString().padStart(2, "0")
  const time = `${hourStr}:${minuteStr}:${secondStr}`
  emits("change", time)
}

const setTimes = (index: number, num: number) => {
  const list: number[] = []
  for (let i = 0; i < 6; i += 1) {
    list[i] = times.value[i] ?? 0
  }
  list[index] = num
  let hour = list[0] * 10 + list[1]
  if (hour >= 24) {
    if (index === 0) {
      hour = list[0] * 10
    } else {
      hour = list[1]
    }
  }
  list[0] = (hour / 10) | 0
  list[1] = hour % 10
  updateTimes(list)
}

const wheelHandle = (event: WheelEvent, index: number) => {
  event.preventDefault()
  const delta = event.deltaY > 0 ? 1 : -1
  let num = times.value[index] ?? 0
  num += delta
  switch (index) {
    case 0:
      if (num > 2) {
        num = 0
      } else if (num < 0) {
        num = 2
      }
      break
    case 2:
    case 4:
      if (num > 5) {
        num = 0
      } else if (num < 0) {
        num = 5
      }
      break
    case 1:
    case 3:
    case 5:
      if (num > 9) {
        num = 0
      } else if (num < 0) {
        num = 9
      }
      break
  }
  setTimes(index, num)
}
</script>
