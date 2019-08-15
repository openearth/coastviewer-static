<template>
  <v-toolbar
    color="rgba(255, 0, 0, 0)"
    flat
    floating
    role="slider"
    class="time-slider"
    >
    <div class="time-slider-wrapper">
      <input type="text" class="slider" name="slider" value="" />
    </div>
  </v-toolbar>
</template>


<script>
import {
  bus
} from '@/event-bus.js'
import $ from 'jquery'
import _ from 'lodash'
import Vue from 'vue'
import moment from 'moment'
import ionRangeslider from 'ion-rangeslider/js/ion.rangeSlider.js'
import 'font-awesome/css/font-awesome.css'

const DAY_FORMAT = 'Y-MM-DD'

export default {
  name: "time-slider",
  props: {
    showPlay: {
      type: Boolean,
      default: true
    },

    extent: {
      type: Array,
      default: [moment(2008), moment(2018)]
    }
  },
  data() {
    return {
      sliders: [],
      beginVal: 2008,
      slider: null
    }
  },
  mounted() {
    this.generateTimeslider()
  },
  watch: {
    extent: {
      handler: function(val, oldVal) {
        if (val.length === 2 ){
          this.updateSlider()
        }
      }
    }
  },
  methods: {
    generateTimeslider() {
      var form = "MM-YYYY"
      var input = this.$el.querySelector("input.slider")
      $(input).ionRangeSlider({
        type: "double",
        drag_interval: true,
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

      this.slider = $(input).data("ionRangeSlider");

    },
    updateSlider() {
      console.log('this', this.slider)
      this.slider.update({
        type: "double",
        drag_interval: true,
        min: this.extent[0].format("x"),
        max: this.extent[1].format("x"),
        to_min: this.extent[0].format("x"),
        to_max: this.extent[1].format("x"),
        from_min: this.extent[0].format("x"),
        from_max: this.extent[1].format("x"),
        from: moment(this.beginVal, "YYYY").format("x")
      })
      bus.$emit('slider-update', {
        begindate:  moment(this.beginVal, "YYYY").format("YYYY"),
        enddate: this.extent[1].format("YYYY")
      })
    }
  }
}

</script>

<style>
@import 'ion-rangeslider/css/ion.rangeSlider.css';
@import 'ion-rangeslider/css/ion.rangeSlider.skinHTML5.css';

.time-slider {
  position: absolute;
  z-index: 1;
  margin: auto;
  margin-left: 30%;
  /* override nav margin-top */
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
  background: #1976D2;
}
.irs-slider {
  border-radius: 50%;
  background: #1976D2;
  width: 16px;
  height: 16px;
  box-shadow: none;
  border: none;
}

.irs-slider:hover {
  transform: scale(1.2);
  background: #1976D2;
}
.irs-slider.state_hover {
  transform: scale(1.2);
  background: #1976D2;
}
</style>
