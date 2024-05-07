<template>
    <div>
        <h1 v-show="loading">Loading journals for cat {{ cat_id }}...</h1>
        <table v-if="!loading">
            <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Due Date</th>
            </tr>
            <tr v-for="journal in journals" :key="journal.journalEntryID">
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
        data() {
            return {
                journals: [],
                loading: false
            }
        },
        props: {
            cat_id: {
                type: Number,
                required: true
            }
        },
        mounted() {
            this.getJournals();
        },
        methods: {
            getJournals() {
                this.loading = true;

                fetch(`http://localhost:3000/journals?cat_id=${this.cat_id}`)
                .then(response => response.json())
                .then(data => {
                    this.journals = data;
                    this.loading = false;
                    
                    // sort them by type

                    this.journals.sort((a, b) => {
                        if (a.journalEntrytypeDescription < b.journalEntrytypeDescription) {
                            return -1;
                        }
                        if (a.journalEntrytypeDescription > b.journalEntrytypeDescription) {
                            return 1;
                        }
                    });


                })
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
