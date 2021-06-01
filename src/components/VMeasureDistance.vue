<template lang="html">
  <div class="distance">
      {{distance}}
  </div>
</template>

<script>
import {
  bus
} from '@/event-bus.js'
import length from '@turf/length'
import _ from 'lodash'

export default {
  inject: ['getMap'],
  data () {
    return {
      geojeon: {},
      linestring: {},
      distance: ''
    }
  },
  mounted () {
    this.map = this.getMap()
    this.addLayers()

    bus.$on('clicked-on-map', (props) => {
      var features = this.map.queryRenderedFeatures([props.x, props.y], {
        layers: ['measure-points']
      })
      // Remove the this.linestring from the group
      // So we can redraw it based on the points collection
      if (_.get(this.geojson, 'features.length') > 1) this.geojson.features.pop()

      // If a feature was clicked, remove it from the this.map
      if (features.length) {
        var id = features[0].properties.id
        this.geojson.features = this.geojson.features.filter((point) => {
          return point.properties.id !== id
        })
      } else {
        var point = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [props.coordinate[0], props.coordinate[1]]
          },
          properties: {
            id: String(new Date().getTime())
          }
        }

        this.geojson.features.push(point)
      }

      if (this.geojson.features.length > 1) {
        this.linestring.geometry.coordinates = this.geojson.features.map(point => point.geometry.coordinates)

        this.geojson.features.push(this.linestring)
        this.distance = `Total distance: ${length(this.linestring).toLocaleString()} km`
      }

      this.map.getSource('distance-geojson').setData(this.geojson)
    })
  },
  methods: {
    addLayers () {
      // GeoJSON object to hold our measurement features
      this.geojson = {
        type: 'FeatureCollection',
        features: []
      }

      // Used to draw a line between points
      this.linestring = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      }
      this.map.addSource('distance-geojson', {
        type: 'geojson',
        data: this.geojson
      })

      // Add styles to the map
      this.map.addLayer({
        id: 'measure-points',
        type: 'circle',
        source: 'distance-geojson',
        paint: {
          'circle-radius': 5,
          'circle-color': '#000'
        },
        filter: ['in', '$type', 'Point']
      })
      this.map.addLayer({
        id: 'measure-lines',
        type: 'line',
        source: 'distance-geojson',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': '#000',
          'line-width': 2.5
        },
        filter: ['in', '$type', 'LineString']
      })
    }
  },
  beforeDestroy () {
    this.map.removeLayer('measure-lines')
    this.map.removeLayer('measure-points')
    this.map.removeSource('distance-geojson')
  }

}
</script>

<style lang="css" scoped >

.distance {
  position: absolute;
  bottom: 0;
  z-index: 100;
  width: 100vw;
  text-align-last: center;
}

</style>
