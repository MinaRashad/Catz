<template>
    <!-- create a search bar -->
    <div class="search">
      <input type="text" v-model="search" id="search" :placeholder="placeholder" @input="callback(search)"
          title=
          "AND for AND operator
OR for OR operator
- for NOT operator"/>
      <button @click="search = ''">Clear</button>
      <slot>
        <!-- here goes the other buttons -->
      </slot>
    </div>
  </template>

<style>
.search {
  display: flex;
  justify-content: center;
  margin-top: 6vh;

}

.search input {
  padding: 0.1vw 0.5vw;
  font-size: 2vw;
  border: 5px solid #000000;
  border-radius: 30px;
  width: 30vw;
  margin: 0 2vw;
}

.search button {
  padding: 0.1vw 0.5vw;
  font-size: 2vw;
  border: 5px solid #000000;
  border-radius: 30px;
  background-color: #000000;
  color: #ffffff;
  cursor: pointer;
}

</style>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      search: ''
    }
  },
  props: {
    placeholder: {
      type: String,
      required: true
    },
    callback: {
      type: Function,
      required: true
    }
  }
}
</script>