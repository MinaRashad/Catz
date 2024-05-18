<template>
    <RouterLink :to="{name:'catDetails'}">
            <h1>{{ '<<' }}</h1>
    </RouterLink>
    <uploadContainer :handleFiles="handleFiles">
        <h1>Drop files here</h1>
    </uploadContainer>
<h1>Files:</h1> <button>Upload</button>
    <table>
        <thead>
            <tr>
                <th>File Name</th>
                <th>type</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="file in files" :key="file.name">
                <td>{{ file.name }}</td>
                <td>
                    <select :value="fileType(file.name)">
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
    export default {
        name: 'CatUpload',
        data() {
            return {
                files: []
            }
        },
        components: {
            uploadContainer
        },
        methods: {
            handleFiles(files) {
                // files come as a FileList
                // convert to array
                console.log("uploaded")
                console.log(...files)
                // see file contents
                this.files = [...this.files, ...files];
            },
            fileType: function(filename) {
                const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];

                const extension = filename.split('.').pop();

                if (IMAGE_EXTENSIONS.includes(extension)) {
                    return 'image';
                } else {
                    return 'document';
                }
            }
        }
    }
</script>