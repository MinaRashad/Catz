<template>

    <div>
        <SearchBar placeholder="Write anything here" :callback="searchCats"/>
    </div>
    <div>

        <h1 class="searching" v-show="searching"> Searching ...</h1>
        <h1 class="searching" v-show="!searching && cats.length === 0"> No cats found</h1>
        <div class="cats">
            
            <RouterLink :to="{name:'catDetails'}">
                <CatCard v-for="cat of cats" :cat="cat" :key="cat.animalID" :pass="true">
                </CatCard>
            </RouterLink>

        </div>
    </div>
</template>

<script>
    import SearchBar from '../components/SearchBar.vue'
    import CatCard from '../components/CatCard.vue';

    

    export default {
    name: 'App',
    components: {
        SearchBar,
        CatCard
    },
    data() {
        return {
            cats: [],
            searching: false
        }
    },
    mounted() {
        this.searchCats('');
    },
    methods: {
        searchCats(search) {
            // make an API call to localhost:3000/search?searchterm=search
            // update the cats data with the response
            // set searching to true
            // when the api returns data, set searching to false

            this.searching = true;
            
            const url = new URL(window.location.href);
            const BASE_URL = `${url.protocol}//${url.hostname}`;

            fetch(`${BASE_URL}:3000/search?searchterm=${search}`)
            .then(response => response.json())
            .then(data => {
                this.cats = data;
                this.searching = false;
            })
            }
        }
    }
</script>