<template>
  <div class="table">
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left" v-for="header in tableHeaders" :key="header.text">
              {{ header.text }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in tableItems"
            :key="item.name"
          >
            <td>
              <v-btn small v-on:click="buttonPressed(item.elemNumber)">Select</v-btn>
            </td>
            <td class="text-xs-left">{{ item.type }}</td>
            <td class="text-xs-left">{{ item.beginYear }}</td>
            <td class="text-xs-left">{{ item.endYear }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import {
  bus
} from '@/event-bus.js'

export default {
  name: 'DataSelectionTable',
  props: {
    tableHeaders: {
      required: true,
      type: Array
    },
    tableItems: {
      required: true,
      type: Array
    }
  },
  methods: {
    buttonPressed (num) {
      bus.$emit('nourishmentRowSelected', num)
    }
  }
}
</script>

<style>
.table-selection {
  min-width: 300px;
  width: 100%;
}

</style>
