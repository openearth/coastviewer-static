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
      Datum satelliet: 01-06-2016 tot 10-11-2021
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-mapbox-style-picker',
  props: {
    rightDrawer: {
      type: Boolean
    },
    baseLayer: {
      type: Object
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

      // Add additional background layer
      this.map.addLayer(this.baseLayer)
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
