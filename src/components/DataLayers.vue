<template>
  <v-container fluid fill-height pa-0>
    <div id="map">
    </div>
    <canvas id="deck-canvas"></canvas>
  </v-container>
</template>
<script src="./data-layers.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import 'mapbox-gl/dist/mapbox-gl.css';

#deck-gl, #map{
  position: relative;
  height: 100%;
  width:  100%;
}

.mapboxgl-ctrl-top-right {
  z-index: 10;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}

.mapboxgl-popup {
  z-index: 10;
}

</style>
