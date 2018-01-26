import $ from 'jquery';
import ionRangeslider from 'ion-rangeslider/js/ion.rangeSlider.js';
import 'ion-rangeslider/css/ion.rangeSlider.css';
import 'ion-rangeslider/css/ion.rangeSlider.skinHTML5.css';

export default {
  name: "v-double-slider",
  template: "#v-double-slider",
  data() {
    return {
      defaultColor: "primary",
      isActive: false,
      state: 'playing',
      slider: null
    };
  },
  mounted() {
    let input = this.$el.querySelector("input.slider");
    $(input).ionRangeSlider({
      type: "double",
      drag_interval: true,
      min: this.min,
      max: this.max,
      from: this.from,
      step: this.step,
      to: this.to,
      grid: false,
      onFinish: (val) => {
        this.$emit('input', val);
      }

    });
    this.slider = $(input).data("ionRangeSlider");
  },
  watch: {
    from(val) {
      if (this.slider.dragging) {
        return;
      }
      this.slider.update({
        from: this.from
      });
    },
    to() {
      if (this.slider.dragging) {
        return;
      }
      this.slider.update({
        to: this.to
      });
    }

  },
  props: {
    min: {
      type: Number,
      default: 10
    },
    max: {
      type: Number,
      default: 100
    },
    from: {
      type: Number,
      required: false
    },
    to: {
      type: Number,
      required: false
    },
    step: {
      type: Number,
      required: false
    }
  },
  methods: {
    pause() {
      this.state = 'paused';
    },
    play() {
      this.state = 'playing';
    }
  },
  computed: {}
}
