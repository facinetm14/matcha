<template>
  <v-app>
    <v-main>
      <v-container>
        <v-flex>
          <v-card>
            <v-toolbar dark color="primary">
              <v-toolbar-title>Register form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <form @submit.prevent="register">
                <v-text-field
                  v-model="username"
                  label="Username"
                  type="text"
                  placeholder="username"
                  required
                  clearable
                />

                <v-text-field
                  v-model="firstname"
                  label="First name"
                  type="text"
                  required
                  clearable
                />

                <v-text-field
                  v-model="lastname"
                  label="Last name"
                  type="text"
                  required
                  clearable
                />

                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  required
                  clearable
                />

                <v-text-field
                  v-model="confirmPassword"
                  label="Confirm password"
                  type="password"
                  required
                  clearable
                />

                <v-text-field
                  v-model="email"
                  label="Email"
                  type="email"
                  placeholder="email"
                  required
                  clearable
                />

                <v-btn color="primary" type="submit">Register</v-btn>

                <!-- Error messages -->
                <v-alert v-if="errorMessage" type="error" class="mt-3">
                  {{ errorMessage }}
                </v-alert>

                <!-- Success message -->
                <v-alert v-if="successMessage" type="success" class="mt-3">
                  {{ successMessage }}
                </v-alert>
              </form>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">

export default {
  data() {
    return {
      username: '' as string,
      firstname: '' as string,
      lastname: '' as string,
      password: '' as string,
      confirmPassword: '' as string,
      email: '' as string,
      errorMessage: '' as string,
      successMessage: '' as string,
    };
  },
  methods: {
    async register() {
      this.errorMessage = '' as string;
      this.successMessage = '' as string;

      // + check isPasswordStrong , isValidEmail
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        return;
      }

      // try {
      //   const response = await

      //   if (response.data.success) {
      //   }
      // } catch (error) {
      // }
    },
  },
};
</script>

