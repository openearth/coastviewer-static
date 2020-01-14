<template>
  <div class="table">
    <v-data-table :headers="tableHeaders" :items="tableItems" hide-actions hide-headers>
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.value }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: {
    tableHeaders: {
      required: true,
      type: Array
    },
    tableItems: {
      required: true,
      type: Array
    }
  }
}
</script>

<style>
.table {
  width: 300px;
}

</style>
