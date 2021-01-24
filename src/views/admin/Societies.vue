<template>
    <div>
        <v-data-table :headers="headers" :items="societies"  :search="search" class="elevation-1"
                      :loading="loading" loading-text="Chargement...Veuillez patienter">
            <template v-slot:top>

                <v-toolbar flat>
                    <v-toolbar-title>Institutions</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical />
                    <v-spacer />

                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" >Nouvelle institution</v-btn>
                        </template>
                        <v-card>

                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-form v-bind:disabled="loading" lazy-validation ref="dialogForm">
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field :disabled="loading" :rules="titleRule" v-model="editedItem.raison_sociale" label="Raison sociale"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field :disabled="loading" :rules="titleRule" v-model="editedItem.description" label="Description"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-select label="Secteur" :disabled="loading" :rules="titleRule" v-model="editedItem.secteur" :items="items2"></v-select>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field :disabled="loading" :rules="titleRule" v-model="editedItem.localisation" label="Localisation"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field :disabled="loading" :rules="titleRule" v-model="editedItem.contact" label="Contact"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <input type="file" class="d-none" ref="uploader" accept="image/*" @change="selectFile()">
                                                <v-text-field :rules="imageRule" :disabled="loading" v-model="editedItem.img" label="Aperçu" prepend-icon="mdi-image" @click:prepend="$refs.uploader.click()">
                                                </v-text-field>
                                            </v-col>
                                        </v-row>

                                    </v-form>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn :disabled="loading" color="blue darken-1" text @click="close">Quitter</v-btn>
                                <v-btn :disabled="loading" color="blue darken-1" text @click="save">Enregistrer</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-btn text icon class="mb-2 ml-2" @click="initialize">
                        <v-icon>mdi-refresh</v-icon>
                    </v-btn>

                </v-toolbar>
            </template>

            <template v-slot:[`item.raison_sociale`]="{ value }">

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
                        class="mr-2"
                        @click="editItem(item)"
                >
                    mdi-pencil
                </v-icon>
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
    import {storage} from "firebase";

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
                        text: "Raison sociale",
                        align: "start",
                        sortable: true,
                        value: "raison_sociale",
                    },
                    { text: "Localisation", value: "localisation" },
                    { text: "Contact", value: "contact" },
                    { text: "Secteur", value: "secteur" },
                    { text: "Actions", value: "actions", sortable: false },
                ],
                editedIndex: -1,
                editedItem: {
                    raison_sociale: "",
                    localisation: "",
                    contact: "",
                    secteur: "",
                    img: "",
                    searchKey: "",
                },
                items2: ["Communication,\nPublicité",
                    "Batiment et construction",
                    "Administrations",
                    "Commerces",
                    "Automobiles/Moto ",
                    "Télécommunications",
                    "Immobilier",
                    "Comptabilité,\nJuridique et Conseil ",
                    "Tourisme et Loisirs ",
                    "Informatique, Internet",
                    "Santé",
                    "Finances",
                    "Agroalimentaire",
                    "Associations\nProfessionnelles",
                    "Bien être",
                    "Energie",
                    "Formations, éducation",
                    "Hygiène",
                    "Import et export",
                    "Industrie",
                    "Sécurité",
                    "Services",
                    "Sport",
                    "Transport",
                    "Urgences",],
                defaultItem: {
                    raison_sociale: "",
                    localisation: "",
                    contact: "",
                    secteur: "",
                    img: "",
                    searchKey: "",
                },
                titleRule: [
                    v => !!v || 'Champ obligatoire',
                ],
                imageRule: [
                    v => /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(v) || 'Le lien de l\'image doit être valide.',
                ]
            };

        },
        computed: {
            ...mapActions({
                loadsocieties: 'societies/loadsocieties',
            }),
            ...mapGetters({
                societies : 'societies/getsocieties'
            }),
            formTitle() {
                return this.editedIndex === -1 ? "Nouvelle instution" : "Modifier une institution";
            },
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
                addSociety: 'societies/addSociety',
                updateSocieties : 'societies/updateSocieties',
                removeSocieties:'societies/removeSocieties'
            }),
            getUserById: function(id) {
                let society = this.societies.filter(c => c.id == id)[0];
                console.log(society.id);
                if(society === undefined) {
                    console.log('undefined qarşim');
                    return {nom: 'Unknown'};
                }
                return society;
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
            selectFile() {
                let file = this.$refs.uploader.files[0];
                if (file != null && file.name) {
                    this.loading = true;
                    let ref = storage()
                        .ref()
                        .child("societies_images/" + file.name);
                    let vm = this;
                    ref.put(file).then((snapshot) => {
                        this.loading = false;
                        if (snapshot.state === "success") {
                            snapshot.ref.getDownloadURL().then(function (downloadURL) {
                                vm.editedItem.image = downloadURL;
                            });
                        } else {
                            this.snack = true
                            this.snackColor = 'error'
                            this.snackText = 'File could not be uploaded';
                        }
                        file = null;
                    });
                }
            },
            editItem(item) {
                this.editedIndex = this.societies.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.dialog = true;
            },
            async deleteItem(item) {
                this.loading = true;
                if (confirm("Etes vous sûr(e) de vouloir supprimer cette institution?")) {
                    this.loading = true;
                    try {
                        await this.removeSocieties(item);
                        this.loading = false;
                        this.snack = true;
                        this.snackColor = 'success';
                        this.snackText = 'Institution supprimée';

                    } catch (e) {
                        this.loading = false;
                        this.snack = true
                        this.snackColor = 'error'
                        this.snackText = 'Institution non supprimée'
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

            async save() {
                this.editedItem.searchKey = this.editedItem.raison_sociale[0];
                if(!this.$refs.dialogForm.validate()) return;

                if (this.editedIndex > -1) {
                    this.loading = true;
                    try {
                        await this.updateSocieties({index: this.editedIndex, society: this.editedItem});
                        this.loading = false;
                        this.close();

                        this.snack = true
                        this.snackColor = 'success'
                        this.snackText = 'L\'institution a été mise à jour'

                    } catch (e) {
                        this.loading = false;
                        this.close();

                        this.snack = true
                        this.snackColor = 'error'
                        this.snackText = 'L\'institution n\'a pas pu être mise à jour'

                        console.error(e);
                    }
                }
                else {
                    this.loading = true;
                    try {
                        await this.addSociety(this.editedItem);
                        this.loading = false;
                        this.close();

                        this.snack = true
                        this.snackColor = 'success'
                        this.snackText = 'Institution ajoutée'

                    } catch (e) {
                        this.loading = false;
                        this.close();

                        this.snack = true
                        this.snackColor = 'error'
                        this.snackText = 'L\'institution a pas été ajouté'

                        console.error(e);
                    }
                }
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