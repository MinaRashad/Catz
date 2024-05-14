<template>
    <div v-if="!(selectedCats && selectedCats.length && originalCat && SelectedJournals && SelectedJournals.length)">
        <h1>
            Error: Please use the app appropriately.
        </h1>
    </div>
    <div v-else>
        <h1>Confirm Copy?</h1>
        <h2>From:</h2>
        <CatCard :cat="originalCat"/>
        <Journals :journals="SelectedJournals" :showButtons="false"/>
        <h2>To:</h2>
        <CatCard v-for="selectedCat in selectedCats" :cat="selectedCat" :key="selectedCat['animalID']"/>

        <h2>Are you sure? This is a mass modification, REVIEW carefully</h2>
        <div class="uploading" v-show="uploading">
            <h1>Uploading ... {{ uploadProgress }}%</h1>
        </div>
        <div class="controls">
            <button @click="copyJournals">Confirm</button>
            <button @click="cancelCopy">Cancel</button>
        </div>

        
        
    </div>
</template>

<script>

import CatCard from '../components/CatCard.vue'
import Journals from '../components/Journals.vue'

export default {
    name: 'ConfirmCopy',
    data() {
        return {
            uploading: false,
            uploadProgress: 0
        }
    },
    components: {
        CatCard,
        Journals
    },
    computed: {
        originalCat() {
            return JSON.parse(sessionStorage.getItem('cat'));
        },
        selectedCats() {
            return JSON.parse(sessionStorage.getItem('selectedCats'));
        },
        SelectedJournals() {
            return JSON.parse(sessionStorage.getItem('checkedJournals'));
        }
    },
    methods:{
        cancelCopy() {
            sessionStorage.removeItem('checkedJournals');
            sessionStorage.removeItem('selectedCats');
            sessionStorage.removeItem('cat');

            this.$router.push({name: 'searchCats'});
        },
        async copyJournals() {
            console.log('Copying journals');
            let selectedCats = this.selectedCats;
            let journals = this.SelectedJournals;

            let total = selectedCats.length * journals.length;
            let current = 0;
            this.uploading = true;

            // scroll to the bottom

            for(let journal of journals){
                for(let cat of selectedCats){
                    let data = {
                        ...journal,
                        "journalEntryAnimalID": cat['animalID']
                    }

                    await this.upload_journal(data);
                    current++;
                    this.uploadProgress = Math.round((current / total) * 100);
                }
            }
            
        },
        async upload_journal(data) {
            const url = new URL(window.location.href);
            const BASE_URL = `${url.protocol}//${url.hostname}`;

            await fetch(`${BASE_URL}:3000/journal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
        }
    }
}

</script>

<style>

    progress {
        width: 100%;
    }
</style>