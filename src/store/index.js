import { createStore } from 'vuex';
import auth from './modules/auth';
import users from "./modules/users";
import societies from "./modules/societies";

export default createStore({
  modules: {
    auth,
    users,
    societies,
  }
})
