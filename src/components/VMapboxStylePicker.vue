<template>
  <div>
    <div
      :id="id"
      :ref="id"
      class="mapboxgl-ctrl mapboxgl-ctrl-bottom-right mapboxgl-ctrl-group mapbox-style-picker"
      :class="rightDrawer ? 'satellite-open' : 'satellite-closed'"
    >
      <v-btn class="satellite-btn" text v-on:click.native="switchSatellite()">
        <img v-if="satelliteSwitch === 0" src="@/static/images/satellite.png" />
        <img v-if="satelliteSwitch === 1" src="@/static/images/light.png" />
      </v-btn>
    </div>
    <div
      class="mapboxgl-ctrl mapboxgl-ctrl-bottom-right"
      v-if="satelliteSwitch === 1"
      id="satellite-date"
    >
      Datum satelliet: 01-06-2019 tot 15-07-2019
    </div>
  </div>
</template>

<script>
// import moment and event bus
import moment from 'moment'
import { bus } from '@/event-bus.js'

export default {
  name: 'v-mapbox-style-picker',
  props: {
    rightDrawer: {
      type: Boolean
    }
  },
  data () {
    return {
      id: this._uid,
      satelliteSwitch: 0
    }
  },
  inject: ['getMap'],
  mounted () {
    this.map = this.getMap()
    this.map.on('load', () => {
      this.deferredMountedTo()
    })
    // check optional props
    this.mapstyles = this.mapboxstyles || this.mapstyles
    this.mapstyle = this.mapboxstyle || this.mapstyle
  },
  methods: {
    deferredMountedTo () {
      // initialize control
      this.map.addControl(this, 'bottom-right')

      // creating the variable
      var year = 2016

      // moment and eventbus connection
      bus.$on('slider-update', (date) => {
        const endtime = date.enddate
        const enddate = moment([endtime], 'MM-YYYY').format('YYYY')
        if (enddate <= year) {
          year = 2016
        } else {
          year = enddate
        }
      })

      // sourcedata eventlistener
      this.map.on('sourcedata', (e) => {
        const source = e.source.tiles
        console.log('this is the source')
        console.log(source)
      })

      // Add additional background layer
      this.map.addLayer(
        {
          id: 'satellite',
          type: 'raster',
          source: {
            type: 'raster',
            tiles: [
              `https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/${year}_ortho25/EPSG:3857/{z}/{x}/{y}.jpeg`
            ],
            tileSize: 256
          },
          paint: {
            'raster-opacity': 0
          }
        },
        'country-label-lg'
      )
      console.log('url-year')
      console.log(year)
    },
    onAdd (map) {
      // return containing div
      return this.$refs[this.id]
    },
    onRemove () {
      return null
    },
    switchSatellite () {
      if (this.satelliteSwitch === 1) {
        this.satelliteSwitch = 0
      } else {
        this.satelliteSwitch = 1
      }
      this.map.setPaintProperty(
        'satellite',
        'raster-opacity',
        this.satelliteSwitch
      )
    }
  }
}
</script>

<style scoped>
.mapbox-style-picker,
.satellite-btn {
  height: 60px !important;
  width: 60px !important;
  padding: 0 !important;
}

span.v-btn__content {
  height: 100% !important;
  width: 100%;
  border-radius: 4px !important;
}

.mapboxgl-ctrl-bottom-right {
  bottom: 30px;
}

.satellite-closed {
  right: 10px;
}

.satellite-open {
  right: 460px;
}

#satellite-date {
  right: 80px;
  margin: 10px;
}

img {
  height: 60px;
  width: 60px;
  border-radius: 4px !important;
}
</style>
