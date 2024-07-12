<template>
    <div class="catCard">
        <CatCard :cat="cat" />
        <RouterLink :to="{name:'catDetails'}">
            <img src="../assets/dancing_back.png" alt="back" class="danceback" title="dance back">
        </RouterLink>
    </div>
    <div>
        <h1 class="files_title"> Images</h1>
        <img v-for="img in cat['animalPictures']" :src="img['urlSecureFullsize']" :key="img['mediaID']" class="animalpic">
    </div>
    <h1 v-if="loadingFiles">Loading...</h1>
    <div v-else>
        <div v-if="files.length === 0">No files found</div>
        <div v-else>
            <h1 class="files_title"> Files</h1>
            <!-- Here we will put the files in a table -->
            <!-- 'animalfileAnimalID',"animalfileID", "animalfileOldName", "animalfileDescription",
                            "animalfileStatus", "animalfileDisplayInline", "animalfilePublic",
                            "animalfileSize", "animalfileCreatedDate" -->

            <table>
                <thead>
                    <tr class="table-row-even">
                        <th>File Name</th>
                        <th>Description</th>
                        <!-- <th>Status</th> -->
                        <!-- <th>Display Inline</th> -->
                        <!-- <th>Public</th> -->
                        <th>Size</th>
                        <th>Created Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(file,index) in files" :key="file['animalfileID']" :class="index%2==0?'table-row-even':'table-row-odd'">
                        <td>{{ file['animalfileOldName'] }}</td>
                        <td>{{ file['animalfileDescription'] }}</td>
                        <!-- <td>{{ file['animalfileStatus'] }}</td> -->
                        <!-- <td>{{ file['animalfileDisplayInline'] }}</td> -->
                        <!-- <td>{{ file['animalfilePublic'] }}</td> -->
                        <td>{{ file['animalfileSize'] }}</td>
                        <td>{{ file['animalfileCreatedDate'] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</template>

<script>

import CatCard from '../components/CatCard.vue'

// cat has a animalPictures key to an array of pictures
// each picture is an object with a urlSecureFullsize key to the url


export default {
    name: 'CatFiles',
    data() {
        return {
            loadingFiles: true,
            files: []
        }
    },
    components: {
        CatCard
    },
    computed: {
        cat() {
            return JSON.parse(sessionStorage.getItem('cat'));
        }
    },
    mounted() {
        this.getFiles();
    },
    methods: {
        getFiles() {
            this.loadingFiles = true;

            const url = new URL(window.location.href);
            const BASE_URL = `${url.protocol}//${url.hostname}`;

            fetch(`${BASE_URL}:3000/files?cat_id=${this.cat['animalID']}`)
                .then(response => response.json())
                .then(data => {
                    this.loadingFiles = false;
                    this.files = data;

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    },

}

</script>

<style>
    .animalpic {
        width: 100%;
        max-width: 20vw;
        margin: 10px;
        border: 10px solid rgb(0, 0, 0);
    }

    .files_title {
        text-align: center;
        font-size: 5em;
    }
    .catCard{
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }
    thead {
        background-color: #f2f2f2;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    tr:nth-child(even) {
        background-color: #f2f2f2;
    }
</style>