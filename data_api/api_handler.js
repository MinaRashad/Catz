// access rescue groups api
/*
 * This script is using the V2 API from RescueGroups.org
 * Documentation for API can be found here: https://userguide.rescuegroups.org/display/APIDG/API+Developers+Guide+Home
 * 
 */

const request = require('request');
const express = require('express');
const router = express.Router();
const app = express();
const json = require('json');
const fs = require('fs');


// Increase the limit
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: true}));


// // allow CORS
app.use((req, res, next) => {
    // allow from localhost:8080 only
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    // res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Allow specified HTTP methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specified headers
    res.setHeader('Access-Control-Allow-Credentials', true); // Allow credentials like cookies (if applicable)
    next();
});

app.use(express.json());



// get config.json
const config = require('./config.json');
const { type } = require('os');
const { log } = require('console');

const base_url = config.BASE_URL
const api_key = config.API_KEY
const username = config.RESCUE_GROUPS_USERNAME
const password = config.RESCUE_GROUPS_PASSWORD
const account_number = config.RESCUE_GROUPS_ACCOUNT_NUMBER

// login_creds
let login_creds = null

/**
 * Login function
 * 
 * @function login
 * 
 * @returns {Promise} with login data
 * 
 * This function logs into the API and returns the login data
 * 
 */

function login() {
    return new Promise((resolve,reject)=>{
        if (login_creds) {
            resolve(login_creds)
            return
        }
        request.post(base_url,{
                json: {
                    "username": username,
                    "password": password,
                    "accountNumber": account_number,
                    "action": "login"
                }

            }, (error, response, body) => {
                if (error) {
                    console.error(error)
                    return reject(error)
                }
                console.log(username, password, account_number) 
                if(body['data']['token']) console.log(`Login successful. Token: ${body['data']['token']}`)
                
                login_creds = body['data']
                resolve(body['data'])
        })
    })

}


// instead of using the API to search,
// since the data is small and not updated very frequently,
// we can save the data in memory locally

/**
 * @function save_dataset
 * 
 * input: none
 * output: none
 * 
 * This function retrieves the dataset and saves it in a JSON file locally
 * 
 * This will make searches more effective and save on API calls
 */

function save_dataset(){
    return new Promise((resolve,reject)=>{
        const FILENAME = './available_cats.json'
        // check if dataset exists
        login().then(login_creds => {
            request.post(base_url,{
                json: {
                    "token": login_creds['token'],
                    "tokenHash": login_creds['tokenHash'],
                    "objectType": "animals",
                    "objectAction": "search",
                    "search": {
                        "resultStart": 0,
                        "resultLimit":800,
                        "resultSort": "animalCreatedDate",
                        "resultOrder": "asc",
                        "filters": [
                            {
                                "fieldName": "animalSpecies",
                                "operation": "equals",
                                "criteria": "cat"
                            },
                            {
                                fieldName: "animalStatus",
                                operation: "equals",
                                criteria: "Available"
                            },
                            {
                                fieldName: "animalStatus",
                                operation: "equals",
                                criteria: "Hold"
                            },
                            {
                                fieldName: "animalStatus",
                                operation: "equals",
                                criteria: "Pending"
                            },
                            {
                                fieldName: "animalName",
                                operation: "contains",
                                criteria: "Courtesy Post"
                            }
                                                    
                        ],
                        "filterProcessing": "1 AND NOT 5 AND (2 OR 3 OR 4)",
                        "fields": ["animalID",
                                "animalName",
                                "animalOthernames",
                                "animalSpecies",
                                "animalSex",
                                "animalGeneralAge",
                                "animalStatus",
                                "animalBreed",
                                "animalColor",
                                "animalAltered",
                                "animalBirthdate",
                                "animalPictures",
                                "animalRescueID",
                                "descriptionText"]
                    }
                }
            }, (error, response, body) => {
                if (error) {
                    console.error(error)
                    return error
                }

                // save dataset
                data = body['data']
                fs.writeFile(FILENAME,JSON.stringify(data), (err) => {
                    if (err) throw err;
                    console.log(Object.keys(data).length + ' cats saved to file successfully.');
                });

                resolve(data)
            })  
        })
        .catch((error) => {
            console.error(error)
            login_creds = null
            reject(error)
        })
    })
}

/**
 * read_dataset
 * 
 * @returns {Promise} with dataset
 */

function read_dataset(){
    return new Promise((resolve,reject)=>{
        const FILENAME = 'available_cats.json'
        fs.readFile(FILENAME, (err, data) => {
            if (err) throw err;
            resolve(JSON.parse(data))
        });
    })
}

/**
 * Search function
 * 
 * @param {string} search_term 
 * 
 * @returns {Promise} with search results
 */

function search(search_term){
    search_term = search_term?search_term:''
    console.log('searching for: '+search_term)
    return new Promise((resolve,reject)=>{
        read_dataset().then(data => {
            // turn data json into array
            data = Object.values(data)
            let terms = search_term.split(';')
            // remove last term if length is larger than 1 and last term is empty
            if (terms.length > 1 && terms[terms.length-1] === '') terms.pop()

            let filtered_data = data

            // filter data
            terms.forEach(term => {
                let not_indicator = term.startsWith('-')
                if (not_indicator) term = term.replace('-','')
                filtered_data = filtered_data.filter((cat) => {
                    // search all fields for search term
                        for (const [key, value] of Object.entries(cat)) {
                                                        
                            if ( typeof value === 'string' && value.toLowerCase().includes(term.toLowerCase())) {
                                return !not_indicator // if not indicator is present, return false
                            }
                            
                        }
    
                        return not_indicator // if not indicator is present, return true
                })
            })
            
            resolve(filtered_data)
        })
        .catch((error) => {
            console.error(error)
            reject(error)
        })
    })
}

/**
 * Get Cat function
 * 
 * @param {Number} cat_id
 */

function get_cat(cat_id){
    return new Promise((resolve,reject)=>{
        search(cat_id).then(data => {
            resolve(data[0])
        })
    })
}

/**
 * @function get_journals
 * 
 * @param {Number} cat_id
 * 
 * @returns {Promise} with journal entries
 * 
 * This function retrieves journal entries for a cat
 * */

function get_journals(cat_id){
    return new Promise((resolve,reject)=>{
        login().then(login_creds => {
            request.post(base_url,{
                json: {
                    "token": login_creds['token'],
                    "tokenHash": login_creds['tokenHash'],
                    "objectType": "animalsJournalEntries",
                    "objectAction": "search",
                    "search": {
                        "resultStart": 0,
                        "resultLimit":200,
                        "resultSort": "journalEntryDate",
                        "resultOrder": "asc",
                        "filters": [
                            {
                                "fieldName": "journalEntryAnimalID",
                                "operation": "equals",
                                "criteria": cat_id
                            }
                        ],
                        "fields": [
                            "journalEntryID", "journalEntryAnimalID", "journalEntryDate", 
                            "journalEntryComment", "journalEntryEntrytypeID","journalEntrytypeDescription", 
                            "journalEntrytypeCategoryID", "journalEntrytypeCategoryName", "journalEntryCost",
                            "journalEntryDueDate", "journalEntryReminderDate", "journalEntryReminderContactID",
                            "journalEntryReminderContactName", "animalNotes", "animalOrigin"
                        ]
                    }
                }
            }, (error, response, body) => {
                if (error) {
                    console.error(error)
                    return error
                }
                resolve(Object.values(body['data']))
            })  
        })
        .catch((error) => {
            console.error(error)
            login_creds = null
            reject(error)
        })
    })
}



/**
 * @function upload_journal
 * 
 * @param {Object} journal_data
 * 
 * @description This function uploads a journal entry
 * 
 * @returns 200 if successful, 500 if not
 */

function upload_journal(journal_data){
    login().then(login_creds => {
        request.post(base_url,{
            json: {
                "token": login_creds['token'],
                "tokenHash": login_creds['tokenHash'],
                "objectType": "animalsJournalEntries",
                "objectAction": "add",
                "values": [
                    {
                        "journalEntryAnimalID": journal_data['journalEntryAnimalID'],
                        "journalEntryDate": journal_data['journalEntryDate'],
                        "journalEntryComment": journal_data['journalEntryComment'],
                        "journalEntryEntrytypeID": journal_data['journalEntryEntrytypeID'],
                        "journalEntryCost":  journal_data['journalEntryCost'],
                        "journalEntryDueDate": journal_data['journalEntryDueDate'],
                        "journalEntryReminderDate": journal_data['journalEntryReminderDate'],
                    }
                ]
            }
        }, (error, response, body) => {
            if (error) {
                console.error(error)
                return 500
            }
            return 200
        })      
    })
}

/**
 * @function get_files
 * 
 * @param {Number} cat_id
 * 
 * @returns {Promise} with files
 */

function get_files(cat_id){
    return new Promise((resolve,reject)=>{
        login().then(login_creds => {
            request.post(base_url,{
                json: {
                    "token": login_creds['token'],
                    "tokenHash": login_creds['tokenHash'],
                    "objectType": "animalFiles",
                    "objectAction": "search",
                    "search": {
                        "resultStart": 0,
                        "resultLimit":200,
                        "resultSort": "animalfileID",
                        "resultOrder": "asc",
                        "filters": [
                            {
                                "fieldName": "animalfileAnimalID",
                                "operation": "equals",
                                "criteria": cat_id
                            }
                        ],
                        "fields": [
                            'animalfileAnimalID',"animalfileID", "animalfileOldName", "animalfileDescription",
                            "animalfileStatus", "animalfileDisplayInline", "animalfilePublic",
                            "animalfileSize", "animalfileCreatedDate"
                        ]
                    }
                }
            }, (error, response, body) => {
                if (error) {
                    console.error(error)
                    return error
                }
                console.log(response.statusCode == 200 ? 'Files retrieved successfully' : 'Error retrieving files')
                resolve(Object.values(body['data']))
            })  
        })
    })
}

/**
 * @function upload_file
 * 
 * @param {Number} cat_id
 * @param {Object} file - file object with file name and data
 * 
 * 
 * @returns 200 if successful, 500 if not
 */

function upload_file(cat_id, file){
    return new Promise((resolve,reject)=>{
        login().then(login_creds => {
            request.post(base_url,{
                json: {
                    "token": login_creds['token'],
                    "tokenHash": login_creds['tokenHash'],
                    "objectType": "animalFiles",
                    "objectAction": "add",
                    "values": [
                        {
                            "animalfileAnimalID":cat_id,
                            "animalfileBinary":file.base64,
                            "animalfileOldFileName":file.name,
                            "animalfileDescription":"Mass upload",
                            "animalfileStatus":"Active",
                            "animalfileDisplayInline":"Yes",
                            "animalfilePublic":"No"
                        }
                    ]
                    
                }
            }, (error, response, body) => {
                if (error) {
                    console.error(error)
                    return error
                }
                console.log(response.statusCode == 200 ? 'File Uploaded successfully' : 'Error uploading file')
                resolve(body['data'])
            })  
        })
    })
}

/**
 * @function upload_picture
 * 
 * @param {Number} cat_id
 * @param {Object} picture - picture object with file name and data
 * 
 * @returns 200 if successful, 500 if not
 */

function upload_picture(cat_id, picture){

    let timestamp = new Date().getTime()
    picture.name = `${timestamp}_${picture.name}`
    console.log(cat_id, picture.name)

    return new Promise((resolve,reject)=>{
        login().then(login_creds => {
            request.post(base_url,{
                json: {
                    "token": login_creds['token'],
                    "tokenHash": login_creds['tokenHash'],
                    "objectType": "animals",
                    "objectAction": "addPicture",
                    "values": [
                        {
                            "animalID":cat_id,
                            "pictureBinary":picture.base64,
                            "fileName": picture.name,
                            "mediaOrder": 2
                        }
                    ]
                }
            }, (error, response, body) => {
                if (error) {
                    console.error(error)
                    return error
                }
                resolve(body['data'])
            })
        }
    )
    })
}

// ********************************************* //
// *************** API ENDPOINTS *************** //
// ********************************************* //

app.get('/search', (req, res) => {
    // get search term parameter
    console.log(req.query)
    search(req.query.searchterm).then(data => {
        res.send(data)
    })

    // end point: /search?search_term=cat
})

app.get('/cat', (req, res) => {
    get_cat(req.query.cat_id).then(data => {
        res.send(data)
    })
    .catch((error) => {
        console.error(error)
        res.sendStatus(500)
    })
})

app.get('/journals', (req, res) => {
    get_journals(req.query.cat_id).then(data => {
        res.send(data)
    })
    .catch((error) => {
        console.error(error)
        res.sendStatus(500)
    })
})

app.get('/update_dataset', (req, res) => {
    save_dataset().then(data => {
        res.sendStatus(200)
    })
    .catch((error) => {
        console.error(error)
        res.sendStatus(500)
    })
})

// post journal entry
app.post('/journal', (req, res) => {
    journal_data = req.body
    upload_journal(journal_data)
    console.log("Uploaded journal entry:" + journal_data)
    res.sendStatus(200)
})

app.get('/files', (req, res) => {
    get_files(req.query.cat_id).then(data => {
        res.send(data)
    })
    .catch((error) => {
        console.error(error)
        res.sendStatus(500)
    })
})

app.post('/file', async (req, res) => {
    // get cat id
    cat_id = req.body.cat_id

    // get file
    file = req.body.file

    // determine type
    if(file.type === 'image'){

        let response = await upload_picture(cat_id, file)
        
        // let _ = await wait(1000)

        res.send(response)
    }
    else{
        console.log(cat_id,file)
        upload_file(cat_id, file).then(data => {
            res.send(data)
        })
    }
})



// check if dataset exists
const FILENAME = 'available_cats.json'
if (!fs.existsSync(FILENAME)) {
    save_dataset()
}

// start server
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`)
})



//********* QUICK fix ***********/

function wait(ms){
    return new Promise((resolve,reject)=>{
        setTimeout(resolve,ms)
    })
}