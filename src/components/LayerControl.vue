<template>
  <div class="layer-control">
    <draggable class="draggable" v-model="computedList" @start="drag=true" @end="drag=false">
      <v-list dense pt-0 v-for="layer in layers" :key="layer.id">
          <v-list-tile >
            <v-list-tile-action>
              <v-switch  v-model="layer.active"></v-switch>
            </v-list-tile-action>
            <v-list-tile-title>{{layer.name}}</v-list-tile-title>
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
</style>
