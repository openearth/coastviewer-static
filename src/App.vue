<template>
  <v-app>
    <v-navigation-drawer
      fixed
      hide-overlay
      v-model="drawer"

      id="drawer"
      >
      <v-list>
        <v-list-tile href="#/">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar height="64px" fixed app dense prominent>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Coastviewer</v-toolbar-title>
      <v-spacer></v-spacer>
      <time-slider v-if="$store.state.layers.length === 6" ref="timeslider" :show-play="false"></time-slider>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="showSettings = !showSettings">
        <v-icon>settings</v-icon>
      </v-btn>

      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>layers</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-data-layers></v-data-layers>
      <v-dialog
        v-model="showSettings"
        transition="dialog-top-transition"
        max-width="500px"
        >
        <v-card>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs11 sm5>
                <v-menu
                  lazy
                  :close-on-content-click="false"
                  v-model="startDateMenu"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                  >
                  <v-text-field
                    slot="activator"
                    label="Start date"
                    v-model="startDate"
                    prepend-icon="event"
                    readonly
                    ></v-text-field>
                  <v-date-picker type="month" v-model="startDate" no-title scrollable actions>
                    <template slot-scope="{ save, cancel }">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                        <v-btn flat color="primary" @click="save">OK</v-btn>
                      </v-card-actions>
                    </template>
                  </v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs11 sm5>
                <v-menu
                  lazy
                  :close-on-content-click="false"
                  v-model="endDateMenu"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                  >
                  <v-text-field
                    slot="activator"
                    label="End date"
                    v-model="endDate"
                    prepend-icon="event"
                    readonly
                    ></v-text-field>
                  <v-date-picker type="month" v-model="endDate" no-title scrollable actions>
                    <template slot-scope="{ save, cancel }">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                        <v-btn flat color="primary" @click="save">OK</v-btn>
                      </v-card-actions>
                    </template>
                  </v-date-picker>
                </v-menu>
              </v-flex>
            </v-layout>

          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon @click.native="showSettings = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-content>
    <v-navigation-drawer
      temporary
      hide-overlay
      id="drawer"
      v-model="rightDrawer"
      right
      fixed
      >
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              Layers
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <layer-control :map="map"></layer-control>
    </v-navigation-drawer>
  </v-app>
</template>

<script src="./app.js">
</script>

<style>
html, doc {
  overflow: hidden;
}

.mapboxgl-map, #deckgl-overlay {
  top: 64px !important;
}

#drawer {
  top: 64px;
  z-index: 1;
}
</style>
