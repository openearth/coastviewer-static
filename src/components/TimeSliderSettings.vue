<template>
  <v-dialog
    v-model="showModal"
    transition="dialog-top-transition"
    max-width="500px"
    >
    <v-card>
      <v-card-text>
        Selectie begin en eind datum van gehele tijdsbalk
        <v-layout row wrap>
          <v-flex xs11 sm5>
            <v-menu
              ref="startDateMenu"
              v-model="startDateMenu"
              :close-on-content-click="true"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
              @click="$refs.startDatePicker.activePicker = 'YEAR'"

            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="startDate"
                  label="Begin datum"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="startDatePicker"
                v-model="startDate"
                min="1950"
                :max="endDate"
                @change="startDate = $event"
                no-title
                reactive
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs11 sm5>
            <v-menu
              ref="endDateMenu"
              v-model="endDateMenu"
              :close-on-content-click="true"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="endDate"
                  label="Eind datum"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                  @click="$refs.endDatePicker.activePicker = 'YEAR'"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="endDatePicker"
                v-model="endDate"
                :min="startDate"
                max="2019"
                @change="endDate = $event"
                no-title
                reactive
              ></v-date-picker>
            </v-menu>
          </v-flex>
        </v-layout>

        Selectie begin en eind datum van lagen selectie
        <v-layout row wrap>
          <v-flex xs11 sm5>
            <v-menu
              v-model="startRangeMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="startRange"
                  label="Begin datum"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="startRange"
                type="month"
                :min="startDate"
                :max="endRange"
                @change="startRange = $event"
                no-title
                reactive
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs11 sm5>
            <v-menu
              v-model="endRangeMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="endRange"
                  label="Eind datum"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="endRange"
                type="month"
                :min="startRange"
                :max="endDate"
                @change="endRange = $event"
                no-title
                reactive
              ></v-date-picker>
            </v-menu>
          </v-flex>
        </v-layout>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="showModal = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    showSettings: {
      type: Boolean
    },
    extent: {
      type: Array
    },
    range: {
      type: Array
    }
  },
  data () {
    return {
      startDateMenu: false,
      endDateMenu: false,
      startRangeMenu: false,
      endRangeMenu: false,
      fixed: false,
    }
  },
  computed: {
    showModal: {
      get() {
        return this.showSettings
      },
      set(val) {
        this.$emit("update:showSettings", false)
      }
    },
    startDate: {
      get() {
        return moment(this.extent[0]).format("YYYY")
      },
      set(val) {
        this.$emit('set-extent', [val.split('-')[0], moment(this.extent[1])])
        this.$refs.startDatePicker.activePicker = 'YEAR'
      }
    },
    endDate: {
      get() {
        return moment(this.extent[1]).format("YYYY")
      },
      set(val) {
        this.$emit('set-extent', [moment(this.extent[0]), val.split('-')[0]])
        this.$refs.endDatePicker.activePicker = 'YEAR'
      }
    },
    startRange: {
      get() {
        return moment(this.range[0]).format("YYYY-MM")
      },
      set(val) {
        this.$emit('set-range', [val, moment(this.range[1])])
      }
    },
    endRange: {
      get() {
        return moment(this.range[1]).format("YYYY-MM")
      },
      set(val) {
        this.$emit('set-range', [moment(this.range[0]), val])
      }
    }
  },
  methods: {
  }
}
</script>
