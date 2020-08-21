<template>
  <div>
    <div :id="id" :ref="id" class="mapboxgl-ctrl mapboxgl-ctrl-bottom-right mapboxgl-ctrl-group mapbox-style-picker">
      <v-btn id="satelliteBtn" v-on:click.native="switchSatellite()">
        <img v-if="satelliteSwitch === 0" src="static/images/satellite.png" height="30">
        <img v-if="satelliteSwitch === 1" src="static/images/light.png" height="30">
      </v-btn>
    </div>
    <div class="mapboxgl-ctrl mapboxgl-ctrl-bottom-right" v-if="satelliteSwitch === 1" id="satellite-date">
      Datum satelliet: 01-06-2019 tot 15-07-2019
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-mapbox-style-picker',
  data () {
    return {
      id: this._uid,
      satelliteSwitch: 0
    }
  },
  inject:  ['getMap'],
  mounted () {
    this.map = this.getMap()
    this.map.on('load', () => {
      this.deferredMountedTo ()

    })
      // check optional props
    this.mapstyles = this.mapboxstyles || this.mapstyles
    this.mapstyle = this.mapboxstyle || this.mapstyle
  },
  methods: {
    deferredMountedTo () {
      // initialize control
      this.map.addControl(this, 'bottom-right')

      // Add additional background layer
      this.map.addLayer({
        id: 'satellite',
        type: 'raster',
        source: {
          type: 'raster',
          tiles: ["https://portal.geoserve.nl/tiles/NSO_mosaics/tileserver/20190601_20190715_SV_50cm_RD_8bit_RGB_Mosaic/{z}/{x}/{y}"],
          'tileSize': 256
        },
        paint: {
          'raster-opacity': 0
        }
      }, 'country-label-lg')


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
      this.map.setPaintProperty('satellite', 'raster-opacity', this.satelliteSwitch)
    }
  }
}
</script>

<style scoped>
.mapbox-style-picker, #satelliteBtn {
  margin: 0px;
  height: 60px !important;
  width: 60px !important;
}

.mapboxgl-ctrl-bottom-right {
  bottom: 20px;
}

.mapbox-style-picker {
  margin: 10px;
}

#satellite-date {
  right: 80px;
  margin: 10px;
}

img {
  height: 80px;
}
</style>
