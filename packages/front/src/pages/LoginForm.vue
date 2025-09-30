<template>
  <v-app>
    <v-main>
      <v-container class="d-flex justify-center align-center fill-height">
        <!-- Card: Login -->
        <v-card v-if="!forgotMode" max-width="420" width="100%">
          <v-toolbar>
            <v-toolbar-title>{{ currentTitle }}</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form ref="loginForm">
              <v-text-field
                v-model="username"
                label="Username"
                :rules="[rules.required]"
                clearable
                autofocus
                @keydown.enter.prevent="login"
              />
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                :rules="[rules.required]"
                clearable
                @keydown.enter.prevent="login"
              />

              <v-btn block color="primary" class="mt-2" @click="login">
                Sign in
              </v-btn>

              <div class="text-center mt-4">
                <v-btn variant="text" density="comfortable" @click="openForgot">
                  Password forgotten ?
                </v-btn>
              </div>
            </v-form>

            <v-alert v-if="errorMessage" type="error" class="mt-4">
              {{ errorMessage }}
            </v-alert>
            <v-alert v-if="successMessage" type="success" class="mt-4">
              {{ successMessage }}
            </v-alert>
          </v-card-text>
        </v-card>

        <!-- Card: Forgot Password -->
        <v-card v-else max-width="420" width="100%">
          <v-toolbar>
            <v-toolbar-title>{{ currentTitle }}</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form ref="forgotForm">
              <v-text-field
                v-model="email"
                label="Enter your email address"
                type="email"
                placeholder="email"
                :rules="[rules.required, rules.email]"
                clearable
                autofocus
                @keydown.enter.prevent="sendReset"
              />

              <v-btn block color="primary" class="mt-2" @click="sendReset">
                Send reset link
              </v-btn>

              <div class="d-flex justify-space-between mt-2">
                <v-btn variant="text" @click="backToLogin">Back</v-btn>
                <div />
              </div>
            </v-form>

            <v-alert v-if="errorMessage" type="error" class="mt-4">
              {{ errorMessage }}
            </v-alert>
            <v-alert v-if="successMessage" type="success" class="mt-4">
              {{ successMessage }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" src="./LoginForm.ts"></script>
