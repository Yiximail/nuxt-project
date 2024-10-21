<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts"></script>

<style>
.v-page-enter-active,
.v-page-leave-active {
  transition: all 0.4s;
}
.v-page-enter-from,
.v-page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
