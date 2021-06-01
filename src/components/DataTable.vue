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
            <td class="text-xs-left">{{ item.name }}</td>
            <td class="text-xs-left">{{ item.value }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
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
  max-width: 300px;

}

</style>
