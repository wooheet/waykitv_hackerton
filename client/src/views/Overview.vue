<template>
  <v-slide-y-transition mode="out-in">
    <div v-if="login">
      <v-layout column >
        <v-flex mt-5>
          <v-layout wrap >
            <v-flex pa-1>
              <v-flex mb-0 >
                <v-card class="network-info">
                  <div class="branch-detail ml-3 white--text">
                    <v-layout wrap class="py-2">
                      <v-flex>
                        <v-form @submit.prevent="submit">
                          <v-text-field
                            dark
                            class="passwordInput"
                            v-model="inputPassword"
                            counter="130"
                            hide-details
                            placeholder="PASSWORD"
                            @click:append="submit"
                          ></v-text-field>
                        </v-form>
                        <div style="margin-top: 20px;">
                          <button v-on:click="loginNext()"> NEXT</button>
                        </div>
                      </v-flex>
                    </v-layout>
                  </div>
                </v-card>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
    <div v-if="register">
      <v-layout column >
        <v-flex mt-5>
          <v-layout wrap >
            <v-flex pa-1>
              <v-flex mb-0 >
                <v-card class="network-info">
                  <div class="ml-3 white--text" >
                    <v-layout wrap class="py-2" style="margin-left:400px;">
                      <div v-if="passwordView">
                        <v-flex>
                          <v-form @submit.prevent="submit">
                            <v-text-field
                              dark
                              class="passwordInput"
                              v-model="inputPassword"
                              counter="130"
                              hide-details
                              placeholder="PASSWORD"
                              @click:append="submit"
                            ></v-text-field>
                          </v-form>
                          <div style="margin-top: 20px;">
                            <button v-on:click="next()"> NEXT</button>
                          </div>
                        </v-flex>
                      </div>
                      <div v-if="register_step1">
                        <v-flex xs12 sm2 mb-2 fluid class="props">MNEMONIC</v-flex>
                        <v-flex xs12 sm10 xsAndDown class="font-weight-regular value">{{mnemonic}}</v-flex>
                        <div style="margin-top: 20px;">
                           <button v-on:click="next2()"> NEXT</button>
                        </div>
                      </div>
                      <div v-if="register_step2">
                        <v-flex xs12 sm2 mb-1 fluid class="props">Address</v-flex>
                        <v-flex xs12 sm10 xsAndDown class="font-weight-regular value">{{address}}</v-flex>
                        <v-form @submit.prevent="submit2">
                          <v-text-field
                            dark
                            class="passwordInput"
                            v-model="inputMnemonic"
                            counter="130"
                            hide-details
                            placeholder="MNEMONIC"
                            @click:append="submit2"
                          ></v-text-field>
                        </v-form>
                        <div style="margin-top: 20px;">
                          <button v-on:click="next3()"> NEXT</button>
                        </div>
                      </div>
                    </v-layout>
                  </div>
                </v-card>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
    <v-layout column v-if="joinComplete">
      <v-flex>
        <v-layout wrap >
          <v-flex sm12 md6 pa-1>
            <v-flex mb-0 >
              <v-card class="network-info white--text">
                <v-flex sm11 mb-3>
                  <span class="title font-weight-medium mb-2 ml-3 white--text">HOSTING ROOM</span>
                </v-flex>
                <v-flex mb-3>
                  <v-form @submit.prevent="submit">
                    <v-text-field
                      dark
                      v-model="hostingKey"
                      class="generateTxKey"
                      counter="130"
                      hide-details
                      placeholder="KEY"
                      @click:append="submit"
                    ></v-text-field>
                  </v-form>
                  <v-btn round v-on:click="hosting()" flat class="white--text">
                    CREATE HOSTING ROOM</v-btn>
                  <span class="title font-weight-medium mb-2 ml-3 white--text">{{hostroomid}}</span>
                </v-flex>
                <v-flex mb-5>
                  <v-layout wrap>
                    <v-form @submit.prevent="submit">
                      <v-text-field
                        dark
                        v-model="guestKey1"
                        class="guestKey"
                        counter="130"
                        hide-details
                        placeholder="KEY"
                        @click:append="submit"
                      ></v-text-field>
                    </v-form>
                    <v-form @submit.prevent="submit">
                      <v-text-field
                        dark
                        v-model="guestKey2"
                        class="guestKey"
                        counter="130"
                        hide-details
                        placeholder="Address"
                        @click:append="submit"
                      ></v-text-field>
                    </v-form>
                  </v-layout>
                  <v-btn round v-on:click="gameStart()" flat class="white--text">
                    GAME START</v-btn>
                  <span class="title font-weight-medium mb-2 ml-3 white--text">{{gameStatus}}</span>
                </v-flex>
                <v-flex mb-5>
                  <v-layout wrap>
                    <v-form @submit.prevent="submit">
                      <v-text-field
                        dark
                        v-model="votingKey"
                        class="voteKey"
                        counter="130"
                        hide-details
                        placeholder="KEY"
                        @click:append="submit"
                      ></v-text-field>
                    </v-form>
                    <v-form @submit.prevent="submit">
                      <v-text-field
                        dark
                        v-model="votingValue"
                        class="voteKey"
                        counter="130"
                        hide-details
                        placeholder="VALUE"
                        @click:append="submit"
                      ></v-text-field>
                    </v-form>
                  </v-layout>
                  <v-btn round  flat v-on:click="voting('host')" class="white--text">
                    VOTING(HOST)</v-btn>
                  <v-btn round  flat v-on:click="voting('guest')" class="white--text">
                    VOTING(GUEST)</v-btn>
                  <span class="title font-weight-medium mb-2 ml-3 white--text">{{voteStatus}}</span>
                </v-flex>
                <v-flex mb-5>
                  <v-form @submit.prevent="submit">
                    <v-text-field
                      dark
                      v-model="endKey"
                      class="generateTxKey"
                      counter="130"
                      hide-details
                      placeholder="KEY"
                      @click:append="submit"
                    ></v-text-field>
                  </v-form>
                  <v-btn round  flat v-on:click="endGame()"  class="white--text">
                    END</v-btn>
                </v-flex>
                <span class="title font-weight-medium mb-2 ml-3 white--text">{{rewardResult}}</span>
              </v-card>
            </v-flex>
          </v-flex>
          <v-flex sm12 md6 pa-1>
            <v-flex mb-0 >
              <v-card class="transaction-history">
                <span class="title font-weight-medium ml-3 white--text mb-5">USER TEST KEY LIST</span>
                <v-layout row
                          wrap
                          v-for="(value, props) in account" :key="props"
                          class="py-2 mt-2">
                  <v-flex ml-3 xs12 sm12 style="color: #9A9A9A">{{ value.address }}</v-flex>
                  <v-flex ml-3 xs6 sm6 style="color: #9A9A9A">{{ value.pk }}</v-flex>
                  <v-flex ml-3 xs6 sm6 style="color: #9A9A9A">{{ value.balance / 100000000 }}</v-flex>
                </v-layout>
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
import {
  HOSTING,
  LOGIN_STEP1,
  REGISTER_STEP1,
  REGISTER_STEP2,
  REGISTER_STEP3,
  GAME_INIT,
  VOTING,
  END_GAME
} from '../store/action-types'

export default {

  computed: {
    ...mapState([
      'blocks',
      'loading',
      'login',
      'register',
      'address',
      'walletInfo',
      'mnemonic',
      'passwordView',
      'register_step1',
      'register_step2',
      'register_step3',
      'joinComplete',
      'hostroomid',
      'gameStatus',
      'voteStatus',
      'balances',
      'rewardResult'
    ]),

    ...mapState({
      account: 'updateUserAccountList'
    }),

    ...mapGetters([
      'linkBase'
    ]),
  },

  data () {
    return {
      inputPassword:'',
      inputMnemonic:'',
      hostingKey:'',
      votingKey:'',
      endKey:'',
      guestKey1:'',
      guestKey2:'',
      votingValue:''
    }
  },
  methods: {
    submit (e) {
      e.preventDefault()
      this.inputPassword = ''
    },
    submit2 (e) {
      e.preventDefault()
      this.inputMnemonic = ''
    },
    next () {
      this.$store.dispatch(REGISTER_STEP1, this.inputPassword)
    },
    next2 () {
      this.$store.dispatch(REGISTER_STEP2)
    },
    next3 () {
      this.$store.dispatch(REGISTER_STEP3, this.inputMnemonic)
    },
    loginNext () {
      this.$store.dispatch(LOGIN_STEP1)
    },

    hosting () {
      this.$store.dispatch(HOSTING, this.hostingKey)
    },

    gameStart () {
      let accounts = {
        guestKey1: this.guestKey1,
        guestKey2: this.guestKey2
      }
      this.$store.dispatch(GAME_INIT, accounts)
    },

    voting(who) {
      let data = {
        key: this.votingKey,
        value: this.votingValue,
        target: who
      }
      this.$store.dispatch(VOTING, data)
    },

    endGame() {
      this.$store.dispatch(END_GAME, this.endKey)
    },
  },

  watch: {
    '$route' (to) {

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
    height: 750px;
  }
  .network-info {
    background-color: rgba(66, 66, 66, 0.3);
    height: 750px;
  }
  .refresh {
    margin-top: -2px;
  }
  .refresh:hover {
    color: #83AFA5;
  }
  .passwordInput {
    width:500px;
  }
  .hosting {
    color:white;
    font-style: normal;
    font-weight: bold;
    font-size: 33px;
  }
  .generateTxKey {
    margin-left:15px;
    margin-bottom:20px;
    width:350px;
  }
  .guestKey {
    margin-left:15px;
    margin-bottom:20px;
    width:300px;
  }
  .voteKey {
    margin-left:15px;
    margin-bottom:20px;
    width:300px;
  }
</style>

<!--purity surge leader drill apple theme love cigar taste foam hold crouch-->
