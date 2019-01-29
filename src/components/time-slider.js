import {
  bus
} from '@/event-bus.js';
import $ from 'jquery';
import _ from 'lodash';
import Vue from 'vue';
import moment from 'moment';
import ionRangeslider from 'ion-rangeslider/js/ion.rangeSlider.js';
import 'font-awesome/css/font-awesome.css';

const DAY_FORMAT = 'Y-MM-DD'

export default {
  name: "time-slider",
  props: {
    showPlay: {
      type: Boolean,
      default: true
    },
    layers: {
      type: Array,
      default: true
    },
  },
  data() {
    return {
      sliders: [],
      extent: [],
      beginval: 1965,
      slider: null
    };
  },
  watch: {
    layers: {
      handler: function(layers) {
        this.layers = layers
        // TODO: make this more generic, if entire layers are loaded, initiate timeslider
        if (this.layers.length === 6) {
          this.generateTimeslider()
        }
      },
      deep: true
    }
  },
  methods: {
    generateTimeslider() {
      var form = "MM-YYYY"
      var sliderlayers = this.layers.filter(layer => layer.timeslider)
      _.each(sliderlayers, (slider) => {
        var begindate = moment(slider.timeslider.begindate, form)
        var enddate = moment(slider.timeslider.enddate, form)
        if (this.extent.length === 0) {
          this.extent = [begindate, enddate]
        }
        if (this.extent[0] > begindate){
          this.extent[0] = begindate
        }
        if (this.extent[1] < enddate){
          this.extent[1] = enddate
        }
      })
      var input = this.$el.querySelector("input.slider");
      $(input).ionRangeSlider({
        type: "double",
        drag_interval: true,
        min: this.extent[0].format("x"),
        max: this.extent[1].format("x"),
        to_min: this.extent[0].format("x"),
        to_max: this.extent[1].format("x"),
        from_min: this.extent[0].format("x"),
        from_max: this.extent[1].format("x"),
        force_edges: true,
        grid: false,
        step: 1,
        prettify: function (num) {
          return moment(num, "x").format(form);
        },
        onChange: (val) => {
          bus.$emit('slider-update', {
            begindate: val.from_pretty,
            enddate: val.to_pretty
          })
        },
        onFinish: (val) => {
          bus.$emit('slider-update', {
            begindate: val.from_pretty,
            enddate: val.to_pretty
          })
        }
      })
    }
  }
}
