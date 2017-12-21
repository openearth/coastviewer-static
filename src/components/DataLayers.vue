<template>
  <v-container fluid fill-height pa-0>
    <v-mapbox
      access-token="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA"
      map-style="mapbox://styles/mapbox/satellite-streets-v10"
      :center="[4, 52]"
      :zoom="10"
      :pitch="20"
      :bearing="-0"
      :min-zoom="5"
      ref="map"
      class="xs12"
      id="map"
      >
      <v-mapbox-navigation-control></v-mapbox-navigation-control>
    </v-mapbox>
    <canvas id="deck" width="300" height="300"></canvas>
  </v-container>
</template>
<script src="./v-data-layers.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #map {
    height: 100%;
    width:  100%;
  }
  #deck {
  display:none;
  width: 100px;
  height: 100px
  }

</style>
