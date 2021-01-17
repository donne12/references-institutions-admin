import { firestore } from 'firebase';

const collName = 'Societies';


const societies = {
    namespaced: true,
    state: {
        societies: [],
    },
    getters: {
        getsocieties: (state) => {
            return state.societies;
        }
    },
    mutations: {
        SET_societies(state, societies) {
            state.societies = societies;
        },
        ADD_SOCIETIES(state, society) {
            state.societies.push(society);
        },
        UPDATE_SOCIETY(state, payload) {
            Object.assign(state.societies[payload.index], payload.society);
        },
        REMOVE_SOCIETIES(state, society) {
            const index = state.societies.indexOf(society);
            state.societies.splice(index, 1);
        }
    },
    actions: {
        async loadsocieties({commit}) {
            const querySnapshot = await firestore().collection(collName).get();
            let society;
            let societies = querySnapshot.docs.map(function (doc) {
                society = doc.data();
                society.id = doc.id;
                console.log(society.id);
                return society;
            });
            commit('SET_societies', societies);
        },
        async addSociety({commit}, society) {
            const docRef = await firestore().collection(collName).add(society);
            society.id = docRef.id;
            commit('ADD_SOCIETIES', society);
        },
        async updateSocieties({commit}, payload) {
            await firestore().collection(collName).doc(payload.society.id).set(payload.society);
            commit('UPDATE_SOCIETY', payload);
        },
        async removeSocieties({commit}, society) {
            await firestore().collection(collName).doc(society.id).delete();
            commit('REMOVE_SOCIETIES', society);
        }
    }
}

export default societies;