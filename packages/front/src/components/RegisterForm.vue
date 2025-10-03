<template>
  <v-card max-width="420" width="100%">
    <v-toolbar>
      <v-toolbar-title>{{ currentTitle }}</v-toolbar-title>
    </v-toolbar>

    <!-- Progression -->
    <v-progress-linear :model-value="progress" height="5" rounded />

    <v-card-text>
      <v-window v-model="step" class="mt-4">
        <!-- Step 1: Username -->
        <div class="text-center">
          <v-window-item :value="1">
            <v-form ref="form1">
              <v-text-field
                v-model="username"
                label="Username"
                :rules="[rules.required, rules.usernameValid]"
                clearable
                autofocus
                @keydown.enter.prevent="next"
              />
            </v-form>
            <v-card-actions class="justify-space-between">
              <v-btn variant="text" disabled @click="back">Back</v-btn>
              <v-btn variant="text" @click="next">Next</v-btn>
            </v-card-actions>
          </v-window-item>
        </div>

        <!-- Step 2: First/Last name -->
        <v-window-item :value="2">
          <v-form ref="form2">
            <v-text-field
              v-model="firstname"
              label="Your first name"
              :rules="[rules.required]"
              clearable
              autofocus
            />
            <v-text-field
              v-model="lastname"
              label="And your last name"
              :rules="[rules.required]"
              clearable
              @keydown.enter.prevent="next"
            />
          </v-form>
          <v-card-actions class="justify-space-between">
            <v-btn variant="text" @click="back">Back</v-btn>
            <v-btn variant="text" @click="next">Next</v-btn>
          </v-card-actions>
        </v-window-item>

        <!-- Step 3: Password -->
        <v-window-item :value="3">
          <v-form ref="form3">
            <v-text-field
              v-model="password"
              label="Choose a strong password"
              type="password"
              :rules="[rules.required, rules.passwordStrong]"
              clearable
              autofocus
            />
            <v-text-field
              v-model="confirmPassword"
              label="Confirm your password"
              type="password"
              :rules="[rules.required, rules.passwordsMatch]"
              clearable
              @keydown.enter.prevent="next"
            />
          </v-form>
          <v-card-actions class="justify-space-between">
            <v-btn variant="text" @click="back">Back</v-btn>
            <v-btn variant="text" @click="next">Next</v-btn>
          </v-card-actions>
        </v-window-item>

        <!-- Step 4: Email -->
        <v-window-item :value="4">
          <v-form ref="form4">
            <v-text-field
              v-model="email"
              label="Your email address"
              type="email"
              placeholder="email"
              :rules="[rules.required, rules.email]"
              clearable
              autofocus
              @keydown.enter.prevent="register"
            />
            <v-btn block color="primary" @click="register">
              ˚ʚ♡ɞ˚ Register ˚ʚ♡ɞ˚
            </v-btn>
            <v-card-actions class="justify-space-between">
              <v-btn variant="text" @click="back">Back</v-btn>
              <v-btn variant="text" disabled @click="next">Next</v-btn>
            </v-card-actions>
          </v-form>
        </v-window-item>

        <!-- Step 5: Registered sucessfully -->
        <v-window-item :value="5">
          <v-alert type="success" class="mt-4">
            You have registered successfully! Please check your email to verify
            your account.
          </v-alert>
        </v-window-item>
      </v-window>

      <!-- Messages -->
      <v-alert v-if="errorMessage" type="error" class="mt-4">
        {{ errorMessage }}
      </v-alert>
      <!-- <v-alert v-if="successMessage" type="success" class="mt-4">
              {{ successMessage }}
            </v-alert> -->
    </v-card-text>

    <!-- Nav buttons -->
    <!-- <v-card-actions class="justify-space-between">
            <v-btn variant="text" :disabled="step === 1" @click="back">Back</v-btn>
            <v-btn variant="text" :disabled="step === 4" @click="next">Next</v-btn>
          </v-card-actions> -->
  </v-card>
</template>

<script lang="ts" src="./RegisterForm.ts"></script>
