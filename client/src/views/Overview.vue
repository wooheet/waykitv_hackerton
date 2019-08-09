<template>
  <v-slide-y-transition mode="out-in">
    <v-layout column >
      <v-flex mt-5>
        <v-layout wrap >
          <v-flex pa-1>
            <v-flex mb-0 >
              <v-card class="network-info">
                <!--<Login class="mt-4" :branchInfo="branchInfo" :linkBase="linkBase"/>-->
              </v-card>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-slide-y-transition>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<script>
import { mapState, mapGetters } from 'vuex'
import RecentBlockWidget from '../components/RecentBlockWidget'
import Login from '../components/Login'
import {
  LOAD_BLOCKS,
} from '../store/action-types'

export default {
  components: {
    RecentBlockWidget,
    Login,
  },
  computed: {
    ...mapState([
      'blocks',
      'branchInfo',
      'loading'
    ]),

    ...mapGetters([
      'linkBase'
    ]),
  },

  methods: {
    refreshBlcok () {
      this.$store.dispatch(LOAD_BLOCKS)
    },
  },

  watch: {
    '$route' (to) {
      this.$store.dispatch(LOAD_BLOCKS)
    },
  },
}
</script>
<style lang="scss" scoped>
  td {
    font-family: 'Roboto', monospace;
  }
  .v-card {
    border-radius: 10px;
    padding-top:20px;
    padding-bottom:10px;
  }
  .v-btn {
    background: rgba(255, 255, 255, 0.1);
  }
  .span {
    font-style: normal;
    font-weight: bold;
    font-size: 13px;
    line-height: 15px;
    text-transform: uppercase
  }
  .opacity {
    background-color: rgba(66, 66, 66, 0.3);
  }
  .transaction-history {
    background-color: rgba(66, 66, 66, 0.3);
    height: 300px;
  }
  .network-info {
    background-color: rgba(66, 66, 66, 0.3);
    height: 300px;
  }
  .refresh {
    margin-top: -2px;
  }
  .refresh:hover {
    color: #83AFA5;
  }
</style>
