<template>

    <router-link :to="{name:'catDetails'}">
        <h1>{{ '<<' }}</h1>
    </router-link>

            <h2>Medical Journals</h2>
            <div v-if="loadingJournals">Loading...</div>
        <div v-if="!loadingJournals">
            <div v-for="JE in Vet_info_group_1" :key="JE.journalEntryDate">{{ JE }}</div>

            <br><br><br>
            <hr>
            <br><br><br>


            <div v-for="JE in Vet_info_group_2" :key="JE.journalEntryDate">{{ JE }}</div>

            <br><br><br>

            <hr>
            <br><br><br>


            <div v-for="JE in Vet_info_group_3" :key="JE.journalEntryDate">{{ JE }}</div>

            <br><br><br>

            <hr>
            <br><br><br>


            <div v-for="JE in Medical_Records" :key="JE.journalEntryDate">{{ JE }} </div>   

    </div>
</template>

<script>

    export default {
        name: 'MedicalJournals',
        data(){
            return {
                journals: [],
                loadingJournals: true
            }
        },
        computed: {
            Vet_info_group_1(){
                let types = ['De Wormer', 'FVRCP', 'Rabies', 'FIV/FeLV', 'Microchip'];
                return this.ProcessJournals(this.journals, types);
            },
            Vet_info_group_2(){
                let types = ['Weight', 'Medication', 'Blood', 'Medical', 'Fecal', 'GAP Funding'];
                return this.ProcessJournals(this.journals, types);
            },
            Vet_info_group_3(){
                let types = ['Vet'];
                return this.ProcessJournals(this.journals, types);
            },

            Medical_Records(){
                let types = ['Spay', 'Neuter', 'Flea', 'Dental'];

                // add all groups
                let medical = this.ProcessJournals(this.journals, types);

                medical.push(...this.Vet_info_group_1);
                medical.push(...this.Vet_info_group_2);
                medical.push(...this.Vet_info_group_3);

                return medical;
            }

        },

        mounted(){
            this.getJournals();
        },
        methods: {
            ProcessJournals(journals, types){
                return journals.filter(journal => {
                    for(let type of types){
                        if(journal.journalEntrytypeDescription.includes(type)){
                            return true;
                        }
                    }
                })
                .sort((a, b) => {
                    // sort by type then date desc
                    if(a.journalEntrytypeDescription < b.journalEntrytypeDescription){
                        return -1;
                    }

                    if(a.journalEntrytypeDescription == b.journalEntrytypeDescription){
                        if(a.journalEntryDate < b.journalEntryDate){
                            return 1;
                        }
                    }

                })
                .map((JE)=>{
                    let startIndex = JE.journalEntryComment.indexOf(':')
                    let JE_desc = JE.journalEntryComment;
                    if(startIndex > 0 && startIndex < 5){
                        JE_desc = JE.journalEntryComment.substring(startIndex + 1);
                    }
                    return JE.journalEntryDate + " - " + JE.journalEntrytypeDescription + " - " + JE_desc
                });
            },
            getJournals() {
                // to make it dynamic with any current domain
                const url = new URL(window.location.href);
                const BASE_URL = `${url.protocol}//${url.hostname}`;
                const cat = JSON.parse(sessionStorage.getItem('cat'))


                fetch(`${BASE_URL}:3000/journals?cat_id=${cat['animalID']}`)
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
                    console.log("DOne")
                    this.loadingJournals = false;
                    console.log(data);

                })
            }
        }
    }

</script>

<style>



*{
    font-family: 'Arial';
    font-size: 16px;
    margin: 1px;
    padding: 5px;
}




</style>