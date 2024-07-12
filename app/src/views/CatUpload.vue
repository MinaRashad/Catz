<template>
    <RouterLink :to="{name:'catDetails'}">
        <img src="../assets/dancing_back.png" alt="back" class="danceback" title="dance back">
    </RouterLink>
    <uploadContainer :handleFiles="handleFiles">
        <h1>Drop files here</h1>
    </uploadContainer>
<h1>Files:</h1>

 <button v-if="!uploading" class="upload" @click="uploadFiles">Upload</button>
 <h1 v-else>Uploading {{ Math.round(100*uploadedSize/totalSize) }}%</h1>
    <table>
        <thead>
            <tr class="table-row-even">
                <th>File Name</th>
                <th>type</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(file, index) in files" :key="file.name" :class="index % 2 === 0 ? 'table-row-even' : 'table-row-odd'">
                <td>{{ file.name }}</td>
                <td>
                    <select :value="fileType(file.name)"  @change="event => {
                        types[file.name] = event.target.value;
                    }">
                        <option value="image">Image</option>
                        <option value="document">Document</option>
                    </select>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    import uploadContainer from '../components/uploadContainer.vue'
    // import ref from 'vue'
    export default {
        name: 'CatUpload',
        data() {
            return {
                files: [],
                types: {},
                uploading : false,
                totalSize : 0,
                uploadedSize : 0
            }
        },
        computed: {
            cat() {
                return JSON.parse(sessionStorage.getItem('cat'));
            }
        },
        components: {
            uploadContainer
        },
        methods: {
            handleFiles(files) {
                this.uploading = false;
                this.uploadedSize = 0;
                // files come as a FileList
                // convert to array
                console.log("uploaded")
                console.log(...files)
                // see file contents
                this.files = [...this.files, ...files];
                
                this.totalSize = this.files.reduce((acc, file) => acc + file.size, 0);
            },
            fileType: function(filename) {
                const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];

                const extension = filename.split('.').pop();

                if (IMAGE_EXTENSIONS.includes(extension)) {
                    return 'image';
                } else {
                    return 'document';
                }
            },
            async uploadFiles() {

                this.uploading = true;
                if(this.files.length === 0){
                    alert("No files to upload")
                    return;
                }
                // get the type and console log it
                this.files.forEach(file => {
                    if(!this.types[file.name]){
                        this.types[file.name] = this.fileType(file.name)
                    }
                })

                // lets post one file to the server for testing
                for(let file of this.files){
                    const type = this.types[file.name];

                    let data = {cat_id: this.cat.animalID};
                    let fileData = {name: file.name, type: type};

                    fileData.base64 = "";
                    fileData.base64 = await this.readFile(file);
                    fileData.base64 = fileData.base64.split(',')[1];
                    data.file = fileData;
                    await this.upload(data)
                    this.uploadedSize += file.size;

                    if(this.uploadedSize === this.totalSize){
                            this.files = [];
                            this.types = {};
                            // update data set
                            const url = new URL(window.location.href);
                            const BASE_URL = `${url.protocol}//${url.hostname}`;
                            fetch(`${BASE_URL}:3000/update_dataset`).then(() => {
                                // remove session storage
                                sessionStorage.removeItem('cat');
                                this.$router.push({name: 'searchCats'});
                            })
                        }


            }

                                           
            },
            upload(data){
                console.log("Data: ",data.file.name)
                const url = new URL(window.location.href);
                const BASE_URL = `${url.protocol}//${url.hostname}`;
                return fetch(`${BASE_URL}:3000/file`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            },
            wait(ms){
                return new Promise((resolve)=>{
                    setTimeout(resolve,ms)
                })
            },
            readFile(file){
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);

                });
}

        }
    }
</script>

<style>
    .upload {
        margin: 10px;
        padding: 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;

    }
</style>