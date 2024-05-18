<template>

    <div>
        <SearchBar placeholder="Write anything here" :callback="searchCats"/>
        <!-- update button -->
        <button @click="updateDataset" class="update-button">
            <!-- icon -->
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
            <path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"></path>
            </svg>
        </button>
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
            },
            updateDataset() {
                const url = new URL(window.location.href);
                const BASE_URL = `${url.protocol}//${url.hostname}`;
                fetch(`${BASE_URL}:3000/update_dataset`).then(() => {
                    this.searchCats('');
                })
            }
        }
    }
</script>

<style>
.update-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: rgb(255, 255, 255);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    /* transition */
    transition: all 0.3s;
}

.update-button:hover {
    /* rotate animation */
    animation: rotate 1s;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>