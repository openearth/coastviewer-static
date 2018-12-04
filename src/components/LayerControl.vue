<template>
  <div class="layer-control">
    <draggable class="draggable" v-model="computedList" @start="drag=true" @end="drag=false">
      <v-list two-line dense pt-0 v-for="layer in layers" :key="layer.id">
        <v-list-tile>
          <v-list-tile-action>
            <v-switch  v-model="layer.active"></v-switch>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{layer.name}}
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <div v-if="layer.barlegend" class="bar-wrapper">
                <div :style="layer.barlegend" class="bar"></div>
                <div class="bartext">{{layer.bartext}} </div>
              </div>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </draggable>
  </div>
</template>

<script src="./layer-control.js"></script>

<style>
.navigation-drawer .list {
  cursor: move;
}

.list.list--dense:hover {
  background-color: lightgrey;
}

.list__tile__title {
  min-height: fit-content;
}

.bar {
  width: 100%;
  height: 10px;
}

.bar-wrapper {
  display: block;
  width: 100%;
  margin-bottom: 10px;
}
.bartext {
  width: 100%;
  display: inline-block;
  text-align: justify;
  text-align-last: justify
}
</style>
