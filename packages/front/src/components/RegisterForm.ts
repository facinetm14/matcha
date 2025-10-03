import { defineComponent, computed, ref } from 'vue';
import { isPasswordStrong, MIN_SIZE_PASSWORD } from '../utils/password';
import { isValidEmail } from '../../../shared/is-valid-email';
import {
  isUsernameAvailable,
  isValidUsername,
  MIN_SIZE_USERNAME,
} from '@/utils/username';
import { useAuthStore } from '@/stores/auth-pinia';
import { isEmailAvailable } from '@/utils/email';

export default defineComponent({
  name: 'RegisterForm',
  setup() {
    // state
    const step = ref(1);

    const username = ref<string>('');
    const firstname = ref<string>('');
    const lastname = ref<string>('');
    const password = ref<string>('');
    const confirmPassword = ref<string>('');
    const email = ref('');

    const errorMessage = ref<string>('');
    const successMessage = ref<string>('');

    // forms
    const form1 = ref<HTMLFormElement>();
    const form2 = ref<HTMLFormElement>();
    const form3 = ref<HTMLFormElement>();
    const form4 = ref<HTMLFormElement>();
    const form5 = ref<HTMLFormElement>();

    // friendly titles per step
    const titles: Record<number, string> = {
      1: '. ݁₊ ⊹ . ݁ What should we call you? ݁ . ⊹ ₊ ݁.',
      2: '. ݁₊ ⊹ . ݁ Let’s get to know you better ݁ . ⊹ ₊ ݁.',
      3: '. ݁₊ ⊹ . ݁ Secure your account ݁ . ⊹ ₊ ݁.',
      4: '. ݁₊ ⊹ . ݁ Where can we reach you? ݁ . ⊹ ₊ ݁.',
      5: '. ݁₊ ⊹ . ݁ Registered successfully ݁ . ⊹ ₊ ݁.',
    };
    const currentTitle = computed(() => titles[step.value]);

    // progress
    const progress = computed(() => ((step.value - 1) / 4) * 100);

    // rules
    const rules = {
      required: (v: string) =>
        (!!v && v.toString().trim().length > 0) || 'This field is required.',
      usernameValid: async (v: string) => {
        if (!isValidUsername(v)) {
          return `Username must be at least ${MIN_SIZE_USERNAME} characters and contain only letters, numbers, and underscores.`;
        }
        const isAvailable = await isUsernameAvailable(v);
        if (!isAvailable) {
          return 'username already used';
        }
      },

      email: async (v: string) => {
        if (!isValidEmail(v)) {
          return 'Invalid email format.';
        }

        const isAvailable = await isEmailAvailable(v);
        if (!isAvailable) {
          return 'This email is already used';
        }
      },
      passwordStrong: (v: string) =>
        isPasswordStrong(v, MIN_SIZE_PASSWORD) ||
        'Password is not strong enough.',
      passwordsMatch: () =>
        password.value === confirmPassword.value || 'Passwords do not match.',
    };

    const validateCurrentStep = async () => {
      const map: Record<number, HTMLFormElement | undefined> = {
        1: form1.value,
        2: form2.value,
        3: form3.value,
        4: form4.value,
        5: form5.value,
      };
      const f = map[step.value];
      if (!f) return true;
      const res = await f.validate?.();
      return res?.valid ?? true;
    };

    const next = async () => {
      errorMessage.value = '';
      const valid = await validateCurrentStep();
      if (!valid) return;
      if (step.value < 4) step.value += 1;
    };

    const back = () => {
      errorMessage.value = '';
      if (step.value > 1) step.value -= 1;
    };

    const register = async () => {
      errorMessage.value = '';
      successMessage.value = '';

      if (
        !username.value ||
        !firstname.value ||
        !lastname.value ||
        !password.value ||
        !confirmPassword.value ||
        !email.value
      ) {
        errorMessage.value = 'All fields are required.';
        return;
      }

      if (!isValidUsername(username.value, MIN_SIZE_USERNAME)) {
        errorMessage.value = `Username must be at least ${MIN_SIZE_USERNAME} characters and contain only letters, numbers, and underscores.`;
        return;
      }

      if (!isPasswordStrong(password.value, MIN_SIZE_PASSWORD)) {
        errorMessage.value = 'Password is not strong enough.';
        return;
      }

      if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match.';
        return;
      }

      if (!isValidEmail(email.value)) {
        errorMessage.value = 'Invalid email format.';
        return;
      }

      // successMessage.value = 'You have registered successfully! Please check your email to verify your account.';
      const user = {
        username: username.value,
        firstName: firstname.value,
        lastName: lastname.value,
        passwd: password.value,
        confirmPasswd: confirmPassword.value,
        email: email.value,
      };

      const registerResult = await useAuthStore().register(user);
      if (registerResult.isErr) {
        errorMessage.value = 'Registration failed. Please try again.';
        step.value = 4;
        return;
      }
      step.value = 5;
    };

    return {
      // state
      step,
      username,
      firstname,
      lastname,
      password,
      confirmPassword,
      email,
      errorMessage,
      successMessage,

      // forms
      form1,
      form2,
      form3,
      form4,

      // ui
      progress,
      rules,
      currentTitle,

      // actions
      next,
      back,
      register,
    };
  },
});
