<template>
  <v-app>
    <v-toolbar height="64px" fixed app dense prominent>
      <v-toolbar-title>Coastviewer</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- TODO: fix this terible terible cheat to load timeslider after all layers are loaded-->
      <time-slider ref="timeslider" :extent="extent" :show-play="false"></time-slider>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="showSettings = !showSettings">
        <v-icon>settings</v-icon>
      </v-btn>

      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>layers</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <data-layers :layers="layers" ></data-layers>
      <time-slider-settings></time-slider-settings>
    </v-content>
    <v-navigation-drawer
      temporary
      hide-overlay
      id="drawer"
      v-model="rightDrawer"
      right
      fixed
      >
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              Layers
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <layer-control :map="map"></layer-control>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import Vue from 'vue'
import {bus} from '@/event-bus.js'
import 'material-design-icons/iconfont/material-icons.css'
import LayerControl from './components/LayerControl'
import TimeSlider from './components/TimeSlider'
import DataLayers from './components/DataLayers'
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
    DataLayers,
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
          this.layers = json
          var form = "MM-YYYY"
          var sliderlayers = this.layers.filter(layer => layer.timeslider)
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
html, doc {
  overflow: hidden;
}
/* .mapboxgl-ctrl-top-right {
    z-index: 1;
} */

#drawer {
  top: 64px;
  z-index: 10;
}
</style>
