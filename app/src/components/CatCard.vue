<template>
    <RouterLink :to="{name:'catDetails', params:{id:cat.animalID}}" @click="passCat">

        <div class="cat-card">
                <img :src="img" :alt="cat.animalName" />
                <h2>{{ cat.animalName }}</h2>
                <h3>{{ cat.animalSex }} {{ cat.animalBreed }}</h3>
        </div>
    </RouterLink>


</template>

<script>

// get cat img placeholder from assets
import placeholder from '../assets/placeholder.svg'

/*
cat object keys returned by API

{
    "animalID",
    "animalName",
    "animalOthernames",
    "animalSpecies",
    "animalSex",
    "animalStatus",
    "animalBreed",
    "animalColor",
    "animalAltered",
    "animalBirthdate",
    "animalPictures": [ ... ],
    "animalRescueID",
}

animalpicutres are also an array of object, where each object is a picture
{
        "mediaID",
        "mediaOrder",
        "lastUpdated",
        "fileSize",
        "resolutionX",
        "resolutionY",
        "fileNameFullsize",
        "fileNameThumbnail",
        "urlSecureFullsize",
        "urlSecureThumbnail",
        "urlInsecureFullsize",
        "urlInsecureThumbnail",
        
*/

export default {
    name: 'CatCard',
    props: {
        cat: {
            type: Object,
            required: true
        }
    },
    methods: {
        passCat() {
            sessionStorage.setItem('cat', JSON.stringify(this.cat));
        }
    },
    computed: {
        img() {
            return (this.cat.animalPictures && this.cat.animalPictures.length) ? this.cat.animalPictures[0].urlSecureThumbnail : placeholder //'https://placehold.co/600x600?text=Cat+Image+Not+Available'
        }
    }
    
}

</script>

<style scoped>
.cat-card {
    display: inline-block;
    flex-direction: column;
    align-items: center;
    margin: 2vh;
    padding: 0.3vh;
    border: 5px solid #000000;
    border-radius: 10px;
    background-color: #C5979D;
    box-shadow: 3px 3px 1px 1px #000000;
    width: 10vw;
}

.cat-card img {
    width: 10vw;
    height: 10vw;
    margin-bottom: 1vh;
}

.cat-card h2 {
    font-size: 1vw;
    text-align: center;
}

.cat-card h3 {
    font-size: 0.8vw;
    text-align: center;
}

a{
    text-decoration: none;
    color: black;
}

a:hover{
    color: #533f42;
}

</style>