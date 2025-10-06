<template></template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth-pinia';
const route = useRoute();
const router = useRouter();
const { token } = route.params as { token: string };

onMounted(async () => {
  if (!token) {
    //!TODO redirect to error page
    console.log('error: no token');
    return;
  }
  const result = await useAuthStore().confirmResetPassword(token);
  if (result.isErr) {
    console.log('error confirming reset password');
    return;
  }

  router.push('/ResetPasswordPage');
});
</script>
