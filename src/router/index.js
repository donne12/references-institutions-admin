import { createRouter, createWebHistory } from 'vue-router';
import firebase from '../firebase';
import Login from '../views/Login.vue';
import Users from "../views/admin/Users.vue";
import Societies from "../views/admin/Societies.vue";
import Dashboard from '../views/admin/Dashboard.vue';


const routes = [
  {
    // Login Page
    path: '/',
    component: Login
  },
  {
    path: '/admin',
    component: () => import('../views/admin/AdminHome.vue'),
    children: [
      { path: '', component: Dashboard },
      { path: 'users', component: Users},
      { path: 'societies', component: Societies },
    ],
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const signedIn = !!firebase.auth().currentUser;
  if (to.matched.some(record => record.meta.requiresAuth)) {
    return signedIn ? true : { path: '/' };
  }
  if (to.path === '/' && signedIn) {
    return { path: '/admin' };
  }
  return true;
});

export default router
