import { defineComponent, computed, ref } from 'vue';
import { isValidEmail } from '../../../shared/is-valid-email';
import { isValidUsername, MIN_SIZE_USERNAME } from '@/utils/username';
import { AuthApiError, useAuthStore } from '@/stores/auth-pinia';

export default defineComponent({
  name: 'LoginForm',
  setup() {
    // state
    const forgotMode = ref(false);
    const username = ref('');
    const password = ref('');
    const email = ref('');

    const errorMessage = ref('');
    const successMessage = ref('');

    // forms
    const loginForm = ref();
    const forgotForm = ref();

    // titles
    const titles = {
      login: '. ݁₊ ⊹ . ݁ Welcome back ݁ . ⊹ ₊ ݁.',
      forgot: '. ݁₊ ⊹ . ݁ Reset your password ݁ . ⊹ ₊ ݁.',
    };
    const currentTitle = computed(() =>
      forgotMode.value ? titles.forgot : titles.login,
    );

    // rules
    const rules = {
      required: (v: string) =>
        (!!v && v.toString().trim().length > 0) || 'This field is required.',
      email: (v: string) => isValidEmail(v) || 'Invalid email format.',
    };

    // actions
    const openForgot = () => {
      errorMessage.value = '';
      successMessage.value = '';
      forgotMode.value = true;
    };

    const backToLogin = () => {
      errorMessage.value = '';
      successMessage.value = '';
      forgotMode.value = false;
    };

    const login = async () => {
      errorMessage.value = '';
      successMessage.value = '';

      const res = await loginForm.value?.validate?.();
      if (!res?.valid) return;

      if (
        !username.value ||
        !password.value ||
        !isValidUsername(username.value, MIN_SIZE_USERNAME)
      ) {
        errorMessage.value = 'Username and/or password are incorrect.';
        return;
      }

      const loginResult = await useAuthStore().signIn(
        username.value,
        password.value,
      );
      if (loginResult.isErr) {
        errorMessage.value = 'Username and/or password are incorrect.';
        return;
      }

      const { token, refresh } = loginResult.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refresh);
      successMessage.value = 'Logged in successfully!';
    };

    const sendReset = async () => {
      errorMessage.value = '';
      successMessage.value = '';

      const res = await forgotForm.value?.validate?.();
      if (!res?.valid) return;

      if (!email.value) {
        errorMessage.value = 'Email is required.';
        return;
      }
      if (!isValidEmail(email.value)) {
        errorMessage.value = 'Invalid email format.';
        return;
      }

      const resetPasswordResult = await useAuthStore().sendResetPasswordLink(
        email.value,
      );

      if (resetPasswordResult.isErr) {
        const error = resetPasswordResult.error;

        if (error === AuthApiError.USER_NOT_FOUND) {
          errorMessage.value = `No user found with email ${email.value}`;
          return;
        }

        if (error === AuthApiError.FAILED_TO_SEND_RESET_PASSWORD_LINK) {
          errorMessage.value = `Failed to send reset link, please try later`;
          return;
        }
      }
      successMessage.value = 'A reset link has been successfully sent';
    };

    return {
      // state
      forgotMode,
      username,
      password,
      email,
      errorMessage,
      successMessage,

      // forms
      loginForm,
      forgotForm,

      // ui
      rules,
      currentTitle,

      // actions
      openForgot,
      backToLogin,
      login,
      sendReset,
    };
  },
});
