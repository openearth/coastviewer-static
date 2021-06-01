<template>
  <v-dialog
    scrollable
    persistent
    v-model="showDialog"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    :max-width="640"
  >
    <v-card class="d-flex flex-column" style="max-height: 100%;overflow:hidden">
      <v-card-title class="pa-5">
        <v-toolbar-title>Coastviewer gebruikers overeenkomsten</v-toolbar-title>
      </v-card-title>

      <div class="px-5 flex-grow-1 overflow-y-auto" v-html="content" />

      <v-card-actions>
          <form action="" submit.prevent style="width:100%" >
            <div class="d-flex pa-2" >
              <v-btn
                color="primary"
                @click="onStartClick"
                class="ml-auto"
              >
                Ik accepteer de voorwaarden.
              </v-btn>
           </div>
          </form>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import content from '@/static/content/legal.md'
import * as Cookies from 'tiny-cookie'

export default {
  props: {
    showLegalDialog: {
      type: Boolean
    }
  },
  watch: {
    showLegalDialog (val) {
      if (val === true) {
        this.showDialog = true
      }
    }
  },
  data () {
    const accepted = Cookies.get('accepted')
    // if not set yet, return true
    if (accepted === null) {
      this.setAcceptedLegal(false)
    }
    if (accepted === 'true') {
      this.setAcceptedLegal(true)
    }
    return {
      content,
      showDialog: true
    }
  },
  mounted () {
    this.showDialog = !this.acceptedLegal
  },
  computed: {
    ...mapState({
      acceptedLegal: state => state.acceptedLegal
    })
  },
  methods: {
    ...mapMutations(['setAcceptedLegal']),
    onStartClick () {
      this.setAcceptedLegal(true)
      Cookies.set('accepted', true)
      this.showDialog = !this.acceptedLegal
      this.$emit('closeDialog')
    }
  }
}
</script>
