import { createApp } from 'vue';
import App from './App.vue';
import firebase from './firebase';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

let app;

firebase.auth().onAuthStateChanged(user => {
  store.dispatch('auth/fetchUser', user);
  if (!app) {
    app = createApp(App).use(store).use(router).use(vuetify);
    app.mount('#app');
  }
});
