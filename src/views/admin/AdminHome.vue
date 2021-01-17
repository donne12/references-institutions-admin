<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item-group color="primary">
          <v-list-item v-for="(menu, index) in menus" :key="index" @click="goto(menu.path)">
            <v-list-item-action>
              <v-icon>{{ menu.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ menu.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left dark color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Interface administrateur</v-toolbar-title>
      <v-spacer />
      <v-btn text icon @click="dark = !dark">
        <v-icon>{{ dark ? 'mdi-brightness-4' : 'mdi-brightness-6'}}</v-icon>
      </v-btn>
      <v-btn text icon @click="logOut()"><v-icon>mdi-power</v-icon></v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app>
      <div class="flex text-center">
        <span class="lead text--secondary text-center" >Software & Design ❤ by
          <a href="https://github.com/donne12" class="text-decoration-none" target="_blank">Donné ESIAKU</a>
        </span>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import firebase from 'firebase';
import { mapActions } from 'vuex';

export default {
  data: () => ({
    dark: false,
    path: '/admin',
    drawer: null,
    menus: [
      { path: '', title: 'Tableau de bord', icon: 'mdi-view-dashboard' },
      { path: '/users', title: 'Utilisateurs', icon: 'mdi-account'},
      { path: '/societies', title: 'Institutions', icon: 'mdi-clipboard' },
    ]
  }),
  created() {
    this.dark = this.$vuetify.theme.dark
    this.loadsocieties();
    this.loadusers();
  },
  computed: {
    ...mapActions({
        loadsocieties: 'societies/loadsocieties',
        loadusers: 'users/loadusers',
    }),
  },
  methods: {
    logOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace({path: '/'});
        });
    },
    goto(newPath) {
      this.$router.push({path: this.path + newPath}).catch(()=>{});
    }
  },
  watch: {
    dark: function() {
      this.$vuetify.theme.dark = this.dark;
    }
  }
}
</script>