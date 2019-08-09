<template>
    <div class="white--text">
      <v-layout column>
        <v-flex class="py-4">
          <v-flex sm12 md6 pa-3 py-3>
            <v-container>
              <div v-if="notfoundPath === 'format'">
                <span class="font-weight-medium display-1 text-uppercase"> CAN'T RECOGNIZE THIS FORMAT. </span>
                <div>
                  <span class="py-3 px-3 white--text hashValue mt-5"> {{notfoundHash}}</span>
                </div>
                <div class="mt-4 notfound-contents">
                <span>
                  The search keyword you entered is {{notfoundHash.length}} characters long.<br/>
                  YGGDRASH expects keywords to look like below:
                </span>
                </div>
              </div>
              <div v-else>
                <span class="font-weight-medium display-1 text-uppercase"> SORRY, NO {{ notfoundPath }} FOUND. </span>
                <div>
                  <span class="py-3 px-3 white--text hashValue mt-5"> {{notfoundHash}}</span>
                </div>
                <div class="mt-4">
                <span>
                  The {{notfoundPath}} you searched for does not exist (yet) in YGGDRASH.<br/>
                  Please double check your search keyword.
                </span>
                </div>
              </div>
              <v-card flat class="regex-info white--text">
                <v-layout class="py-2"
                          v-for="(value, props) in info" :key="props">
                  <v-flex sm4>
                    <span class="ml-5"> {{value.props}} </span>
                  </v-flex>
                  <v-flex sm4>
                    <span class="ml-5"> {{value.text}} </span>
                  </v-flex>
                </v-layout>
                <v-layout row class="py-2 ml-4 mt-3">
                  <v-flex xs6 sm8>
                    <span >
                      Block or Transaction hashes and account addresses start with a prefix "0x"
                      and consists of hexadecimal numbers [0~9, a~f].
                      Human readable addresses start with an alphabet.
                    </span>
                  </v-flex>
                </v-layout>
              </v-card>
              <div class="mt-5">
                <v-btn @click="goBack">
                  <v-icon>
                    arrow_back
                  </v-icon>
                  &nbsp;BACK TO PREVIOUS PAGE
                </v-btn>
                <v-btn :to="`/`" tag="button">
                  <v-icon > home </v-icon> GO HOME
                </v-btn>
              </div>
            </v-container>
          </v-flex>
        </v-flex>
      </v-layout>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import {
    SET_NOTFOUND_HASH,
    SET_NOTFOUND_PATH
  } from '../store/mutation-types'
  export default {
    computed: {
      ...mapState([
        'notfoundHash', 'notfoundPath'
      ])
    },
    data () {
      return {
        path: '',
        info: [
          { props: 'Block index', text: 'Decimal numbers only' },
          { props: 'Block hash', text: '64 characters long' },
          { props: 'Transaction hash', text: '64 characters long' },
          { props: 'Account address', text: '40 characters long' },
        ],
      }
    },

    methods: {
      goBack() {
        this.$router.go(-2)
      }
    }

  }
</script>
<style>
  .regex-info {
    margin-top: 40px;
    background: transparent!important;
    border-left: 1px solid black;
  }
  .hashValue {
    display: inline-block;
    background: linear-gradient( to right, 	#A0522D , #B22222 );
    border-radius: 5px;
    font-size: 17px;
  }
</style>
