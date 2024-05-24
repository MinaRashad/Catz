<template>
    <div>
        <div class="controls">
            <RouterLink to="/" v-show="showButtons">
                <button>Create Google Doc</button>
            </RouterLink>

            <RouterLink to="/" v-show="showButtons">
                    <button>Download as pdf</button>
            </RouterLink>


            <button @click="saveCheckedJournals" v-show="showButtons">Copy Journals to other cats</button>
        </div>
        <table v-if="journals.length>0">
            <tr>
                <th>copy?</th>
        <th @click="sortBy('journalEntrytypeDescription')">
          Type <span>{{ sortIcon('journalEntrytypeDescription') }}</span>
        </th>
        <th @click="sortBy('journalEntryComment')">
          Comment <span>{{ sortIcon('journalEntryComment') }}</span>
        </th>
        <th @click="sortBy('journalEntryDate')">
          Date <span>{{ sortIcon('journalEntryDate') }}</span>
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
                <td>{{ journal.journalEntrytypeDescription }}</td>
                <td>{{ journal.journalEntryComment }}</td>
                <td>{{ journal.journalEntryDate }}</td>
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
            }
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
            }
        
        }

    }
</script>


<style scoped>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        border: 1px solid black;
        padding: 8px;
        text-align: left;
    }

    th span{
        cursor: pointer;
    }

</style>
