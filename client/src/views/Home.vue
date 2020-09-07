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
import {
  SET_CURRENT_BRANCHE
} from '../store/mutation-types'
export default {
  components: {
    Overview, Footer
  },

  computed: {
    ...mapState([
      'blocks', 'branches'
    ]),

    ...mapGetters([
      'branchesExcludeStem', 'linkBase'
    ])
  },

  mounted () {
    this.$store.commit(SET_CURRENT_BRANCHE, {id: `98790b39c9010759bf3a588eb2d5ea5467764b8e`, name: 'HOME'})
  }
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
