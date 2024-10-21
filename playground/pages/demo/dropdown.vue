<template>
  <div
    class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
  >
    <div>
      <v-dropdown :disabled="disabled" :click-close="clickClose">
        <template #default="{ isShowPopper }">
          <v-button>
            触发元素
            <v-icon
              icon="mdi:chevron-down"
              class="transition"
              :class="isShowPopper ? 'rotate-180' : ''"
            />
          </v-button>
        </template>
        <template #content>
          <v-dropdown-item @click="clickHandle(1)">
            选项1
          </v-dropdown-item>
          <v-dropdown-item @click="clickHandle(2)">
            选项2
          </v-dropdown-item>
          <v-divider />
          <v-dropdown-item @click="clickHandle(3)">
            选项3
          </v-dropdown-item>
          <v-dropdown-item @click="clickHandle(4)">
            选项4
          </v-dropdown-item>
        </template>
      </v-dropdown>
      <v-dropdown :disabled="disabled" :click-close="clickClose">
        <template #default>
          <v-icon
            icon="mdi:account-box"
            class="cursor-pointer text-natural-400 my-5"
          />
        </template>
        <template #content>
          <v-dropdown-item @click="clickHandle(1)">
            选项1
          </v-dropdown-item>
          <v-dropdown-item @click="clickHandle(2)">
            选项2
          </v-dropdown-item>
          <v-divider />
          <v-dropdown-item @click="clickHandle(3)">
            选项3
          </v-dropdown-item>
          <v-dropdown-item @click="clickHandle(4)">
            选项4
          </v-dropdown-item>
        </template>
      </v-dropdown>
      <div class="py-5">
        <v-dropdown :disabled="disabled" :click-close="clickClose">
          <template #default>
            <span>文字触发</span>
          </template>
          <template #content>
            <v-dropdown-item @click="clickHandle(1)">
              选项1
            </v-dropdown-item>
            <v-dropdown-item @click="clickHandle(2)">
              选项2
            </v-dropdown-item>
            <v-divider />
            <v-dropdown-item @click="clickHandle(3)">
              选项3
            </v-dropdown-item>
            <v-dropdown-item @click="clickHandle(4)">
              选项4
            </v-dropdown-item>
          </template>
        </v-dropdown>
      </div>
    </div>
    <v-form>
      <v-form-item label="点击后关闭">
        <v-checkbox v-model="clickClose" />
      </v-form-item>
      <v-form-item label="禁用">
        <v-checkbox v-model="disabled" />
      </v-form-item>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const clickHandle = (index: number) => {
  $message(`点击了选项${index}`)
}

const disabled = ref(false)
const clickClose = ref(true)
</script>
