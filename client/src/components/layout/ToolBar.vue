<template>
    <v-toolbar absolute fixed app bottom flat height="70px">
      <v-container class="py-0" style="max-width: 1440px; margin:auto;">
        <v-layout row align-center>
          <v-flex md2 xs1 class="mt-4">
            <img :src="require(`@/assets/waykilogo.png`)" alt="logo" @click="goHome" style="cursor: pointer;">
          </v-flex>
          <v-flex xs5 class="hidden-sm-and-down mt-2">
            <v-form @submit.prevent="submit" style="float:right">
              <v-text-field
                dark
                v-model="hash"
                @input="text"
                counter="130"
                hide-details
                placeholder="Account "
                append-icon="search"
                @click:append="submit"
              ></v-text-field>
            </v-form>
          </v-flex>
          <v-flex>
            <span class="menu mr-3 mt-2" style="float: right">
              LOGIN
            </span>
            <span class="menu mr-5 mt-2" style="float: right">
              REGISTER
            </span>
          </v-flex>
        </v-layout>
      </v-container>
    </v-toolbar>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import {
  SET_NOTFOUND_HASH,
  SET_NOTFOUND_PATH
} from '../../store/mutation-types'
import {
  SEARCH_INPUT_HASH,
  SEARCH,
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

  methods: {
    goHome () {
      this.$router.push('/')
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

  }
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

  .v-text-field {
    width:300px;
  }
</style>
