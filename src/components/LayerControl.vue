<template>
  <div class="layer-control">
    <v-list dense pt-0>
        <v-list-tile v-for="layer in layers" :key="layer.id">
          <v-list-tile-action>
            <v-switch  v-model="layer.active"></v-switch>
          </v-list-tile-action>
          <v-list-tile-title>{{layer.name}}</v-list-tile-title>
        </v-list-tile>
    </v-list>
  </div>
</template>
<script src="./layer-control.js"></script>
