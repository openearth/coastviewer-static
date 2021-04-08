<template>
  <v-app-bar
    color="rgba(255, 0, 0, 0)"
    flat
    floating
    role="slider"
    id="time-slider"
  >
    <div class="time-slider-wrapper">
      <input type="text" class="slider" name="slider" value="" />
    </div>
  </v-app-bar>
</template>

<script>
import { bus } from '@/event-bus.js'
// import Vue from 'vue'
import moment from 'moment'
import $ from 'jquery'
// eslint-disable-next-line
import ionRangeslider from 'ion-rangeslider/js/ion.rangeSlider.js'
// import 'font-awesome/css/font-awesome.css'

// const DAY_FORMAT = 'Y-MM-DD'

export default {
  name: 'time-slider',
  props: {
    showPlay: {
      type: Boolean,
      default: true
    },
    extent: {
      type: Array
    }
  },
  data () {
    return {
      sliders: [],
      slider: null,
      // TODO: this range should be a global variable coming from App. Now duplicate
      // of range in timeslidersettings..
      range: [
        moment()
          .subtract(10, 'years')
          .startOf('year'),
        moment().startOf('year').add(1, 'year')
      ]
    }
  },
  mounted () {
    this.generateTimeslider()
    bus.$emit('slider-update', {
      begindate: this.range[0],
      enddate: this.range[1]
    })
    bus.$on('set-range', range => {
      this.range = range
      this.updateRangeSlider()
    })

    bus.$on('jarkus-loaded', () => {
      console.log('jarkus-loaded')
      bus.$emit('slider-update', {
        begindate: this.range[0],
        enddate: this.range[1]
      })
    })
  },
  watch: {
    extent: {
      handler: function (val, oldVal) {
        this.updateExtentSlider()
      }
    }
  },
  methods: {
    generateTimeslider () {
      var form = 'MM-YYYY'
      var input = this.$el.querySelector('input.slider')
      $(input).ionRangeSlider({
        type: 'double',
        drag_interval: true,
        force_edges: true,
        grid: false,
        step: 1,
        skin: 'round',
        from: moment(this.range[0]).format('x'),
        to: moment(this.range[1]).format('x'),
        min: moment(this.extent[0]).format('x'),
        max: moment(this.extent[1]).format('x'),
        prettify: function (num) {
          return moment(num, 'x').format(form)
        },
        onChange: val => {
          bus.$emit('slider-update', {
            begindate: val.from_pretty,
            enddate: val.to_pretty
          })
        },
        onFinish: val => {
          bus.$emit('slider-end', {
            begindate: val.from_pretty,
            enddate: val.to_pretty
          })
          bus.$emit('slider-update', {
            begindate: val.from_pretty,
            enddate: val.to_pretty
          })
        }
      })

      bus.$emit('slider-created', {
        begindate: this.range[0],
        enddate: this.range[1]
      })
      this.slider = $(input).data('ionRangeSlider')
    },
    updateRangeSlider () {
      this.slider.update({
        type: 'double',
        drag_interval: true,
        from: moment(this.range[0]).format('x'),
        to: moment(this.range[1]).format('x')
      })
    },
    updateExtentSlider () {
      this.slider.update({
        type: 'double',
        drag_interval: true,
        min: moment(this.extent[0]).format('x'),
        max: moment(this.extent[1]).format('x'),
        to_min: moment(this.extent[0]).format('x'),
        to_max: moment(this.extent[1]).format('x'),
        from_min: moment(this.extent[0]).format('x'),
        from_max: moment(this.extent[1]).format('x')
      })
      bus.$emit('slider-update', {
        begindate: this.slider.result.from_pretty,
        enddate: this.slider.result.to_pretty
      })
    }
  }
}
</script>

<style>
/* @import 'ion-rangeslider/css/ion.rangeSlider.css'; */

#time-slider {
  position: relative;
  z-index: 10;
  margin: auto;
  flex: 0;
  padding-top: 10px;
}
.slider {
  width: 500px;
}
.time-slider-wrapper {
  width: 500px;
  padding-right: 20px;
}

[disabled] > .svg-inline--fa,
[disabled] > .fas {
  color: lightgrey;
  opacity: 0.5;
}
.irs-line-left,
.irs-line-mid,
.irs-line-right {
  height: 2px;
}

.irs-line {
  height: 2px;
  background: rgba(0, 0, 0, 0.26);
  border: none;
  border-color: none;
  border-image: none;
  border-style: none;
}
.irs-bar {
  height: 2px;
  background: #1976d2;
}
.irs-slider {
  border-radius: 50%;
  background: #1976d2;
  width: 16px;
  height: 16px;
  box-shadow: none;
  border: none;
}

.irs-slider:hover {
  transform: scale(1.2);
  background: #1976d2;
}
.irs-slider.state_hover {
  transform: scale(1.2);
  background: #1976d2;
}
</style>
