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
                     <form>
                            <v-text-field
                              v-model="username"
                              label="Username"
                              type="text"
                              placeholder="username"
                              required
                              clearable
                           ></v-text-field>

                            <v-text-field
                                v-model="email"
                                label="Email"
                                type="email"
                                placeholder="email"
                                required
                                clearable
                            ></v-text-field>

                            <v-text-field
                              v-model="Firstname"
                              label="First name"
                              type="text"
                              required
                              clearable
                           ></v-text-field>

                            <v-text-field
                              v-model="Lastname"
                              label="Last name"
                              type="text"
                              required
                              clearable
                           ></v-text-field>

                            <v-text-field
                              v-model="password"
                              label="Password"
                              type="password"
                              required
                              clearable
                           ></v-text-field>

                            <v-text-field
                              v-model="confirmPassword"
                              label="Confirm password"
                              type="password"
                              required
                              clearable
                           ></v-text-field>

                            <v-btn color="primary" type="submit">Register</v-btn>

                            <!-- Add error message
                             - if passwords do not match
                              - if username is already taken
                              - if email is already taken
                            -->

                            <!-- Add message Already registered - Please check your email to validate your account -->

                      </form>
                     </v-card-text>
                  </v-card>

               </v-flex>
         </v-container>
      </v-main>
   </v-app>
</template>

<script>
export default {
};
</script>
