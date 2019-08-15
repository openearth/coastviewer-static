<template>
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
</template>

<script>
export default {
  data () {
    return {
      startDate: null,
      endDate: null,
      startDateMenu: false,
      endDateMenu: false,
      fixed: false,
      showSettings: false
    }
  }
}
</script>
