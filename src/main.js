import Vue from 'vue';
import App from './App.vue';
import * as firebase from 'firebase';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { firestorePlugin } from 'vuefire'


Vue.config.productionTip = false;

Vue.use(firestorePlugin);

const configOptions = {
  apiKey: "AIzaSyB9xHHUz7UEj0oMQQKlDsSS4zOiDpI5IHQ",
  authDomain: "references-entreprises.firebaseapp.com",
  databaseURL: "https://references-entreprises-default-rtdb.firebaseio.com/",
  projectId: "references-entreprises",
  storageBucket: "references-entreprises.appspot.com",
  messagingSenderId: "857822533373",
  appId: "1:857822533373:android:66e1c94f5730ad4327d094"
};

firebase.initializeApp(configOptions);

let app;

firebase.auth().onAuthStateChanged(user => {
  store.dispatch('auth/fetchUser', user);
  if(!app) {
    new Vue({
      store,
      router,
      vuetify,
      render: h => h(App)
    }).$mount('#app');
  }
});
