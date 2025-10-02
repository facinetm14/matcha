<template>
  <!-- Card: Login -->
  <v-card max-width="420" width="100%">
    <v-toolbar>
      <v-toolbar-title>{{ currentTitle }}</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-form ref="resetPasswordForm">
        <v-text-field v-model="password" label="Choose a strong password" type="password"
          :rules="[rules.required, rules.passwordStrong]" clearable autofocus />
        <v-text-field v-model="confirmPassword" label="Confirm your password" type="password"
          :rules="[rules.required, rules.passwordsMatch]" clearable @keydown.enter.prevent="resetPassword" />

        <v-btn block color="primary" class="mt-2" @click="resetPassword">
          Reset password
        </v-btn>
      </v-form>

      <v-alert v-if="errorMessage" type="error" class="mt-4">
        {{ errorMessage }}
      </v-alert>
      <v-alert v-if="successMessage" type="success" class="mt-4">
        {{ successMessage }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" src="./ResetPasswordForm.ts"></script>
