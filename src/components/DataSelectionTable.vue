<template>
  <div class=".table-selection">
    <v-data-table :headers="tableHeaders" :items="tableItems" hide-headers hide-actions>
      <template slot="items" slot-scope="props">
        <td>
          <v-btn small v-on:click="buttonPressed(props.item.elemNumber)">Select</v-btn>
        </td>
        <td >{{ props.item.type }}</td>
        <td >{{ props.item.beginYear }}</td>
        <td >{{ props.item.endYear }}</td>
      </template>
    </v-data-table>
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
