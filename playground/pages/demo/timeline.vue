<template>
  <div>
    <v-timeline>
      <v-timeline-item title="title a" time="2024年7月8日 12:13:14">
        In most case, normal ellipsis is fast enough. However, if you have a
        huge amount ellipsis to render, you may use n-performant-ellipsis in
        place of n-ellpisis. It has better render performance with some caveats:
        Inner component may be unmounted and remouted again. Use it carefully.
      </v-timeline-item>
      <v-timeline-item title="title b" time="2024年7月8日 12:13:14">
        In most case, normal ellipsis is fast enough. However, if you have a
        huge amount ellipsis to render, you may use n-performant-ellipsis in
        place of n-ellpisis. It has better render performance with some caveats:
        Inner component may be unmounted and remouted again. Use it carefully.
      </v-timeline-item>
    </v-timeline>
    <v-timeline type="vertical">
      <v-timeline-item
        color="primary"
        title="title a"
        time="2024年7月8日 12:13:14"
      >
        In most case, normal ellipsis is fast enough. However, if you have a
        huge amount ellipsis to render, you may use n-performant-ellipsis in
        place of n-ellpisis. It has better render performance with some caveats:
        Inner component may be unmounted and remouted again. Use it carefully.
      </v-timeline-item>
      <v-timeline-item color="danger" title="title b">
        In most case, normal ellipsis is fast enough. However, if you have a
        huge amount ellipsis to render, you may use n-performant-ellipsis in
        place of n-ellpisis. It has better render performance with some caveats:
        Inner component may be unmounted and remouted again. Use it carefully.
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "demo" })
</script>
