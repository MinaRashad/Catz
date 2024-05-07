<template>
    <h1 v-show="!cat">Please use the search functionality rather than direct links</h1>
    <!-- <h1>Loading cat {{ $route.params.id }}...</h1> -->
    <RouterLink :to="{name:'searchCats'}">
            <h1>{{ '<<' }}</h1>
    </RouterLink>
    <div class="controls">
        <RouterLink to="/">
            <button>Copy Journals to other cats</button>
        </RouterLink>
        <RouterLink to="/">
            <button>Upload Files</button>
        </RouterLink>

    </div>
    <div>
        <img :src="img">
        <h1>{{ cat.animalName }} {{ cat.animalOthernames?`(also ${cat.animalOthernames})`:'' }}</h1>
        <h2>{{ cat.animalSex }} - {{ cat.animalBreed }} - {{ cat.animalStatus }} </h2>
    </div>
  

    <h1>Journals</h1>
    <div class="controls">
        <RouterLink to="/">
            <button>Create Google Doc</button>
        </RouterLink>

        <RouterLink to="/">
                <button>Download as pdf</button>
        </RouterLink>
    </div>
    
    <journals :cat_id="id" />
</template>

<script>
    import journals from '../components/Journals.vue'
    import placeholder from '../assets/placeholder.svg'

    export default {
        name: 'CatPage',
        components: {
            journals
        },
        props: {
            id: {
                type: Number,
                required: true
            }
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
        data() {
            return {
                loading: false
            }
        },
        
    }

</script>

<style scoped>
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