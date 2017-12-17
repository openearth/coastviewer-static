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
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Compare</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Coastviewer</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>map</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view></router-view>

    </v-content>
    <v-navigation-drawer
      temporary
      v-model="rightDrawer"
      right
      fixed
      >
      layers
      <v-list>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Layers</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
    <v-dialog
      v-model="timeSelect"
      transition="dialog-bottom-transition"
      :overlay=false
      scrollable
      >
      <v-card>
        <v-card-actions>
          <v-btn icon @click.native="timeSelect = false" dark>
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  import 'material-design-icons/iconfont/material-icons.css';
  export default {
    data () {
      return {
        drawer: false,
        fixed: false,
        timeSelect: false,
        items: [{
          icon: 'bubble_chart',
          title: 'Inspire'
        }],
        rightDrawer: false
      }
    }
  }
</script>
