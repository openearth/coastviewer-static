import Vue2MapboxGL from 'vue2mapbox-gl';
import Vue from 'vue';
import Compare from 'mapbox-gl-compare';
import 'mapbox-gl-compare/style.css';

Vue.use(Vue2MapboxGL);

export default {
  name: 'MapCompare',
  data () {
    return {
      msg: ''
    };
  },
  mounted() {
    new Compare(this.$refs.map1.map, this.$refs.map2.map, {
      mousemove: false // Optional. Set to true to enable swiping during cursor movement.
    });
  },
  methods: {
  }
};
