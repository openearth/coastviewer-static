<template>
  <v-toolbar
    color="white"
    floating
    role="slider"
    class="time-slider"
    >
    <div v-for="layer in layers" class="time-slider-wrapper" v-if="layer.timeslider">
      <input  type="text" :class="layer.data[0].id" :name="layer.data[0].id" value="" v-bind="generateSlider(layer.data[0].id)"/>
    </div>
  </v-toolbar>
</template>
<script src="./time-slider.js"></script>
<style src="./time-slider.css"></style>
