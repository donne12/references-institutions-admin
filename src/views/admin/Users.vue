<template>
    <div>
        <v-data-table :headers="headers" :items="users"  :search="search" class="elevation-1"
                      :loading="loading" loading-text="Chargement...Veuillez patienter">
            <template v-slot:top>

                <v-toolbar flat>
                    <v-toolbar-title>Utilisateurs</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical />
                    <v-spacer />

                    <v-btn text icon class="mb-2 ml-2" @click="initialize">
                        <v-icon>mdi-refresh</v-icon>
                    </v-btn>

                </v-toolbar>
            </template>

            <template v-slot:[`item.nom`]="{ value }">
                    <span class="">{{value}}</span>
            </template>

        

            <template v-slot:[`body.prepend`]="{ headers }">
                <tr class="mx-0 px-0">
                    <td :colspan="headers.length" class="mx-0 px-0">
                        <v-text-field  v-model="search" prepend-inner-icon="mdi-magnify" label="Rechercher" single-line hide-details filled class="px-0 mx-0"/>
                    </td>
                </tr>
            </template>


            <template  v-slot:[`item.actions`]="{ item }" >
                <v-icon
                        medium
                        @click="deleteItem(item)"
                        color="error"
                >
                    mdi-delete
                </v-icon>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">Réinitialiser</v-btn>
            </template>
        </v-data-table>

        <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
            {{ snackText }}
            <template v-slot:action="{ attrs }">
                <v-btn v-bind="attrs" text @click="snack = false">Fermer</v-btn>
            </template>
        </v-snackbar>
    </div>

</template>

<script>
    import { mapActions, mapGetters } from 'vuex'

    export default {
        data() {
            return {
                snack: false,
                snackColor: '',
                snackText: '',
                search: '',
                loading: true,
                dialog: false,
                headers: [
                    {
                        text: "Nom",
                        align: "start",
                        sortable: true,
                        value: "nom",
                    },
                    { text: "E-mail", value: "email" },
                    { text: "Actions", value: "actions", sortable: false },
                ],
                editedIndex: -1,
                editedItem: {
                    nom: "",
                    email: "",
                },
                defaultItem: {
                    nom: "",
                    email: "",
                },
            };

        },
        computed: {
            ...mapActions({
                loadusers: 'users/loadusers',
            }),
            ...mapGetters({
                users: 'users/getusers'
            }),
        },

        watch: {
            dialog(val) {
                val || this.close();
            },
        },

        created() {
            this.initialize();

        },

        methods: {
            ...mapActions({
                removeusers:'users/removeUsers'
            }),
            getUserById: function(id) {
                let user = this.users.filter(c => c.id == id)[0];
                console.log(user.email);
                if(user === undefined) {
                    console.log('undefined qarşim');
                    return {nom: 'Unknown'};
                }
                return user;
            },
            async initialize() {
                this.loading = true;
                try {
                    await this.loadusers;
                } catch (e) {
                    console.error(e);
                }
                this.loading = false;
            },
            editItem(item) {
                this.editedIndex = this.users.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.dialog = true;
            },
            async deleteItem(item) {
                this.loading = true;
                if (confirm("Etes vous sûr(e) de vouloir supprimer cet utilisateur?")) {
                    this.loading = true;
                    try {
                        await this.removeusers(item);
                        this.loading = false;
                        this.snack = true;
                        this.snackColor = 'success';
                        this.snackText = 'Utilisateur supprimé';
                    } catch (e) {
                        this.loading = false;
                        this.snack = true
                        this.snackColor = 'error'
                        this.snackText = 'Utilisateur non supprimé'
                        console.error(e);
                    }
                } else {
                    this.loading = false;
                }
            },

            close() {
                this.dialog = false;
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1;
                });
            },
        },
        filters: {
            truncate: function (text, length, suffix) {
                if (text.length > length) {
                    return text.substring(0, length) + suffix;
                } else {
                    return text;
                }
            },
        }
    };
</script>