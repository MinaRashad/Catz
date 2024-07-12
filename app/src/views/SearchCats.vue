<template>

    <div>
        <img src="../assets/dancing_cat.png" alt="Dancing Cat" class="dancing_cat">
        <SearchBar placeholder="Enter search term(s)" :callback="searchCats"/>
        <!-- update button -->
        <UpdateButton :handle="()=>this.searchCats('')" />
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
    import UpdateButton from '../components/UpdateButton.vue';
    

    export default {
    name: 'App',
    components: {
        SearchBar,
        CatCard,
        UpdateButton
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
                // get textbox value
                let current_search = document.getElementById("search").value;
                if(current_search === search) this.cats = data; // prevent updating data if user has already searched again
                this.searching = false;
            })
            }
        }
    }
</script>

<style>

.dancing_cat {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 30%;
    /* remove white background */
    background-color: transparent;
}

</style>