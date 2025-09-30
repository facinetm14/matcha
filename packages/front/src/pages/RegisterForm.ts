import { defineComponent, computed, ref } from 'vue';
import { isPasswordStrong, MIN_SIZE_PASSWORD } from '../utils/password';
import { isValidEmail } from '../../../shared/is-valid-email';
import { isValidUsername, MIN_SIZE_USERNAME } from '@/utils/username';

export default defineComponent({
  name: 'RegisterForm',
  setup() {
    // state
    const step = ref(1);

    const username = ref('');
    const firstname = ref('');
    const lastname = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const email = ref('');

    const errorMessage = ref('');
    const successMessage = ref('');

    // forms
    const form1 = ref();
    const form2 = ref();
    const form3 = ref();
    const form4 = ref();
    const form5 = ref();

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
      required: (v: string) => (!!v && v.toString().trim().length > 0) || 'This field is required.',
      usernameValid: (v: string) => isValidUsername(v, MIN_SIZE_USERNAME) || `Username must be at least ${MIN_SIZE_USERNAME} characters and contain only letters, numbers, and underscores.`,
      email: (v: string) => isValidEmail(v) || 'Invalid email format.',
      passwordStrong: (v: string) =>
        isPasswordStrong(v, MIN_SIZE_PASSWORD) || 'Password is not strong enough.',
      passwordsMatch: () =>
        password.value === confirmPassword.value || 'Passwords do not match.',
      // TODO: email exists check
    };

    const validateCurrentStep = async () => {
      const map: Record<number, any> = {
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

      // API call simulation
      // send email verification link
      step.value = 5;
      // successMessage.value = 'You have registered successfully! Please check your email to verify your account.';
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
