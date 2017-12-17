<template>
  <v-container fluid fill-height pa-0 class="compare">
    <v-mapbox
      access-token="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA"
      map-style="mapbox://styles/mapbox/satellite-streets-v10"
      :center="[4, 52]"
      :zoom="10"
      :pitch="60"
      :bearing="-0"
      :min-zoom="5"
      ref="map1"
      class="xs12 compare-map"
      id="map1"
      >
    </v-mapbox>
    <v-mapbox
      access-token="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA"
      map-style="mapbox://styles/mapbox/dark-v9"
      :center="[4, 52]"
      :zoom="10"
      :pitch="60"
      :bearing="-0"
      :min-zoom="5"
      ref="map2"
      class="xs12 compare-map"
      id="map2"
      >
    </v-mapbox>
    <!-- <canvas id="deck" width="300" height="300"></canvas> -->
  </v-container>
</template>
<script src="./map-compare.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
  .compare .compare-map {
    width: 100%;
    top: 0;
    bottom: 0;
    position: absolute;
    height: 100%;
  }
  /* hide double attribute */
  #map2 .mapboxgl-ctrl.mapboxgl-ctrl-attrib {
    display: none;

  }
</style>
