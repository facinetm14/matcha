<!-- pages/index.vue -->
<template>
  <v-app>
    <v-main>
      <v-container align="center" class="fill-height">
        <v-row justify="center" class="gap-6">
          <v-col cols="12" md="5">
            <v-card class="pa-6">
              <v-card-title>Already have an account ?</v-card-title>
              <v-card-text>Connect to your profile.</v-card-text>
              <v-card-actions>
                <v-btn to="/loginpage">Log in</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="5">
            <v-card class="pa-6">
              <v-card-title>New here ?</v-card-title>
              <v-card-text>Create an account in a few seconds.</v-card-text>
              <v-card-actions>
                <v-btn variant="outlined" to="/registerpage">Register</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
