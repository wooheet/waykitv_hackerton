<template>
    <v-toolbar absolute fixed app bottom flat height="70px">
      <v-container class="py-0" style="max-width: 1440px; margin:auto;">
        <v-layout row align-center>
          <v-flex md2 xs1 class="hidden-sm-and-down logo mt-3">
            <img :src="require(`@/assets/logo.svg`)" alt="logo" @click="goHome" style="cursor: pointer;">
          </v-flex>
          <v-flex md2 xs1 class="hidden-md-and-up logo mr-3 mt-3">
            <img :src="require(`@/assets/logo_single.svg`)" alt="logo_single" @click="goHome" style="cursor: pointer;">
          </v-flex>
          <v-flex xs5 class="hidden-sm-and-down mt-2">
            <span class="menu mr-5" @click="goBlocks">
              BLOCKS
            </span>
            <span class="menu mr-5" @click="goTransactions">
              TRANSACTIONS
            </span>
            <span class="menu" @click="goDocs">
              DOCS
            </span>
          </v-flex>
          <v-flex >
            <div class="network mt-3 mr-2" v-if="networkHealthy === true">
              <span class="healthy mr-2">
                ●
              </span>
              <span class="white--text hidden-sm-and-down">
                Network health
              </span>
            </div>
            <div class="network mt-3 mr-2" v-else>
              <span class="notHealthy mr-2">
                ●
              </span>
              <span class="white--text hidden-sm-and-down">
                Network health
              </span>
            </div>
          </v-flex>
          <v-flex>
            <v-form @submit.prevent="submit" style="float:right">
              <v-text-field
                dark
                v-model="hash"
                @input="text"
                counter="130"
                hide-details
                placeholder="Block # or Hash / TX Hash / Account "
                append-icon="search"
                @click:append="submit"
              ></v-text-field>
            </v-form>
          </v-flex>
          <v-menu xs2 class="hidden-md-and-up">
            <v-toolbar-side-icon slot="activator" style="float: right; color: white"></v-toolbar-side-icon>
              <v-list class="pt-0"
                      two-line subheader
              >
                <v-divider></v-divider>
                <v-list-tile class="pt-3"
                             v-for="item in items"
                             :key="item.title"
                             @click="goTo(item.path)"
                             link>
                  <v-list-tile-avatar>
                    <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
          </v-menu>
        </v-layout>
      </v-container>
    </v-toolbar>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import {
  TOGGLE_DRAWER,
  SET_NOTFOUND_HASH,
  SET_NOTFOUND_PATH
} from '../../store/mutation-types'
import {
  SEARCH_INPUT_HASH,
  SEARCH,
  NETWORK_HEALTH_CHECK
} from '../../store/action-types'

export default {
  computed: {
    ...mapState([
      'searchHash', 'searchPath', 'networkHealthy'
    ]),

    ...mapGetters([
      'linkBase'
    ])
  },

  data () {
    return {
      hash: '',
      items: [
        { title: 'Blocks', icon: 'question_answer', path: '/yggdrash/blocks' },
        { title: 'Transactions', icon: 'question_answer', path: '/yggdrash/txs' }
      ]
    }
  },

  methods: {
    goTo (path) {
      this.$router.push(path)
      this.$store.commit(TOGGLE_DRAWER)
    },
    goHome () {
      this.$router.push('/')
    },
    goBlocks () {
      this.$router.push('/yggdrash/blocks')
    },
    goTransactions () {
      this.$router.push('/yggdrash/txs')
    },
    goDocs () {
      window.open('https://developers.yggdrash.io/ko/guide/test-net.html', '_blank')
    },
    toggleDrawer () {
      this.$store.commit(TOGGLE_DRAWER)
    },
    submit (e) {
      e.preventDefault()
      this.hash = ''
      this.$store.dispatch(SEARCH, this.searchHash).then(() => {
        switch (this.searchPath) {
          case 'yggdrash-account':
            // console.log('go to ' + this.searchPath + ' with ' + this.searchHash);
            this.$router.push(`/yggdrash/account/${this.searchHash}`)
            break
          case 'yggdrash-block':
            // console.log('go to ' + this.searchPath + ' with ' + this.searchHash);
            this.$router.push(`/yggdrash/blocks/${this.searchHash}`)
            break
          case 'yggdrash-tx':
            // console.log('go to ' + this.searchPath + ' with ' + this.searchHash);
            this.$router.push(`/yggdrash/txs/${this.searchHash}`)
            break
          case 'nothing_to_do':
            break
          case 'invalid-format':
            this.$router.push(`/error/${this.searchHash}`)
            this.$store.commit(SET_NOTFOUND_HASH, this.searchHash)
            this.$store.commit(SET_NOTFOUND_PATH, 'format')
            break;
          case 'not_found':
            this.$router.push(`/error/${this.searchHash}`)
            this.$store.commit(SET_NOTFOUND_HASH, this.searchHash)
            this.$store.commit(SET_NOTFOUND_PATH, 'hash')
            break;
          default:
            this.$router.push(`/error/${this.searchHash}`)
            this.$store.commit(SET_NOTFOUND_HASH, this.searchHash)
            this.$store.commit(SET_NOTFOUND_PATH, 'hash')
            break;
        }
      })
    },
    text () {
      this.$store.dispatch(SEARCH_INPUT_HASH, this.hash)
    }

  },
  created () {
    setInterval(()=> {
      this.$store.dispatch(NETWORK_HEALTH_CHECK);
    }, 3000)
  },

  mounted () {
    //TODO: 한번만 실행
    // this.$store.dispatch(NETWORK_HEALTH_CHECK)

  },
}
</script>

<style lang="scss" scoped>
  .logo {
    margin-top: 10px;
  }
  .menu {
    color: #FFFFFF;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    text-transform: uppercase;
    cursor: pointer;
  }

  .menu:hover {
    color: #9EFFE8;
    transform: scaleX( 2.5 ) scaleY( 1.5 );
  }
  .v-toolbar {
    height: 70px;
    background: rgba(0, 15, 14, 0);
  }

  .v-text-field {
    width: 400px;
    border-radius: 7px;
    background-color: transparent;
  }

  .network {
    background-color: rgba(51, 49, 48, 0.35);
    border-radius: 20px;
    padding: 10px;
  }

  @mixin keyframes($animation-name) {
    @-webkit-keyframes #{$animation-name} {
      @content;
    }
    @-moz-keyframes #{$animation-name} {
      @content;
    }
    @-ms-keyframes #{$animation-name} {
      @content;
    }
    @-o-keyframes #{$animation-name} {
      @content;
    }
    @keyframes #{$animation-name} {
      @content;
    }
  }

  @mixin animation($str) {
    -webkit-animation: #{$str};
    -moz-animation: #{$str};
    -ms-animation: #{$str};
    -o-animation: #{$str};
    animation: #{$str};
  }


  @include keyframes(blinker) {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }

  .healthy {
    background-color: transparent;
    color: #10CFA1;
    text-decoration: blink;
    @include animation('blinker 1.5s infinite');
  }

  .notHealthy {
    background-color: transparent;
    color: red;
    text-decoration: blink;
    @include animation('blinker 1.5s infinite');
  }

  @media only screen and (max-width: 600px) {
    .v-text-field {
      width: 250px;
      margin-right: 10px;
    }
  }
</style>
