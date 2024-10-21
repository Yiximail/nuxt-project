<template>
  <div>
    <div
      class="border-2 border-natural-300 dark:border-natural-700 rounded flex p-5 flex-col gap-1"
    >
      <v-steps :current="current" :status="status">
        <v-steps-item title="a title">
          In most case, normal ellipsis is fast enough. However, if you have a
          huge amount ellipsis to render, you may use n-performant-ellipsis in
          place of n-ellpisis. It has better render performance with some
          caveats: Inner component may be unmounted and remouted again. Use it
          carefully.
        </v-steps-item>
        <v-steps-item title="b title">
          b
        </v-steps-item>
        <v-steps-item title="c title">
          c
        </v-steps-item>
        d
      </v-steps>
      <v-steps :current="current" :status="status" type="vertical">
        <v-steps-item title="a title">
          In most case, normal ellipsis is fast enough. However, if you have a
          huge amount ellipsis to render, you may use n-performant-ellipsis in
          place of n-ellpisis. It has better render performance with some
          caveats: Inner component may be unmounted and remouted again. Use it
          carefully.
        </v-steps-item>
        <v-steps-item title="b title">
          b
        </v-steps-item>
        <v-steps-item title="c title">
          c
        </v-steps-item>
        d
      </v-steps>
    </div>
    <v-form>
      <v-form-item label="项">
        <div>
          {{ `current: ${current}` }}
        </div>
        <v-button @click="current--">
          prev
        </v-button>
        <v-button @click="current++">
          next
        </v-button>
      </v-form-item>
      <v-form-item label="状态">
        <v-radio-button v-model="status" value="wait">
          等待
        </v-radio-button>
        <v-radio-button v-model="status" value="process">
          进行中
        </v-radio-button>
        <v-radio-button v-model="status" value="finish">
          完成
        </v-radio-button>
        <v-radio-button v-model="status" value="error">
          错误
        </v-radio-button>
      </v-form-item>
    </v-form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })

const current = ref(0)
const status = ref<StepsStatus>("finish")
</script>
