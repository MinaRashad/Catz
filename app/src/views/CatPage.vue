<template>
    <h1 v-show="!cat">Please use the search functionality rather than direct links</h1>
    <!-- <h1>Loading cat {{ $route.params.id }}...</h1> -->
    <RouterLink :to="{name:'searchCats'}">
            <h1>{{ '<<' }}</h1>
    </RouterLink>
    <div class="controls">
        
        <RouterLink to="/upload">
            <button>Upload Files</button>
        </RouterLink>
        <RouterLink :to="{name:'files'}">
            <button>Browse Files</button>
        </RouterLink>

    </div>
    <div>
        <img :src="img">
        <h1>{{ cat.animalName }}</h1>
        <h2>{{ cat.animalSex }} - {{ cat.animalBreed }} - {{ cat.animalStatus }} </h2>
    </div>
  

    <h1>Journals</h1>
    
    <div v-if="loadingJournals">Loading...</div>
    <div v-else>
        <journals :journals="journals" />
    </div>
</template>

<script>
    import journals from '../components/Journals.vue'
    import placeholder from '../assets/placeholder.svg'

    export default {
        name: 'CatPage',
        components: {
            journals
        },
        computed: {
            cat() {
                return JSON.parse(sessionStorage.getItem('cat'));
            },
            img() {
                if ( !this.cat.animalPictures || this.cat.animalPictures.length === 0) {
                    return placeholder;
                }
                return this.cat.animalPictures[0].urlSecureFullsize;
                
            }
        },
        mounted() {
            this.getJournals();
        },
        data() {
            return {
                loadingJournals: true,
                jorunals: []
            }
        },
        methods:{
            getJournals() {
                // to make it dynamic with any current domain
                const url = new URL(window.location.href);
                const BASE_URL = `${url.protocol}//${url.hostname}`;


                fetch(`${BASE_URL}:3000/journals?cat_id=${this.cat['animalID']}`)
                .then(response => response.json())
                .then(data => {
                    this.journals = data;
                    
                    // sort them by type

                    this.journals.sort((a, b) => {
                        if (a.journalEntrytypeDescription < b.journalEntrytypeDescription) {
                            return -1;
                        }
                        if (a.journalEntrytypeDescription > b.journalEntrytypeDescription) {
                            return 1;
                        }
                    });

                    return data;

                })
                .then((data) => {
                    this.loadingJournals = false;
                    console.log(data);

                })
            }
        }
        
    }

</script>

<style>
    img {
        width: 20vw;
        height: auto;
    }

    .controls {
        display: block;
        /* center */
        margin-left: auto;
        margin-right: auto;
        width: 40%;
        transform: translate(10%,0);
    }
    .controls button {
        margin: 10px;
        /* remove default styling */
        background-color: #f1f1f1;
        padding: 10px;
        border-radius: 10px;
        cursor: pointer;
        font-size: larger;
        
    }
    .controls button:hover {
        background-color: #1f1f1f;
        color: #f1f1f1
    }
</style>