<template>

    <div>
        <SearchBar placeholder="Write anything here" :callback="searchCats">
        </SearchBar>
        <div class='controls'>

            <button @click="selected = []">Clear all</button>
            <button @click="selected = []">Next</button>
            <button @click="()=>{
                this.$router.push('/cat');
            
            }">cancel</button>
        </div>

    </div>

    <div class='selected'>
        <h1>Selected cats</h1>
        <h2 v-if="selected.length === 0"> No cats selected</h2>
        <div class="cats">
            <span v-for="cat in selected" :key="cat.animalID">
                <CatCard :pass="true" :cat="cat" :key="cat.animalID" @click="()=>{selected.splice(selected.indexOf(cat), 1)}"/>
            </span>
        </div>
    </div>

    <div>
        <h1>Available cats</h1>
        <h1 class="searching" v-show="searching"> Searching ...</h1>
        <h1 class="searching" v-show="!searching && cats.length === 0"> No cats found</h1>
        <div class="cats">
            <span v-for="cat in cats" :key="cat.animalID">
                <CatCard :cat="cat" v-if="selected.indexOf(cat) === -1 && JSON.stringify(cat) != originalCat" :key="cat.animalID" @click="()=>{selected.push(cat)}"/>
            </span>
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
            selected: [],
            searching: false,
            originalCat:sessionStorage.getItem('cat')
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
            
            // fetch with CORS disabled
            fetch(`http://localhost:3000/search?searchterm=${search}`)
            .then(response => response.json())
            .then(data => {
                this.cats = data;
                this.searching = false;
            })
            }
        }
    }
</script>