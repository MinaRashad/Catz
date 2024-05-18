<!-- on drop file uploader -->
<template>
    <div class="dropzone" @drop="drop" @click="upload" @dragover.prevent>
        <slot></slot>
    </div>
</template>

<script>

export default {
    name: 'uploadContainer',
    props: {
        handleFiles: {
            type: Function,
            default: () => {}
        }
    },
    methods: {
        drop(e) {
            e.preventDefault();
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        },
        upload(){
            // prompt to select files
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.onchange = (e) => {
                this.handleFiles(e.target.files);
            }
            input.click();
            input.remove();
            
        }
    }
}

</script>

<style>

.dropzone {
    border: 2px dashed #ccc;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    font-size: 5vh;
}

</style>