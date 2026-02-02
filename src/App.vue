<template>
  <v-app>
    <legal-dialog :showLegalDialog="showLegalDialog" @closeDialog="showLegalDialog = false"/>
    <v-app-bar id="main-toolbar" height="64px" fixed prominent app dense>
      <v-toolbar-title>Coastviewer</v-toolbar-title>
      <v-spacer></v-spacer>
      <time-slider
        ref="timeslider"
        :show-play="false"
        :extent="extent"
        @set-extent="updateExtent($event)"
        @set-range="updateRange($event)"
      ></time-slider>
      <v-tooltip bottom max-width="200px">
        <template v-slot:activator="{ on }">
          <v-btn class="ma-auto" v-on="on" icon @click.stop="showSettings = !showSettings">
            <v-icon>access_time</v-icon>
          </v-btn>
        </template>
        <span>Verander tijdsselectie</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <div class="logos v-app-bar__items hidden-sm-and-down">
        <img class="logo-deltares" src="@/static/images/deltares_new.svg" />
      </div>
      <div class="logos v-app-bar__items hidden-sm-and-down">
        <img class="logo-rws" src="@/static/images/Rijkswaterstaat.svg" />
      </div>
      <v-tooltip bottom max-width="200px">
        <template v-slot:activator="{ on }">
          <v-btn class="ma-auto" v-on="on" icon @click.stop="showLegalDialog = true">
            <v-icon>info</v-icon>
          </v-btn>
        </template>
        <span>Brengt de disclaimer met informatie terug in beeld.</span
        >
      </v-tooltip>
      <v-tooltip bottom max-width="200px">
        <template v-slot:activator="{ on }">
          <v-btn
            class="ma-auto"
            v-on="on"
            icon
            :href="snapShot()"
            target="blank"
            download="coastviewer.png"
          >
            <v-icon>save</v-icon>
          </v-btn>
        </template>
        <span
          >Maak een snapshot van het huidige beeld en sla deze op naar
          png.</span
        >
      </v-tooltip>
      <v-tooltip bottom max-width="200px">
        <template v-slot:activator="{ on }">
          <v-btn class="ma-auto" v-on="on" icon @click.stop="showDistance = !showDistance">
            <v-icon>linear_scale</v-icon>
          </v-btn>
        </template>
        <span
          >Afstand meten - Klik op deze knop om afstand te meten. Hierna kunt u
          op de kaart klikken en een zwart puntje zal verschijnen, klik nog een
          keer elders op de kaart en een lijn zal ontstaan. U kunt zoveel punten
          toevoegen als u wil. Wanneer u nog een keer op een punt klikt wordt
          deze verwijdert. Onderaan het scherm ziet u de totale afstand van deze
          lijn. Klik nog een keer op deze knop om uit de meet modus te
          gaan.</span
        >
      </v-tooltip>
      <v-tooltip bottom max-width="200px">
        <template v-slot:activator="{ on }">
          <v-btn class="ma-auto" v-on="on" icon @click.stop="showLegend = !showLegend">
            <v-icon>format_list_bulleted</v-icon>
          </v-btn>
        </template>
        <span
          >Legenda - Zet the legenda aan of uit. De legenda verschijnt alleen
          als ook kaartlagen met een legenda aanstaan.
        </span>
      </v-tooltip>
      <v-tooltip bottom max-width="200px">
        <template v-slot:activator="{ on }">
          <v-btn class="ma-auto" v-on="on" icon @click.stop="rightDrawer = !rightDrawer">
            <v-icon>layers</v-icon>
          </v-btn>
        </template>
        <span>Kaartlagen - Klap het menu met de kaartlagen in of uit.</span>
      </v-tooltip>
    </v-app-bar>
    <v-main>
      <map-component
        :showLegend="showLegend"
        :showDistance="showDistance"
        :satelliteLayerName="satelliteLayerName"
        :rightDrawer="rightDrawer"
      ></map-component>
      <time-slider-settings
        :showSettings="showSettings"
        :extent="extent"
        @set-extent="updateExtent($event)"
        @update:showSettings="showSettings = $event"
      ></time-slider-settings>
      <v-tooltip left max-width="250px" :value="showJarkusTooltip" :open-on-hover="false" class="jarkus-tooltip-left">
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on" class="jarkus-tooltip-activator"></div>
        </template>
        <span>Klik om het transect te bekijken</span>
      </v-tooltip>
    </v-main>
    <v-navigation-drawer
      hide-overlay
      id="drawer"
      v-model="rightDrawer"
      right
      fixed
      floating
      width="450"
    >
      <layer-control></layer-control>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import Vue from 'vue'
import { bus } from '@/event-bus.js'
import 'material-design-icons/iconfont/material-icons.css'
import LayerControl from '@/components/LayerControl'
import TimeSlider from '@/components/TimeSlider'
import MapComponent from '@/components/MapComponent'
import TimeSliderSettings from '@/components/TimeSliderSettings'
import moment from 'moment'
import LegalDialog from '@/components/LegalDialog.vue'
import { mapGetters, mapState } from 'vuex'

export default {
  data () {
    return {
      extent: [moment('1965').startOf('year'), moment().subtract(1, 'month').endOf('month')],
      map: null,
      deckgl: null,
      startDate: null,
      endDate: null,
      startDateMenu: false,
      endDateMenu: false,
      showDistance: false,
      drawer: false,
      fixed: false,
      showSettings: false,
      showLegend: true,
      showLegalDialog: false,
      items: [
        {
          icon: 'bubble_chart',
          title: 'Inspire'
        }
      ],
      rightDrawer: true,
      hoveringJarkus2D: false,
      hoveringJarkus3D: false
    }
  },
  computed: {
    ...mapGetters(['satelliteLayerName']),
    ...mapState(['layers']),
    showJarkusTooltip () {
      const jarkus2D = this.layers.find(l => l.name === 'Jarkus raaien 2D')
      const jarkus3D = this.layers.find(l => l.name === 'Jarkus raaien 3D')
      const isActive = (jarkus2D && jarkus2D.active) || (jarkus3D && jarkus3D.active)
      const isHovering = this.hoveringJarkus2D || this.hoveringJarkus3D
      return isActive || isHovering
    }
  },
  created () {
    this.retrieveData()
  },
  mounted () {
    bus.$on('map-loaded', map => {
      Vue.set(this, 'map', map)
    })
    bus.$on('jarkus-hover', ({ layer, isHovering }) => {
      if (layer === '2D') {
        this.hoveringJarkus2D = isHovering
      } else if (layer === '3D') {
        this.hoveringJarkus3D = isHovering
      }
    })
  },
  components: {
    LayerControl,
    TimeSlider,
    MapComponent,
    TimeSliderSettings,
    LegalDialog
  },
  methods: {
    snapShot () {
      if (this.map) {
        return this.map.getCanvas().toDataURL('image/png')
      }
    },
    // snapShot() {
    //   const url = this.map.getCanvas().toDataURL("image/png")
    //   window.location.href = url.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    // },
    updateExtent (extent) {
      this.extent = extent
    },
    retrieveData () {
      // Function to add all layers made in the datalayers.json to the map
      // Layers can be individual layers or a list containing different Layers
      // a type indentifies as a single layer or a "group".
      fetch('./data/datalayers.json')
        .then(resp => {
          return resp.json()
        })
        .then(json => {
          const layers = json
          this.$store.commit('setLayers', layers)
          var form = 'MM-YYYY'
          var sliderlayers = layers.filter(layer => layer.timeslider)
          sliderlayers.forEach(slider => {
            var begindate = moment(slider.timeslider.begindate, form)
            var enddate = moment(slider.timeslider.enddate, form)

            if (this.extent.length === 0) {
              this.extent = [begindate, enddate]
            }
            if (this.extent[0] > begindate) {
              this.extent[0] = begindate
            }
            if (this.extent[1] < enddate) {
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

.timeslider {
  max-height: 100%;
}

#main-toolbar {
  z-index: 3;
}

#drawer {
  top: 64px;
  z-index: 2;
  max-height: 100%;
  padding-top: 64px;
}

.jarkus-tooltip-left {
  position: fixed;
  top: 100px;
  right: 470px;
  z-index: 1000;
}

.jarkus-tooltip-activator {
  position: fixed;
  top: 100px;
  right: 470px;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.logos {
  position: relative;
  overflow: hidden;
  display: flex;
  height: 100% !important;
  max-height: 100%;
  align-items: center;
}

.logo-deltares {
  position: relative;
  overflow: hidden;
  display: inline-block;
  height: 70% !important;
  max-height: 100%;
  align-items: center;
}

.logo-rws {
  position: relative;
  display: inline-block;
  overflow: hidden;
  height: 100% !important;
  max-height: 100%;
}
</style>
