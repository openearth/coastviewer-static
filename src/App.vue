<template>
  <v-app>
    <v-navigation-drawer
      fixed
      v-model="drawer"
      app
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
        <v-list-tile href="#/compare">
          <v-list-tile-action>
            <v-icon>compare</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Compare</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="#/draw">
          <v-list-tile-action>
            <v-icon>edit</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Draw</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app dense>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Coastviewer</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="showSettings = !showSettings">
        <v-icon>settings</v-icon>
      </v-btn>

      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>layers</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
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
      <layer-control :layers="layers" :map="map"></layer-control>
    </v-navigation-drawer>
  </v-app>
</template>
<script src="./app.js"></script>
