import { defineComponent, ref } from 'vue';
import { isPasswordStrong, MIN_SIZE_PASSWORD } from '@/utils/password';
import { useAuthStore } from '@/stores/auth-pinia';
import router from '@/router';

export default defineComponent({
  name: 'ResetPasswordForm',
  setup() {
    // state
    const password = ref('');
    const confirmPassword = ref<string>('');

    const errorMessage = ref('');
    const successMessage = ref('');

    // forms
    const resetPasswordForm = ref();

    // title
    const currentTitle = '. ݁₊ ⊹ . ݁ Enter your new password ݁ . ⊹ ₊ ݁.';

    // rules
    const rules = {
      required: (v: string) =>
        (!!v && v.toString().trim().length > 0) || 'This field is required.',
      passwordStrong: (v: string) =>
        isPasswordStrong(v, MIN_SIZE_PASSWORD) ||
        'Password is not strong enough.',
      passwordsMatch: () =>
        password.value === confirmPassword.value || 'Passwords do not match.',
    };

    // actions
    const resetPassword = async () => {
      errorMessage.value = '';
      successMessage.value = '';

      const res = await resetPasswordForm.value?.validate?.();
      if (!res?.valid) return;

      if (!isPasswordStrong(password.value, MIN_SIZE_PASSWORD)) {
        errorMessage.value = 'Password is not strong enough.';
        return;
      }

      if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match.';
        return;
      }

      const createNewPasswordResult = await useAuthStore().createNewPassword(
        password.value,
        confirmPassword.value,
      );

      if (createNewPasswordResult.isErr) {
        errorMessage.value =
          'Failed to create a new password, please retry later';
        return;
      }

      // TODO Add a loader with this message before moving to login
      // 'Password has been reset successfully! You can now log in with your new password.';
      router.push('/Login');
    };

    return {
      // state
      password,
      confirmPassword,

      // forms
      resetPasswordForm,

      // ui
      rules,
      currentTitle,

      // actions
      resetPassword,

      // messages
      errorMessage,
      successMessage,
    };
  },
});
