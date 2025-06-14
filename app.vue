<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UsersList />
  </div>
</template>

<script setup lang="ts">
import UsersList from '~/components/UsersList.vue'
</script>

<style>
@import '~/assets/css/main.css';
</style>
