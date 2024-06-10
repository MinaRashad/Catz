<template>
    <router-link :to="{name:'catDetails'}">
        <h1>{{ '<<' }}</h1>
    </router-link>
    <h2>Journal Upload</h2>
    <div>
        <label>Initials (4 letters max)</label><input type="text" v-model="initials" maxlength="4">
        <label>Number of entries</label><input type="number" v-model="numEntries">
        <button @click="()=>{addJournals(); journals_visible=true}">Create</button>
    </div>

    <table v-if="journals_visible">
        <thead>
            <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Comment</th>
                <th>Due Date</th>
                <th>Reminder Date</th>
                <th>Cost in USD</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="n in numEntries" :key="n">
                <td><input type="date" v-model="journals[n-1].journalEntryDate"></td>
                <td><select v-model="journals[n-1].journalEntrytypeDescription">
                    <option v-for='type in ["De Wormer 1", "De Wormer 2"
                    , "FVRCP", "Rabies", "FIV/FeLV", "Microchip", "Weight", "Medication", "Blood", "Medical", "Fecal", "GAP Funding", "Vet"
                    ]' :key="type">{{ type }}</option>
                </select></td>
                <td><input type="textarea" v-model="journals[n-1].journalEntryComment"></td>
                <td><input type="date" v-model="journals[n-1].journalEntryDueDate"></td>
                <td><input type="date" v-model="journals[n-1].journalEntryReminderDate"></td>
                <td><input type="number" v-model="journals[n-1].journalEntryCost"></td>
            </tr>
        </tbody>
    </table>
    
</template>


<script>
    export default {
        name: 'JournalUpload',
        data(){
            return {
                initials: '',
                numEntries: 0,
                journals: [],
                journals_visible:false,
                journalTemplate:{
                    journalEntryDate: (new Date()).toISOString().split('T')[0],
                    journalEntrytypeDescription: '',
                    journalEntryComment: '',
                    journalEntryDueDate: '',
                    journalEntryReminderDate: '',
                    journalEntryCost: ''
                }
            }
        },
        methods:{
            addJournals(){
                this.journals = [];
                this.journalTemplate.journalEntryComment = this.initials+': ';
                for(let i=0; i<this.numEntries; i++)
                this.journals.push({...this.journalTemplate});
            }
        },
    }
</script>