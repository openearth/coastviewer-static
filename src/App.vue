<template>
  <v-app>
    <v-toolbar id="main-toolbar" fixed prominent app>
      <v-toolbar-title>Coastviewer</v-toolbar-title>
      <v-spacer></v-spacer>
      <time-slider ref="timeslider" :extent="extent" :show-play="false"></time-slider>
      <v-spacer></v-spacer>


      <!-- TODO: Fix timeslider settings -->
      <!-- <v-btn icon @click.stop="showSettings = !showSettings">
        <v-icon>settings</v-icon>
      </v-btn> -->
      <v-btn icon @click.stop="showLegend = !showLegend">
        <v-icon>format_list_bulleted</v-icon>
      </v-btn>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>layers</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <map-component :showLegend="showLegend"></map-component>
      <!-- TODO: Fix timeslider settings -->
      <!-- <time-slider-settings :showSettings="showSettings"></time-slider-settings> -->
    </v-content>
    <v-navigation-drawer
      hide-overlay
      id="drawer"
      v-model="rightDrawer"
      right
      fixed
      floating
      width="450"
      >
      <layer-control :layers="layers"></layer-control>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import Vue from 'vue'
import {bus} from '@/event-bus.js'
import 'material-design-icons/iconfont/material-icons.css'
import LayerControl from './components/LayerControl'
import TimeSlider from './components/TimeSlider'
import MapComponent from './components/MapComponent'
import TimeSliderSettings from './components/TimeSliderSettings'
import moment from 'moment'

export default {
  data () {
    return {
      layers: [],
      extent: [],
      map: null,
      deckgl: null,
      startDate: null,
      endDate: null,
      startDateMenu: false,
      endDateMenu: false,
      drawer: false,
      fixed: false,
      showSettings: false,
      showLegend: true,
      items: [{
        icon: 'bubble_chart',
        title: 'Inspire'
      }],
      rightDrawer: false
    };
  },
  created() {
    this.retrieveData()
  },
  mounted() {
    bus.$on('map-loaded', (map) => {
      Vue.set(this, 'map', map);
    })
  },
  components: {
    LayerControl,
    TimeSlider,
    MapComponent,
    TimeSliderSettings
  },
  methods: {
    retrieveData() {
      // Function to add all layers made in the datalayers.json to the map
      // Layers can be individual layers or a list containing different Layers
      // a type indentifies as a single layer or a "group".
      fetch("./static/data/datalayers.json")
        .then(resp => {
          return resp.json()
        })
        .then(json => {
          const layers = json
          this.$store.commit('setLayers', layers)
          var form = "MM-YYYY"
          var sliderlayers = layers.filter(layer => layer.timeslider)
          sliderlayers.forEach(slider => {
            var begindate = moment(slider.timeslider.begindate, form)
            var enddate = moment(slider.timeslider.enddate, form)

            if (this.extent.length === 0) {
              this.extent = [begindate, enddate]
            }
            if (this.extent[0] > begindate){
              this.extent[0] = begindate
            }
            if (this.extent[1] < enddate){
              this.extent[1] = enddate
            }
        })
      })
    }
  }
}
</script>

<style>
html {
  overflow: hidden;
}

#main-toolbar {
  z-index: 3;
}

#drawer {
  top: 64px;
  z-index: 2;
  max-height: 100%;
}

</style>
