<template>
  <v-app style="background: linear-gradient(to left, rgb(100, 181, 246), rgb(144, 202, 249));">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12"
              sm="8"
              md="4">
          <v-card class="mx-auto" shaped elevation="20">

            <v-toolbar color="primary" dark flat>
              <v-toolbar-title class="headline">Interface administrateur</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
                <v-form ref="form" v-bind:disabled="disabled" lazy-validation>
                  <v-text-field type="text" v-model="email"  label="E-Mail" :rules="emailRules" prepend-icon="mdi-at" /> 
                  <v-text-field :type="showPassword ? 'text' : 'password'" v-model="password"  label="Mot de passe" :rules="passwordRules" prepend-icon="mdi-lock" :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append="showPassword = !showPassword" /> 
              </v-form>

            <p class="red--text">{{ error }} </p>

            </v-card-text>

            <v-card-actions>
              <v-btn v-bind:disabled="disabled"  block @click="validate" color="primary">
                <span v-show="!disabled">Se connecter</span>
                <span v-show="disabled">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import firebase from 'firebase';

export default {
  data() {
    return {
      disabled: false,
      email: '',
      emailRules: [
        v => !!v || 'Un e-mail est requis',
        v => /.+@.+\..+/.test(v) || 'L\'e-mail doit être valide',
      ],
      showPassword: false,
      password: '',
      passwordRules: [
        v => !!v || 'Un mot de passe est requis'
      ],
      error: ''
    }
  },
  methods: {
    validate() {
      if(this.$refs.form.validate()) {
        this.disabled = true;

        firebase
            .auth()
            .signInWithEmailAndPassword(this.email, this.password)
            .then(() => {
              this.disabled = false;
              this.$router.replace({ path: "/admin" });
            })
            .catch(err => {
              this.disabled = false;
              this.error = err.message;
            });
      }
    }
  }
}
</script>
