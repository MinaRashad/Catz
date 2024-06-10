<template>
    <div>
        <div class="controls">
            <span v-show="showButtons">
                <button @click="getGoogleDoc">Create Medical Record Doc</button>
            </span>

            <RouterLink to="/medicalJournals" v-show="showButtons">
                <button>Medical Journal Entries</button>
            </RouterLink>

            <RouterLink to="/journalUpload" v-show="showButtons">
                <button>Upload Journal Entries</button>
            </RouterLink>

            <!-- <RouterLink to="/" v-show="showButtons">
                    <button>Download as pdf</button>
            </RouterLink>

            <span v-show="showButtons" @click="copyMedicalData">
                    <button>Copy Medical Data</button>
            </span> -->


            <button @click="saveCheckedJournals" v-show="showButtons">Copy Journal Entries to other cats
            </button>
        </div>
        <table v-if="journals.length>0">
            <tr>
                <th v-if="showButtons" >copy?</th>
        <th @click="sortBy('journalEntryDate')">
          Date <span>{{ sortIcon('journalEntryDate') }}</span>
        </th>
        <th @click="sortBy('journalEntrytypeDescription')">
          Type <span>{{ sortIcon('journalEntrytypeDescription') }}</span>
        </th>
        <th @click="sortBy('journalEntryComment')">
          Comment <span>{{ sortIcon('journalEntryComment') }}</span>
        </th>
        <th @click="sortBy('journalEntryDueDate')">
          Due Date <span>{{ sortIcon('journalEntryDueDate') }}</span>
        </th>
            </tr>
            <tr v-for="journal in sortedJournals" :key="journal.journalEntryID">
                <td v-if="showButtons"><input type="checkbox" @click="()=>{
                    if(journal.checked === undefined) journal.checked = true;
                    else journal.checked = !journal.checked;
                }"></td>
            <td>{{ journal.journalEntryDate }}</td>
            <td>{{ journal.journalEntrytypeDescription }}</td>
            <td>{{ journal.journalEntryComment }}</td>
            <td>{{ journal.journalEntryDueDate }}</td>
            </tr>
        </table>
        
    </div>
</template>

<script>

// journals have the following fields:
// journalEntryID
// journalEntryComment
// journalEntryDate
// journalEntryDueDate
// journalEntrytypeDescription


    export default {
        name: 'CatJournals',

        props: {
            journals: {
                type: Array,
                default: () => [],
            },
            showButtons: {
                type: Boolean,
                default: () => true,
            }
        },
        computed: {
            sortedJournals(){
                console.log(this.sortJournals)
                if(this.sortByKey){
                    return this.sortJournals(this.journals, this.sortByKey, this.sortAscending);
                } else {
                    return this.journals;
                }
            },
            medicalJournals() {
                let MedicalJournalTypes = ['De Wormer', 'FVRCP', "Rabies", "Spay", "Neuter",
                    "Flea", "Microchip", "FIV", "FeLV", "Medical"
                ]
                return this.journals.filter(journal =>{
                    for(let type of MedicalJournalTypes){
                        if(journal.journalEntrytypeDescription.includes(type)){
                            return true;
                        }
                    }
                });

            },

        },
        data() {
            return {
                sortByKey: null,
                sortAscending: true,
            };
        },
        methods: {
            saveCheckedJournals() {
                // get all checked journals
                
                let checkedJournals = this.journals.filter(journal => journal.checked);

                sessionStorage.setItem('checkedJournals', JSON.stringify(checkedJournals));
            
                if(checkedJournals.length === 0) {
                    alert('No journals selected');
                } else {
                    // route to the copy journals page
                    this.$router.push({ name: 'selectCopyCats' });
                }
            },
            sortBy(key) {
                if (this.sortByKey === key) {
                    this.sortAscending = !this.sortAscending;
                } else {
                    this.sortByKey = key;
                    this.sortAscending = true;
                }
                },

            sortIcon(key) {
                if (this.sortByKey !== key) return '▲';
                return this.sortAscending ? '▼' : '▲';
            },

            sortJournals(journals, key, ascending = true) {
                journals.sort((a, b) => {
                    let valueA = a[key];
                    let valueB = b[key];

                    valueA = valueA || 1e14;
                    valueB = valueB || 1e14;

                    // Handle date comparison
                    if (key.toLowerCase().includes("date")) {
                        const dateA = new Date(valueA);
                        const dateB = new Date(valueB);
                        return ascending ? dateA - dateB : dateB - dateA;
                    }

                    // Handle string comparison (case-insensitive)
                    if (typeof valueA === 'string' && typeof valueB === 'string') {
                        const lowerA = valueA.toLowerCase();
                        const lowerB = valueB.toLowerCase();
                        return ascending ? lowerA.localeCompare(lowerB) : lowerB.localeCompare(lowerA);
                    }

                    // Handle general comparison
                    return ascending ? valueA - valueB : valueB - valueA;
                });

                return journals; // Return the sorted array (optional)
            },
            getGoogleDoc() {
                // use the previous API instead
                const url = "http://volunteers.thedancingcat.org/export/export?id="
                let cat = JSON.parse(sessionStorage.getItem('cat'));
                let catId = cat.animalID;
                let googleDocUrl = url + catId;

                // open link in a new tab
                window.open(googleDocUrl, '_blank');

                
            }
        
        }

    }
</script>


<style scoped>
    table {
        width: auto;
        border-collapse: collapse;
        margin-left: 5em;
        margin-right: 5em;
        font-size: x-large;
    }

    th, td {
        border: 1px solid black;
        padding: 8px;
        text-align: left;
    }

    th span{
        cursor: pointer;
    }

    input[type="checkbox"] {
        width: 50px;
        height: 50px;
        /* make it stylish */
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border: 2px solid #000000;
        background-color: aliceblue;
        border-radius: 5px;
        cursor: pointer;

    }

    input[type="checkbox"]:checked {
        background-color: #449d3c;
        /* add check */
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><path d="M1.73 12.91l6.37 6.37L22.79 4.59" /></svg>');
        
        background-size: 50%;
        background-position: center;
        background-repeat: no-repeat;

    }

</style>
