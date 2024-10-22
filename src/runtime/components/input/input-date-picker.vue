<template>
  <div :class="containerClass" v-bind="$attrs">
    <div :class="ui.header">
      <v-button
        type="text"
        :shadow="false"
        class="w-7"
        @click="preMonth"
      >
        <v-icon icon="mdi:chevron-right" class="rotate-180" />
      </v-button>
      <v-popper
        v-model="showYearPopper"
        trigger="click"
        placement="bottom"
        class="[--popper-bg:theme(colors.natural.100)] dark:[--popper-bg:theme(colors.natural.900)]"
        @show="setDefaultYearIndex"
      >
        <template #default>
          <div class="relative">
            <v-input-number
              v-if="showYearPopper"
              v-model="yearInput"
              class="w-[80px]"
              auto-focus
              :clearable="false"
              :focus-ignore-change="false"
              :min="1970"
              :max="2069"
              :ui="{ input: 'text-center text-primary-500' }"
              @blur="yearBlurHandle"
              @keydown.enter="yearConfirmHandle"
            />
            <transition v-else :name="transitionName">
              <v-button
                :key="year"
                type="text"
                :shadow="false"
                class="w-20"
                @wheel.stop="wheelYear"
              >
                {{ `${year}年` }}
              </v-button>
            </transition>
          </div>
        </template>
        <template #content>
          <div
            class="flex flex-wrap gap-1 justify-between p-2 w-[295px]"
            @wheel.stop="wheelYear"
          >
            <v-button
              v-for="item in yearList"
              :key="item"
              size="sm"
              class="w-[65px]"
              :type="year === item ? 'base' : 'text'"
              :border="year !== item"
              @click="setYear(item)"
            >
              {{ `${item}年` }}
            </v-button>
            <div class="w-full flex mt-3">
              <v-button
                size="sm"
                class="w-[65px]"
                type="text"
                border
                :disabled="yearList[0] <= 1970"
                @click="yearIndex -= 1"
              >
                上一页
              </v-button>
              <div class="flex-1 text-center font-medium text-sm">
                {{ `${yearList[0]} - ${yearList[yearList.length - 1]}` }}
              </div>
              <v-button
                size="sm"
                class="w-[65px]"
                type="text"
                border
                :disabled="yearList[yearList.length - 1] >= 2069"
                @click="yearIndex += 1"
              >
                下一页
              </v-button>
            </div>
          </div>
        </template>
      </v-popper>
      <v-popper
        trigger="click"
        placement="bottom"
        class="flex flex-wrap gap-1 justify-between p-2 w-[210px] [--popper-bg:theme(colors.natural.100)] dark:[--popper-bg:theme(colors.natural.900)]"
      >
        <template #default>
          <div class="relative">
            <transition :name="transitionName">
              <v-button
                :key="month"
                type="text"
                :shadow="false"
                class="w-20"
                @wheel.stop="wheelMonth"
              >
                {{ months[month] }}
              </v-button>
            </transition>
          </div>
        </template>
        <template #content>
          <v-button
            v-for="item in monthList"
            :key="item"
            size="sm"
            class="w-[60px]"
            :type="month === item ? 'base' : 'text'"
            :border="month !== item"
            @click="setMonth(item)"
          >
            {{ months[item] }}
          </v-button>
        </template>
      </v-popper>
      <v-button
        type="text"
        :shadow="false"
        class="w-7"
        @click="nextMonth"
      >
        <v-icon icon="mdi:chevron-right" />
      </v-button>
    </div>
    <div :class="ui.weeks">
      <div :class="ui.row">
        <div v-for="(day, index) in weeks" :key="index" :class="ui.day">
          {{ day }}
        </div>
      </div>
    </div>
    <transition :name="transitionName">
      <div
        :key="`${year}-${month}`"
        :class="ui.content"
        @wheel.stop="wheelMonth"
      >
        <div
          v-for="(row, rowIndex) in dateList"
          :key="rowIndex"
          :class="ui.row"
        >
          <v-input-date-picker-item
            v-for="date in row"
            :key="date.getTime()"
            :date="date"
            :month="month"
            :disabled="disabled"
            :selected-time="selectedTime"
            :start-time="selectedTimes[0]"
            :end-time="selectedTimes[1]"
            @click="clickDateHandle(date)"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import VPopper from "../popper/popper.vue"
import VIcon from "../icon/icon.vue"
import VButton from "../button/button.vue"
import VInputNumber from "../input/input-number.vue"
import VInputDatePickerItem from "./input-date-picker-item.vue"

import useUi from "../../composables/use-ui"
import classMerge from "../../utils/class-merge"
import { ref, computed, watch, onMounted } from "vue"

import type { DeepPartial, ClassNameValue, UI } from "../../types"

const props = withDefaults(
  defineProps<{
    /** 容器类名 */
    class?: ClassNameValue
    /** 组件样式配置 */
    ui?: DeepPartial<UI["inputDatePicker"]>
    /** 禁用 */
    disabled?:(date: Date) => boolean
    /** 单选时间 */
    value?: string
    /** 时间段，开始时间 */
    start?: string
    /** 时间段，结束时间 */
    end?: string
  }>(),
  {
    class: undefined,
    ui: undefined,
    value: undefined,
    start: undefined,
    end: undefined,
    disabled: () => false
  }
)

const emits = defineEmits<{
  change: [val: string]
}>()

const weeks = ["日", "一", "二", "三", "四", "五", "六"]
const months = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月"
]
const showYearPopper = ref(false)
const yearIndex = ref(0)
const yearInput = ref(0)
const yearList = computed(() => {
  const list: number[] = []
  const from = 1970 + yearIndex.value * 20
  const to = from + 20
  for (let i = from; i < to; i += 1) {
    list.push(i)
  }
  return list
})
const setDefaultYearIndex = () => {
  const index = Math.floor((year.value - 1970) / 20)
  yearIndex.value = index
  yearInput.value = year.value
}
const yearBlurHandle = () => {
  if (!yearInput.value) {
    yearInput.value = year.value
  } else {
    setYear(yearInput.value)
  }
}
const yearConfirmHandle = () => {
  if (!yearInput.value) {
    yearInput.value = year.value
  } else {
    setYear(yearInput.value)
  }
  showYearPopper.value = false
}
onMounted(() => {
  watch(year, setDefaultYearIndex)
})

const monthList = computed(() => {
  return Array.from({ length: 12 }, (_, i) => i)
})

const { ui } = useUi("inputDatePicker", props)

const containerClass = computed(() => {
  return classMerge(ui.value.container, props.class)
})

const initDate = props.value ?? props.start ?? props.end
let initDateObj = new Date(`${initDate} 00:00:00`)
if (isNaN(initDateObj.getTime())) {
  initDateObj = new Date()
}
const year = ref(initDateObj.getFullYear())
const month = ref(initDateObj.getMonth())
const dateList = computed(() => {
  const current = new Date(year.value, month.value, 1)
  const delta = -(7 + current.getDay()) % 7
  current.setDate(current.getDate() + delta)

  const list: Date[][] = []
  for (let i = 0; i < 6; i += 1) {
    const row: Date[] = []
    for (let j = 0; j < 7; j += 1) {
      const year = current.getFullYear()
      const month = current.getMonth()
      const date = current.getDate()
      row.push(new Date(year, month, date))
      current.setDate(current.getDate() + 1)
    }
    list.push(row)
  }
  return list
})

const selectedTime = computed(() => {
  if (!props.value) return undefined
  const time = new Date(`${props.value} 00:00:00`).getTime()
  return isNaN(time) ? 0 : time
})

const startTime = computed(() => {
  if (!props.start) return undefined
  const time = new Date(`${props.start} 00:00:00`).getTime()
  return isNaN(time) ? 0 : time
})

const endTime = computed(() => {
  if (!props.end) return undefined
  const time = new Date(`${props.end} 00:00:00`).getTime()
  return isNaN(time) ? 0 : time
})

const selectedTimes = computed(() => {
  if (!startTime.value || !endTime.value) return []
  if (startTime.value > endTime.value) {
    return [endTime.value, startTime.value]
  } else {
    return [startTime.value, endTime.value]
  }
})

let wheelTimer: number | undefined
const wheelYear = (event: WheelEvent) => {
  if (wheelTimer) return
  wheelTimer = window.setTimeout(() => {
    wheelTimer = undefined
  }, 100)
  if (event.deltaY > 0) {
    setYear(year.value + 1)
  } else {
    setYear(year.value - 1)
  }
}
const wheelMonth = (event: WheelEvent) => {
  if (wheelTimer) return
  wheelTimer = window.setTimeout(() => {
    wheelTimer = undefined
  }, 100)
  if (event.deltaY > 0) {
    nextMonth()
  } else {
    preMonth()
  }
}

const transitionName = ref<string>("")

const setYear = (value?: number) => {
  if (year.value === value) return
  if (value === undefined) {
    const date = new Date()
    value = date.getFullYear()
  }
  if (year.value > value) {
    transitionName.value = "v-input-date-picker-left"
  } else {
    transitionName.value = "v-input-date-picker-right"
  }
  year.value = value
  yearInput.value = value
}
const setMonth = (value?: number) => {
  if (month.value === value) return
  if (value === undefined) {
    const date = new Date()
    value = date.getMonth()
  }
  if (month.value > value) {
    transitionName.value = "v-input-date-picker-left"
  } else {
    transitionName.value = "v-input-date-picker-right"
  }
  month.value = value
}
const preMonth = () => {
  transitionName.value = "v-input-date-picker-left"
  if (month.value === 0) {
    year.value -= 1
    month.value = 11
  } else {
    month.value -= 1
  }
}
const nextMonth = () => {
  transitionName.value = "v-input-date-picker-right"
  if (month.value === 11) {
    year.value += 1
    month.value = 0
  } else {
    month.value += 1
  }
}

const clickDateHandle = (date: Date) => {
  const year = date.getFullYear()
  const monthStr = (date.getMonth() + 1).toString().padStart(2, "0")
  const dateStr = date.getDate().toString().padStart(2, "0")
  const str = `${year}-${monthStr}-${dateStr}`
  emits("change", str)
}

onMounted(() => {
  watch(() => props.value, (val) => {
    if (!val) return
    const valueTime = new Date(`${val} 00:00:00`).getTime()
    if (isNaN(valueTime)) return
    const valueYear = new Date(valueTime).getFullYear()
    const valueMonth = new Date(valueTime).getMonth()
    if (valueMonth !== month.value || valueYear !== year.value) {
      setYear(valueYear)
      setMonth(valueMonth)
    }
  })
})
</script>

<style scoped>
.v-input-date-picker-left-enter-active,
.v-input-date-picker-left-leave-active,
.v-input-date-picker-right-enter-active,
.v-input-date-picker-right-leave-active {
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-input-date-picker-left-enter-from,
.v-input-date-picker-right-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.v-input-date-picker-left-leave-to,
.v-input-date-picker-right-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.v-input-date-picker-left-leave-active,
.v-input-date-picker-right-leave-active {
  position: absolute;
}
</style>
