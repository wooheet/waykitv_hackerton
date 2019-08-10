<template>
    <v-slide-y-transition mode="out-in">
      <v-layout column>
        <v-flex mb-3/>
        <Overview/>
      </v-layout>
    </v-slide-y-transition>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<script>
  import { mapState, mapGetters } from 'vuex'
  import Overview from './Overview'
  import Footer from '../components/layout/Footer'

  export default {
    components: {
      Overview, Footer,
    },

    computed: {
      ...mapState([
        'blocks', 'branches'
      ]),

      ...mapGetters([
        'branchesExcludeStem', 'linkBase'
      ])
    },

  }
</script>
<style lang="scss" scoped>
  td {
    font-family: 'Roboto Mono', monospace;
    > a {
      text-decoration: none;
    }
  }
</style>
