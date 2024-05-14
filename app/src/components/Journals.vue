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
                <th>ID</th>
                <th>Type</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Due Date</th>
            </tr>
            <tr v-for="journal in journals" :key="journal.journalEntryID">
                <td v-if="showButtons"><input type="checkbox" @click="()=>{
                    if(journal.checked === undefined) journal.checked = true;
                    else journal.checked = !journal.checked;
                }"></td>
                <td>{{ journal.journalEntryID }}</td>
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
            }
        },
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

    th {
        background-color: #f2f2f2;
    }
</style>
