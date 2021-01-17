import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import users from "./modules/users";
import societies from "./modules/societies";

Vue.use(Vuex)
Vue.component('my-row', {
  props: ['title'],
  template:`<option>{{title}}</option>`,
})
new Vue({
  el: '#box-select',
  data:{
    newTodoText: '',
    items: [
      {
        id: 1,
        title: 'Do the dishes',
      },
      {
        id: 2,
        title: 'Take out the trash',
      },
      {
        id: 3,
        title: 'Mow the lawn'
      }
    ]
  },
  methods:{

    onChange(key) {
      this.newTodoText = "id:"+this.items[key-1].id+"/title:"+this.items[key-1].title;
    }

  }
})

export default new Vuex.Store({
  modules: {
    auth,
    users,
    societies,
  }
})
