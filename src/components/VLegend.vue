<template>
  <div id="legend-div">
    <div v-if="layer.barlegend" class="bar-wrapper">
      <div :style="layer.barlegend" class="bar"></div>
      <div class="bartext">{{layer.bartext}} </div>
    </div>
    <div v-if="layer.legendlabels" class="bar-wrapper">
      <v-layout wrap class="color-label">
        <v-layout
          align-center
          v-for="(label, index) in layer.legendlabels"
          :key="index"
        >
          <span
            v-if="layer.legendcolors"
            class="colored-span"
            :style="`background-color: ${layer.legendcolors[index]}`"
          ></span>
          <span
            v-if="layer.legendstripes"
            class="colored-striped-span"
            :style="`background-color: ${layer.legendstripes[index]}`"
          ></span>
          <label class="ma-1">{{ label }}</label>
        </v-layout>
      </v-layout>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VLegend',
  props: {
    layer: {
      type: Object
    }
  }
}
</script>

<style>
#legend-div {
  width: 100%;
}
.bar {
  width: 100%;
  height: 10px;
}

.bar-wrapper {
  display: block;
  width: 100%;
  /* margin-bottom: 10px; */
}
.bartext {
  width: 100%;
  display: inline-block;
  text-align: justify;
  text-align-last: justify
}

.colored-span {
  width: 10px;
  height: 10px;
  border-radius: 5px;
}

.colored-striped-span {
  width: 10px;
  height: 6px;
  padding-top: 2px;
  padding-bottom: 2px;
}
</style>
