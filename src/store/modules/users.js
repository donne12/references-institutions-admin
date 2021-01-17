import { firestore } from 'firebase';

const collName = 'Users';

const users = {
    namespaced: true,
    state: {
        users: [],
    },
    getters: {
        getusers: (state) => {
            return state.users;
        }
    },
    mutations: {
        SET_users(state, users) {
            state.users = users;
        },
        REMOVE_USERS(state, user) {
            const index = state.users.indexOf(user);
            state.users.splice(index, 1);
        }
    },
    actions: {
        async loadusers({commit}) {
            const querySnapshot = await firestore().collection(collName).get();
            let user;
            let users = querySnapshot.docs.map(function (doc) {
                user = doc.data();
                user.id = doc.id;
                console.log(user.id);
                return user;
            });
            commit('SET_users', users);
        },
        async removeUsers({commit}, user) {
            await firestore().collection(collName).doc(user.id).delete();
            commit('REMOVE_USERS', user);
        }
    }
}

export default users;