<template>

    <router-link :to="{name:'catDetails'}">
        <img src="../assets/dancing_back.png" alt="back" class="danceback" title="dance back">
    </router-link>
    <div v-show="journal_types_loaded">    
        <h2>Journal Upload</h2>
    <div>
        <label>Initials (4 letters max)</label><input type="text" v-model="initials" maxlength="4">
        <label>Number of entries</label><input type="number" v-model="numEntries">
        <button @click="()=>{createJournals(); journals_visible=true}">Create</button>
    </div>

    <table v-if="journals_visible">
        <thead>
            <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Comment</th>
                <th>Due Date</th>
                <th>Reminder Date</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="n in numEntries" :key="n" :class="n%2==0?'table-row-even':'table-row-odd'">
                <td><input type="date" v-model="journals[n-1].journalEntryDate"></td>
                <td><select v-model="journals[n-1].journalEntrytypeDescription">
                    <option v-for='type of Object.values(journalTypes).map(x=>x.name).toSorted()' :key="type.name">{{ type }}</option>
                </select>
                </td>
                <td><input type="textarea" v-model="journals[n-1].journalEntryComment"></td>
                <td><input type="date" v-model="journals[n-1].journalEntryDueDate"></td>
                <td><input type="date" v-model="journals[n-1].journalEntryReminderDate"></td>
                <td><button class="delete" @click="()=>{
                    journals.splice(n-1,1);
                    numEntries--;
                }">Del</button></td>
            </tr>
            <button @click="addJournal">Add</button>
            <button @click="submit">Submit</button>
            <div v-if="submitting" class="loading">
                Submitted {{ submitted_count }} of {{ numEntries }} journals
            </div>
        </tbody>
    </table>
</div>
<div v-show="!journal_types_loaded">
    <h2>Loading...</h2>
</div>


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
                    journalEntryCost: '0.0'
                },
                journalTypes: [],
                journal_types_loaded:false,
                submitting: false,
                submitted_count: 0
            }
        },
        mounted: async function(){
            const url = new URL(window.location.href);
            const BASE_URL = `${url.protocol}//${url.hostname}`;

            const response = await fetch(`${BASE_URL}:3000/journal_types`);
            this.journalTypes = await response.json();
            this.journal_types_loaded = true;

        },
        methods:{
            createJournals(){
                this.journals = [];
                this.journalTemplate.journalEntryComment = this.initials.toLocaleUpperCase()+' : ';
                for(let i=0; i<this.numEntries; i++)
                this.journals.push({...this.journalTemplate});
            },
            addJournal(){
                this.journals.push({...this.journalTemplate});
                this.numEntries++;
            },
            async uploadJournal(JE){
                const journalEntry = {
                    journalEntryAnimalID: '',
                    journalEntryComment:'',
                    journalEntryCost:'',
                    journalEntryDate:'',
                    journalEntryDueDate:'',
                    journalEntryEntrytypeID:'',
                    journalEntryReminderDate:'',
                }

                const cat = JSON.parse(sessionStorage.getItem('cat'));
                
                journalEntry.journalEntryAnimalID = cat.animalID;
                journalEntry.journalEntryDate = JE.journalEntryDate;
                journalEntry.journalEntryComment = JE.journalEntryComment;
                journalEntry.journalEntryCost = JE.journalEntryCost;
                journalEntry.journalEntryDueDate = JE.journalEntryDueDate;
                journalEntry.journalEntryReminderDate = JE.journalEntryReminderDate;


                // types are an object with id as key and the value is an object with name key
                // we need the id, which is a key
                for(let type in this.journalTypes){
                    if(this.journalTypes[type].name === JE.journalEntrytypeDescription){
                        journalEntry.journalEntryEntrytypeID = type;
                        break;
                    }
                }

                    // check if any of these values is empty
                    if(journalEntry.journalEntryDate == '' ||
                        journalEntry.journalEntryAnimalID == '' ||
                        journalEntry.journalEntryEntrytypeID == ''
                    ) {
                        return;
                    }

                    // currently date is yyyy-mm-dd
                    // we need it to be mm/dd/yyyy
                    let date = journalEntry.journalEntryDate.split('-');
                    journalEntry.journalEntryDate = `${date[1]}/${date[2]}/${date[0]}`;
                    if (journalEntry.journalEntryDueDate != ''){
                        let dueDate = journalEntry.journalEntryDueDate.split('-');
                        journalEntry.journalEntryDueDate = `${dueDate[1]}/${dueDate[2]}/${dueDate[0]}`;
                    }
                    if (journalEntry.journalEntryReminderDate != ''){
                        let reminderDate = journalEntry.journalEntryReminderDate.split('-');
                        journalEntry.journalEntryReminderDate = `${reminderDate[1]}/${reminderDate[2]}/${reminderDate[0]}`;
                    }
                    // if comment is same as initials, remove initials
                    if(journalEntry.journalEntryComment == this.journalTemplate.journalEntryComment){
                        journalEntry.journalEntryComment = '';
                    }

                // finally we upload the journal entry
                // to make it dynamic with any current domain
                const url = new URL(window.location.href);
                const BASE_URL = `${url.protocol}//${url.hostname}`;
                

                return fetch(`${BASE_URL}:3000/journal`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(journalEntry)
                })
            },

            async submit(){
                this.submitting = true;
                this.submitted_count = 0;

                for(let JE of this.journals){
                    await this.uploadJournal(JE);
                    this.submitted_count++;
                }
                this.$router.push({name:'catDetails'});
            }

        },
    }
</script>

<style>
.delete{
    background-color: red;
    color: white;
    border: none;
    border-radius: 5px;
}

.delete:hover{
    background-color: darkred;
    cursor: pointer;
}

</style>