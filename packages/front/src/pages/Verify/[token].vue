<template>

</template>

<script setup lang="ts">
// redirect to login page with a message
import { useRoute  } from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth-pinia';
const route = useRoute();
const { token } = route.params as { token: string }

onMounted(async () => {
  if (!token) {
    console.log('error: no token');
    return;
  }
  const result = await useAuthStore().verify(token);
  if (result.isErr) {
    console.log('error verifying email');
  } else {
    console.log('email verified');
  }
});

</script
