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
      beginval: 1965
    };
  },
  watch: {
    layers: {
      handler: function(layers) {
        this.layers = layers
      },
      deep: true
    }
  },
  methods: {
    generateSlider(sliderId){
      Vue.nextTick(() => {
        var sliderlayer = this.layers.filter(layer => layer.data[0].id === sliderId)
        var form = sliderlayer[0].timeslider.format
        var enddate = moment(sliderlayer[0].timeslider.enddate, form)
        var begindate = moment(sliderlayer[0].timeslider.begindate, form)
        if (this.extent.length === 0) {
          this.extent = [begindate, enddate]
        }
        if (this.extent[0] > begindate) {
          this.extent[0] = begindate
          _.each(this.sliders, (slider) => {
            console.log('slider', slider, this.extent[0].format("x"))
            slider[0].min = this.extent[0].format("x")
          })
        }
        if (this.extent[1] < enddate) {
          this.extent[1] = enddate
          _.each(this.sliders, (slider) => {
            slider[0].max = this.extent[1].format("x")
          })
        }
        var input = this.$el.querySelector("input." + sliderlayer[0].data[0].id);
        this.sliders.push($(input).ionRangeSlider({
          type: sliderlayer[0].timeslider.type,
          drag_interval: true,
          min: this.extent[0].format("x"),
          max: this.extent[1].format("x"),
          to_min: begindate.format("x"),
          to_max: enddate.format("x"),
          from_min: begindate.format("x"),
          from_max: enddate.format("x"),
          force_edges: true,
          grid: false,
          step: 1,
          prettify: function (num) {
            return moment(num, "x").format(form);
          },
          onChange: (val) => {
            if (this.beginval != val.from_pretty & sliderlayer[0].data[0].id === 'jarkus'){
              console.log(this.beginval)
              bus.$emit('slider-update', {
                id: sliderlayer[0].data[0].id,
                begindate: val.from_pretty,
                enddate: val.to_pretty
              })
              this.beginval = val.from_pretty
            }
          },
          onFinish: (val) => {
            if (sliderlayer[0].data[0].id === 'vaklodingen'){
              bus.$emit('slider-update', {
                id: sliderlayer[0].data[0].id,
                begindate: val.from_pretty,
                enddate: val.to_pretty
              })
            }
          },
        }))
      })
    }
  }
}
