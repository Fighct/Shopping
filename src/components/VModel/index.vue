<template>
  <div>
    <!-- v-model="msg"相当于:value="msg" @input="msg = $event.target.value" -->
    <input type="text" v-model="msg">
    <span>{{msg}}</span>
  </div>
</template>

<script>
import S1 from './son1.vue'
export default {
    name: 'VModel',
    data() {
        return {
            msg: ''
        }
    },
    components: {
        S1
    }
}
</script>

<style>

</style>