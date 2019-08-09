<template>
  <v-app>
    <Toolbar></Toolbar>
    <template>
      <v-content class="contents">
        <v-container fluid>
          <router-view/>
        </v-container>
      </v-content>
    </template>
    <Footer/>
  </v-app>
</template>

<script>
import Toolbar from './components/layout/ToolBar'
import Footer from './components/layout/Footer'
import {
  SET_CURRENT_BRANCHE
} from './store/mutation-types'
import {
    LOAD_ALL_DATA
} from './store/action-types'

export default {
  name: 'App',
  components: {
    Toolbar,
    Footer,
  },

  data () {
    let random = Math.floor(Math.random() * 6) + 1
    return {
      title: 'YGGDRASH Explorer',
      drawer: true,
      miniVariant: false,
      random
    }
  },

  methods: {
    randomBackground() {
      return `contents${this.random}`
    }
  },

  created () {
    this.$store.dispatch(LOAD_ALL_DATA)
    document.title = this.title
  },

  watch: {
    '$route' (to) {
      if(to.params.id) {
        if(!this.$store.state.branches) {
          console.warn('Fail Loading branches')
          this.$router.push('/')
          return
        }

        let currentBranch = this.$store.state.branches.find(b => {
          return b.id === to.params.id
        })

        if(!currentBranch) {
          console.warn('Not Found BranchId')
          this.$router.push('/')
          return
        }

        this.$store.commit(SET_CURRENT_BRANCHE, currentBranch)
      }
    }
  }
}
</script>
<style scoped>
  .container {
    max-width: 1440px;
  }
  /*TODO: Fix me ex) for*/
  .contents {
    background-image: url("assets/images/back.jpg");
    background-size: cover;
  }

</style>
