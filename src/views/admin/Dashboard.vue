<template>
    <div>
        <v-row>
            <v-col cols="6">
                <DashBoardCard :title="'Nombre d\'utilisateurs'" color="primary" :data="users.length"
                :icon="'mdi-account'" />
            </v-col>
            <v-col cols="6">
                <DashBoardCard :title="'Nombre d\'institutions'" color="error" :data="societies.length"
                :icon = "'mdi-clipboard'" />
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DashBoardCard from '../../components/DashBoardCard.vue';


function groupBy(array, key){
  const result = {}
  array.forEach(item => {
    if (!result[item[key]]){
      result[item[key]] = []
    }
    result[item[key]].push(item)
  })
  return result
}

export default {
    data() {
        return { }
    },
    components: {
        DashBoardCard
    },
    created() {
        this.loadusers();
        this.loadsocieties();
    },
    methods: {
        ...mapActions({
            loadusers: 'users/loadusers',
            loadsocieties: 'societies/loadsocieties'

        }),
        },
        computed: {
        ...mapGetters({
            users: 'users/getusers',
            societies: 'societies/getsocieties'
        }),
        groups(){
            return groupBy(this.sounds, 'category_id')
        }
    }
}

</script>
