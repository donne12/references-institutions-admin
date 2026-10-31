<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Interface administrateur</v-toolbar-title>
      <v-spacer />
      <v-btn variant="text" icon @click="dark = !dark">
        <v-icon>{{ dark ? 'mdi-brightness-4' : 'mdi-brightness-6'}}</v-icon>
      </v-btn>
      <v-btn variant="text" icon @click="logOut()"><v-icon>mdi-power</v-icon></v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list density="compact" color="primary">
        <v-list-item v-for="(menu, index) in menus" :key="index" :prepend-icon="menu.icon" :title="menu.title" @click="goto(menu.path)" />
      </v-list>
    </v-navigation-drawer>

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
        <span class="lead text-medium-emphasis text-center" >Software & Design ❤ by
          <a href="https://github.com/donne12" class="text-decoration-none" target="_blank">Donné ESIAKU</a>
        </span>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import firebase from '../../firebase';
import { mapActions } from 'vuex';
import { useTheme } from 'vuetify';

export default {
  setup() {
    return { theme: useTheme() };
  },
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
    this.dark = this.theme.global.current.value.dark;
    this.loadsocieties();
    this.loadusers();
  },
  methods: {
    ...mapActions({
        loadsocieties: 'societies/loadsocieties',
        loadusers: 'users/loadusers',
    }),
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
      this.theme.global.name.value = this.dark ? 'dark' : 'light';
    }
  }
}
</script>
